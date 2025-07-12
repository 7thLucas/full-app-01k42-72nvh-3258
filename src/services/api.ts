import type {
  NewsItem,
  NewsListApiResponse,
  NewsDetailApiResponse,
} from "@/types";

import axios from "axios";

import { transformNewsListItem, transformNewsDetailItem } from "@/types";
import { getApiConfig } from "@/utils/config";

// Create axios instance factory
const createApiClient = async () => {
  const config = await getApiConfig();

  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      Authorization: `Bearer ${config.bearerToken}`,
      "Content-Type": "application/json",
    },
  });
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
): Promise<string | undefined> => {
  if (!imagePath || imagePath.trim() === "") {
    return undefined;
  }

  try {
    const config = await getApiConfig();

    return `${config.baseUrl}/uploader/${config.keyspace}/${config.role}/document/${config.userId}/app-berita/${imagePath}`;
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
          const imageUrl = await constructImageUrl(item.gambar);

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
      const imageUrl = await constructImageUrl(item.gambar);

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

export default createApiClient;
