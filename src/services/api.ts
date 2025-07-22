// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type {
  NewsItem,
  NewsListApiResponse,
  NewsDetailApiResponse,
  InformationItem,
  InformationListApiResponse,
  InformationDetailApiResponse,
  MiniApp,
  MiniAppListApiResponse,
  MiniAppBuildLogApiResponse,
} from "@/types";

import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

import {
  transformNewsListItem,
  transformNewsDetailItem,
  transformInformationListItem,
  transformInformationDetailItem,
  transformMiniAppListItem,
} from "@/types";
import { getApiConfig } from "@/utils/config";
import { getStoredToken } from "@/services/auth";
import { encodeParamsAES256 } from "@/utils/aes256";

// Create API client with automatic token handling
export const createApiClient = async (): Promise<AxiosInstance> => {
  const config = await getApiConfig();

  const client = axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Bearer ${config.bearerToken}`,
      "Content-Type": "application/json",
      "key-token": encodeParamsAES256(
        config.keyspace,
        config.role,
        config.userId,
      ),
    },
  });

  // Add request interceptor to include JWT token
  client.interceptors.request.use(
    async (config) => {
      const apiConfig = await getApiConfig();
      const token = getStoredToken(
        apiConfig.keyspace,
        apiConfig.role,
        apiConfig.userId,
      );

      if (token && config.headers) {
        config.headers["jwt-token"] = token;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Add response interceptor for automatic token refresh (same as auth service)
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        // Emit logout event to trigger context logout
        window.dispatchEvent(new CustomEvent("auth:logout"));

        return Promise.reject(error);
      }

      return Promise.reject(error);
    },
  );

  return client;
};

// Convenience function to make authenticated API calls
export const apiRequest = async <T = any>(
  config: AxiosRequestConfig,
): Promise<T> => {
  const client = await createApiClient();
  const response = await client(config);

  return response.data;
};

// API Response interface
interface ApiNewsResponse {
  status: boolean;
  code: number;
  message: string;
  total: number;
  result: NewsListApiResponse[];
}

// Helper function to construct full image URL
const constructImageUrl = async (
  imagePath: string,
  type: "berita" | "informasi-umum",
): Promise<string | undefined> => {
  if (!imagePath || imagePath.trim() === "") {
    return undefined;
  }

  const config = await getApiConfig();

  try {
    return `https://${config.keyspace}-service-client.quantumbyte.ai/uploads/app-${type}/${imagePath}`;
  } catch (error) {
    console.warn("Failed to construct image URL:", error);

    return undefined;
  }
};

// Fetch news list
export const fetchNews = async (
  startRow: number = 0,
  endRow: number = 100,
): Promise<NewsItem[]> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const params = {
      data: JSON.stringify({
        startRow,
        endRow,
        sortModel: [{ colId: "createdAt", sort: "desc" }],
      }),
    };

    const response = await apiClient.get<ApiNewsResponse>(
      `/berita/${config.keyspace}/${config.role}/list/${config.userId}`,
      { params },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      // Process the raw API data
      const newsItems = await Promise.all(
        response.data.result.map(async (item: NewsListApiResponse) => {
          // Transform the API response to NewsItem
          const newsItem = transformNewsListItem(item);

          // Construct full image URL if image exists
          const imageUrl = await constructImageUrl(item.gambar, "berita");

          return {
            ...newsItem,
            image: imageUrl,
          };
        }),
      );

      // Mark first 3 items as featured
      newsItems.slice(0, 3).forEach((item) => (item.featured = true));

      return newsItems;
    }

    return [];
  } catch (error) {
    console.error("Error fetching news:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
    throw new Error("Failed to fetch news data");
  }
};

// API Response interface for single news item
interface ApiNewsDetailResponse {
  status: boolean;
  code: number;
  message: string;
  result: NewsDetailApiResponse;
}

// Fetch single news item by ID
export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const response = await apiClient.get<ApiNewsDetailResponse>(
      `/berita/${config.keyspace}/${config.role}/detail/${config.userId}/${id}`,
    );

    if (response.data.status && response.data.result) {
      const item = response.data.result;

      // Transform the API response to NewsItem
      const newsItem = transformNewsDetailItem(item, id);

      // Construct full image URL if image exists
      const imageUrl = await constructImageUrl(item.gambar, "berita");

      return {
        ...newsItem,
        image: imageUrl,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch news item: ${error.message}`);
    }
    throw new Error("Failed to fetch news item");
  }
};

// API Response interface for Information
interface ApiInformationResponse {
  status: boolean;
  code: number;
  message: string;
  total: number;
  result: InformationListApiResponse[];
}

// Fetch information list
export const fetchInformation = async (
  startRow: number = 0,
  endRow: number = 100,
): Promise<InformationItem[]> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const params = {
      data: JSON.stringify({
        startRow,
        endRow,
        sortModel: [{ colId: "createdAt", sort: "desc" }],
      }),
    };

    const response = await apiClient.get<ApiInformationResponse>(
      `/informasi-umum/${config.keyspace}/${config.role}/list/${config.userId}`,
      { params },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      // Process the raw API data
      const informationItems = await Promise.all(
        response.data.result.map(async (item: InformationListApiResponse) => {
          // Transform the API response to InformationItem
          const informationItem = transformInformationListItem(item);

          // Construct full image URL if image exists
          const imageUrl = await constructImageUrl(
            item.image,
            "informasi-umum",
          );

          return {
            ...informationItem,
            image: imageUrl,
          };
        }),
      );

      // Mark first 3 items as featured
      informationItems.slice(0, 3).forEach((item) => (item.featured = true));

      return informationItems;
    }

    return [];
  } catch (error) {
    console.error("Error fetching information:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch information: ${error.message}`);
    }
    throw new Error("Failed to fetch information data");
  }
};

// API Response interface for single information item
interface ApiInformationDetailResponse {
  status: boolean;
  code: number;
  message: string;
  result: InformationDetailApiResponse;
}

// Fetch single information item by ID
export const fetchInformationById = async (
  id: string,
): Promise<InformationItem | null> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const response = await apiClient.get<ApiInformationDetailResponse>(
      `/informasi-umum/${config.keyspace}/${config.role}/detail/${config.userId}/${id}`,
    );

    if (response.data.status && response.data.result) {
      const item = response.data.result;

      // Transform the API response to InformationItem
      const informationItem = transformInformationDetailItem(item, id);

      // Construct full image URL if image exists
      const imageUrl = await constructImageUrl(item.image, "informasi-umum");

      return {
        ...informationItem,
        image: imageUrl,
      };
    }

    return null;
  } catch (error) {
    console.error("Error fetching information by ID:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch information item: ${error.message}`);
    }
    throw new Error("Failed to fetch information item");
  }
};

// API Response interface for MiniApp
interface ApiMiniAppResponse {
  status: boolean;
  code: number;
  message: string;
  total: number;
  result: MiniAppListApiResponse[];
}

// Fetch MiniApps list
export const fetchMiniApps = async (
  startRow: number = 0,
  endRow: number = 100,
): Promise<MiniApp[]> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const params = JSON.stringify({
      startRow: startRow,
      endRow: endRow,
      sortModel: [{ colId: "createdAt", sort: "desc" }],
    });

    const response = await apiClient.get<ApiMiniAppResponse>(
      `/layanan/${config.keyspace}/${config.role}/list/${config.userId}`,
      { params: { data: params } },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      // Filter only MICROSITE mode apps and transform
      const miniApps = response.data.result
        .filter((item: MiniAppListApiResponse) => item.mode === "MICROSITE")
        .filter((item: MiniAppListApiResponse) => !item.is_layanan_hidden)
        .filter(
          (item: MiniAppListApiResponse) =>
            !item.title.toLowerCase().includes("homepage"),
        )
        .filter((item: MiniAppListApiResponse) => item.status_publish === 1)
        .filter(
          (item: MiniAppListApiResponse) =>
            item.id_user.toString() === config.userId.toString() ||
            item.id_user.toString() === "1",
        )
        .map((item: MiniAppListApiResponse) => transformMiniAppListItem(item));

      // Mark first 8 items as featured
      miniApps.slice(0, 8).forEach((item) => (item.featured = true));

      // Now fetch URLs for each MiniApp
      const miniAppsWithUrls = await Promise.all(
        miniApps.map(async (miniApp) => {
          try {
            const buildLog = await fetchMiniAppBuildLog(miniApp.key);

            if (
              buildLog &&
              buildLog.detailLog &&
              buildLog.detailLog._microsite
            ) {
              const url = buildLog.detailLog._microsite.url;
              const isLoading = buildLog.is_already_build === 0 || !url;

              return {
                ...miniApp,
                url: url || "",
                isLoading,
              };
            }

            return {
              ...miniApp,
              url: "",
              isLoading: true,
            };
          } catch (error) {
            console.warn(
              `Failed to fetch build log for MiniApp ${miniApp.id}:`,
              error,
            );

            return {
              ...miniApp,
              url: "",
              isLoading: true,
            };
          }
        }),
      );

      return miniAppsWithUrls;
    }

    return [];
  } catch (error) {
    console.error("Error fetching MiniApps:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch MiniApps: ${error.message}`);
    }
    throw new Error("Failed to fetch MiniApps data");
  }
};

// Fetch MiniApp build log to get the URL
export const fetchMiniAppBuildLog = async (
  key: string,
): Promise<MiniAppBuildLogApiResponse["result"] | null> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const response = await apiClient.get<MiniAppBuildLogApiResponse>(
      `/layanan/${config.keyspace}/${config.role}/build-log/${config.userId}/${key}`,
    );

    if (response.data.status && response.data.result) {
      return response.data.result;
    }

    return null;
  } catch (error) {
    console.error("Error fetching MiniApp build log:", error);

    return null;
  }
};

// Fetch single MiniApp by ID
export const fetchMiniAppById = async (id: string): Promise<MiniApp | null> => {
  try {
    const miniApps = await fetchMiniApps();
    const miniApp = miniApps.find((app) => app.id === id);

    if (miniApp) {
      return miniApp;
    }

    return null;
  } catch (error) {
    console.error("Error fetching MiniApp by ID:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch MiniApp: ${error.message}`);
    }
    throw new Error("Failed to fetch MiniApp");
  }
};
