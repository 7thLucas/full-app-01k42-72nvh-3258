import type {
  AuthContext as AuthContextType,
  User,
  RegisterRequest,
  EmailRegistrationRequest,
  EmailRegistrationResponse,
  PasswordRegistrationRequest,
} from "@/types/auth";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import {
  login as loginApi,
  register as registerApi,
  registerWithEmail as registerWithEmailApi,
  registerWithPassword as registerWithPasswordApi,
  refreshTokenApi,
  logoutApi,
  storeToken,
  removeTokens,
  getStoredToken,
  getStoredRefreshToken,
} from "@/services/auth";
import { getApiConfig } from "@/utils/config";

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for stored tokens on mount
  useEffect(() => {
    const checkStoredAuth = async () => {
      try {
        const config = await getApiConfig();
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

        if (storedToken && storedRefreshToken) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error("Error checking stored auth:", error);
      } finally {
        setLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  // Listen for automatic logout events from token refresh failures
  useEffect(() => {
    const handleAutoLogout = () => {
      setUser(null);
      setToken(null);
      setRefreshToken(null);
    };

    window.addEventListener("auth:logout", handleAutoLogout);

    return () => {
      window.removeEventListener("auth:logout", handleAutoLogout);
    };
  }, []);

  // Manual refresh token function
  const refreshTokens = async (): Promise<void> => {
    if (!token || !refreshToken) {
      throw new Error("No tokens available for refresh");
    }

    try {
      const response = await refreshTokenApi(token, refreshToken);

      if (response.status && response.result) {
        const config = await getApiConfig();

        // Update stored tokens
        storeToken(
          response.result.jwt_token,
          response.result.jwt_refresh_token,
          config.keyspace,
          config.role,
          config.userId,
        );

        // Update state
        setToken(response.result.jwt_token);
        setRefreshToken(response.result.jwt_refresh_token);
      } else {
        throw new Error(response.message || "Token refresh failed");
      }
    } catch (error) {
      console.error("Manual token refresh error:", error);
      // Force logout on refresh failure
      await logout();
      throw error;
    }
  };

  // Login function
  const login = async (phone: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await loginApi({ phone, password });

      if (response.status && response.result) {
        const {
          jwt_token,
          jwt_refresh_token,
          user: userData,
        } = response.result;
        const config = await getApiConfig();

        // Store tokens
        storeToken(
          jwt_token,
          jwt_refresh_token,
          config.keyspace,
          config.role,
          config.userId,
        );

        // Update state
        setToken(jwt_token);
        setRefreshToken(jwt_refresh_token);
        setUser(userData);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      // Call logout API if user has a token
      if (token) {
        await logoutApi(token);
      }

      const config = await getApiConfig();

      removeTokens(config.keyspace, config.role, config.userId);

      setUser(null);
      setToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Step 1: Email registration function
  const registerWithEmail = async (
    data: EmailRegistrationRequest,
  ): Promise<EmailRegistrationResponse> => {
    setLoading(true);
    try {
      const response = await registerWithEmailApi(data);

      if (response.status && response.result) {
        return response;
      } else {
        throw new Error(response.message || "Email registration failed");
      }
    } catch (error) {
      console.error("Email registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Password registration function
  const registerWithPassword = async (
    data: PasswordRegistrationRequest,
  ): Promise<void> => {
    setLoading(true);
    try {
      const response = await registerWithPasswordApi(data);

      if (response.status && response.result) {
        // Registration is complete, but we still need to log the user in
        // The API doesn't automatically log in after password registration
        return;
      } else {
        throw new Error(response.message || "Password registration failed");
      }
    } catch (error) {
      console.error("Password registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Legacy register function (updated to use two-step process)
  const register = async (data: RegisterRequest): Promise<void> => {
    setLoading(true);
    try {
      const response = await registerApi(data);

      if (response.status && response.result) {
        // After successful registration, automatically log the user in
        await login(data.phone, data.password);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    refreshToken,
    isAuthenticated: !!token && !!user,
    login,
    register,
    registerWithEmail,
    registerWithPassword,
    logout,
    loading,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
