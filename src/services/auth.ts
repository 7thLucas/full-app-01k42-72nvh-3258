import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  EmailRegistrationRequest,
  EmailRegistrationResponse,
  PasswordRegistrationRequest,
  PasswordRegistrationResponse,
  RefreshTokenResponse,
} from "@/types/auth";

import axios from "axios";

import { getApiConfig } from "@/utils/config";

// Global flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });

  failedQueue = [];
};

// Create a basic axios instance without interceptors for refresh token calls
const createBasicAuthClient = async () => {
  const config = await getApiConfig();

  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Bearer ${config.bearerToken}`,
      "Content-Type": "application/json",
    },
  });
};

// Refresh token API function
export const refreshTokenApi = async (
  userToken: string,
  refreshToken: string,
): Promise<RefreshTokenResponse> => {
  try {
    const config = await getApiConfig();
    const authClient = await createBasicAuthClient();

    const response = await authClient.post<RefreshTokenResponse>(
      `/auth/member/${config.keyspace}/${config.role}/refresh-token/${config.userId}`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${config.bearerToken}`,
          "Content-Type": "application/json",
          "jwt-token": userToken,
        },
      },
    );

    if (response.data.status && response.data.result) {
      return response.data;
    }

    throw new Error(response.data.message || "Token refresh failed");
  } catch (error) {
    console.error("Refresh token error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 401) {
        throw new Error("Refresh token expired or invalid");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Token refresh failed: ${error.message}`);
    }
    throw new Error("Token refresh failed: Unknown error occurred");
  }
};

// Create axios instance for auth with interceptors
const createAuthClient = async () => {
  const config = await getApiConfig();

  const client = axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Bearer ${config.bearerToken}`,
      "Content-Type": "application/json",
    },
  });

  // Add response interceptor for automatic token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers["jwt-token"] = token;

              return client(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const storedToken = getStoredToken(
            config.keyspace,
            config.role,
            config.userId,
          );
          const storedRefreshToken = getStoredRefreshToken(
            config.keyspace,
            config.role,
            config.userId,
          );

          if (!storedToken || !storedRefreshToken) {
            throw new Error("No tokens available");
          }

          const refreshResponse = await refreshTokenApi(
            storedToken,
            storedRefreshToken,
          );

          // Update stored tokens
          storeToken(
            refreshResponse.result.jwt_token,
            refreshResponse.result.jwt_refresh_token,
            config.keyspace,
            config.role,
            config.userId,
          );

          // Update the request header with new token
          originalRequest.headers["jwt-token"] =
            refreshResponse.result.jwt_token;

          processQueue(null, refreshResponse.result.jwt_token);

          return client(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);

          // Clear tokens on refresh failure
          removeTokens(config.keyspace, config.role, config.userId);

          // Redirect to login or emit logout event
          window.dispatchEvent(new CustomEvent("auth:logout"));

          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Login function
export const login = async (
  loginData: LoginRequest,
): Promise<LoginResponse> => {
  try {
    const config = await getApiConfig();
    const authClient = await createAuthClient();

    const response = await authClient.post<LoginResponse>(
      `/auth/member/${config.keyspace}/${config.role}/login/${config.userId}`,
      loginData,
    );

    if (response.data.status && response.data.result) {
      return response.data;
    }

    throw new Error(response.data.message || "Login failed");
  } catch (error) {
    console.error("Login error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid phone number or password");
      }
      if (error.response?.status === 404) {
        throw new Error("User not found");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw new Error("Login failed: Unknown error occurred");
  }
};

// Token storage utilities
export const getStoredToken = (
  keyspace: string,
  role: string,
  userId: string,
): string | null => {
  const tokenKey = `token-${keyspace}-${role}-${userId}`;

  return localStorage.getItem(tokenKey);
};

export const storeToken = (
  token: string,
  refreshToken: string,
  keyspace: string,
  role: string,
  userId: string,
): void => {
  const tokenKey = `token-${keyspace}-${role}-${userId}`;
  const refreshTokenKey = `refresh-token-${keyspace}-${role}-${userId}`;

  localStorage.setItem(tokenKey, token);
  localStorage.setItem(refreshTokenKey, refreshToken);
};

export const removeTokens = (
  keyspace: string,
  role: string,
  userId: string,
): void => {
  const tokenKey = `token-${keyspace}-${role}-${userId}`;
  const refreshTokenKey = `refresh-token-${keyspace}-${role}-${userId}`;

  localStorage.removeItem(tokenKey);
  localStorage.removeItem(refreshTokenKey);
};

export const getStoredRefreshToken = (
  keyspace: string,
  role: string,
  userId: string,
): string | null => {
  const refreshTokenKey = `refresh-token-${keyspace}-${role}-${userId}`;

  return localStorage.getItem(refreshTokenKey);
};

// Step 1: Email registration function
export const registerWithEmail = async (
  emailRegistrationData: EmailRegistrationRequest,
): Promise<EmailRegistrationResponse> => {
  try {
    const config = await getApiConfig();
    const authClient = await createAuthClient();

    const response = await authClient.post<EmailRegistrationResponse>(
      `/auth/member/${config.keyspace}/${config.role}/registration/email/${config.userId}`,
      emailRegistrationData,
    );

    if (response.data.status && response.data.result) {
      return response.data;
    }

    throw new Error(response.data.message || "Email registration failed");
  } catch (error) {
    console.error("Email registration error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 400) {
        throw new Error("Invalid registration data");
      }
      if (error.response?.status === 409) {
        throw new Error("Phone number or email already exists");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Email registration failed: ${error.message}`);
    }
    throw new Error("Email registration failed: Unknown error occurred");
  }
};

// Step 2: Password registration function
export const registerWithPassword = async (
  passwordRegistrationData: PasswordRegistrationRequest,
): Promise<PasswordRegistrationResponse> => {
  try {
    const config = await getApiConfig();
    const authClient = await createAuthClient();

    const response = await authClient.post<PasswordRegistrationResponse>(
      `/auth/member/${config.keyspace}/${config.role}/registration/password/${config.userId}`,
      passwordRegistrationData,
    );

    if (response.data.status && response.data.result) {
      return response.data;
    }

    throw new Error(response.data.message || "Password registration failed");
  } catch (error) {
    console.error("Password registration error:", error);
    if (axios.isAxiosError(error)) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      if (error.response?.status === 400) {
        throw new Error("Invalid password registration data");
      }
      if (error.response?.status === 401) {
        throw new Error("Invalid or expired session");
      }
    }
    if (error instanceof Error) {
      throw new Error(`Password registration failed: ${error.message}`);
    }
    throw new Error("Password registration failed: Unknown error occurred");
  }
};

// Logout API function
export const logoutApi = async (userToken: string): Promise<void> => {
  try {
    const config = await getApiConfig();
    const authClient = await createAuthClient();

    await authClient.post(
      `/auth/member/${config.keyspace}/${config.role}/logout/${config.userId}`,
      {}, // Empty body
      {
        headers: {
          Authorization: `Bearer ${config.bearerToken}`,
          "Content-Type": "application/json",
          "jwt-token": userToken,
        },
      },
    );

    // Note: We don't need to check the response since logout should always succeed locally
    // even if the API call fails
  } catch (error) {
    console.error("Logout API error:", error);
    // Don't throw error for logout - we still want to clear local storage
    // even if the API call fails
  }
};

// Legacy registration function (updated to use two-step process)
export const register = async (
  registerData: RegisterRequest,
): Promise<RegisterResponse> => {
  try {
    // Step 1: Register with email (exclude password)
    const { password, ...emailData } = registerData;
    const emailResponse = await registerWithEmail(emailData);

    // Step 2: Register with password
    const passwordData: PasswordRegistrationRequest = {
      session_id: emailResponse.result.session_id,
      password: password,
    };

    const passwordResponse = await registerWithPassword(passwordData);

    // Return in the format expected by the legacy interface
    return {
      status: passwordResponse.status,
      code: passwordResponse.code,
      message: passwordResponse.message,
      result: passwordResponse.result,
    };
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error) {
      throw error; // Re-throw the error from the sub-functions
    }
    throw new Error("Registration failed: Unknown error occurred");
  }
};
