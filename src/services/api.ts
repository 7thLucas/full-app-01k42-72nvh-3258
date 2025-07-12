import type { NewsItem } from "@/types";

import axios from "axios";

import { createSummary } from "@/utils/htmlUtils";
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
  result: any[];
}

// Transform API data to our NewsItem format
const transformApiDataToNewsItem = async (apiData: any): Promise<NewsItem> => {
  // Extract base URL for images if needed
  let imageUrl: string | undefined;

  if (apiData.image && apiData.image.trim() !== "") {
    try {
      const config = await getApiConfig();

      imageUrl = `${config.baseUrl}/uploader/${config.keyspace}/${config.role}/document/${config.userId}/app-berita/${apiData.image}`;
    } catch (error) {
      // If config is not available, use a fallback or undefined
      console.warn("Failed to construct image URL:", error);
      imageUrl = undefined;
    }
  }

  // Clean up HTML content for summary
  const cleanSummary =
    apiData.subtitle ||
    (apiData.description ? createSummary(apiData.description, 200) : "") ||
    apiData.title ||
    "";

  return {
    id: apiData.id?.toString() || apiData._id?.toString() || "",
    title: apiData.title || "Untitled",
    summary: cleanSummary,
    content: apiData.description || "",
    publishDate: apiData.createdAt || new Date().toISOString(),
    author: "Admin", // API doesn't seem to have author field
    category: apiData.kategori || "General",
    imageUrl: imageUrl,
    featured: false, // We'll determine this based on recency or other criteria
  };
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
      `/informasi-umum/${config.keyspace}/${config.role}/list/${config.userId}`,
      { params },
    );

    if (response.data.status && Array.isArray(response.data.result)) {
      // Mark the first few items as featured (most recent)
      const newsItems = await Promise.all(
        response.data.result.map(
          async (item: any) => await transformApiDataToNewsItem(item),
        ),
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
  result: any;
}

// Fetch single news item by ID
export const fetchNewsById = async (id: string): Promise<NewsItem | null> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const response = await apiClient.get<ApiNewsDetailResponse>(
      `/informasi-umum/${config.keyspace}/${config.role}/detail/${config.userId}/${id}`,
    );

    if (response.data.status && response.data.result) {
      return await transformApiDataToNewsItem(response.data.result);
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
