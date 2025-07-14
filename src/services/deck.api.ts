// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type { AssistantItem } from "@/types";

import axios from "axios";

import { getApiConfig } from "@/utils/deck.config";

// Create axios instance factory
const createApiClient = async () => {
  const config = await getApiConfig();

  return axios.create({
    baseURL: config.baseUrl,
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// API Response interface
interface ApiAssistantsResponse extends Array<AssistantItem> {}

// Fetch assistants list
export const fetchAssistants = async (): Promise<ApiAssistantsResponse> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const response = await apiClient.get<ApiAssistantsResponse>(`/assistants`, {
      params: {
        userId: config.userId,
        keyspace: config.keyspace,
        role: config.role,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch news: ${error.message}`);
    }
    throw new Error("Failed to fetch news data");
  }
};

// API Response interface for single news item
interface ApiAssistantDetailResponse extends AssistantItem {}

// Fetch single news item by ID
export const fetchAssistantById = async (
  id: string,
): Promise<AssistantItem | null> => {
  try {
    const config = await getApiConfig();
    const apiClient = await createApiClient();

    const response = await apiClient.get<ApiAssistantDetailResponse>(
      `/assistants/${id}`,
      {
        params: {
          userId: config.userId,
          keyspace: config.keyspace,
          role: config.role,
        },
      },
    );

    if (!response.data) {
      return null;
    }

    const item = response.data;

    return item;
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to fetch news item: ${error.message}`);
    }
    throw new Error("Failed to fetch news item");
  }
};

export default createApiClient;
