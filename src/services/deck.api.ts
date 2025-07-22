// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type { AssistantItem, ChatMessage, ChatSession } from "@/types";

import axios from "axios";

import { getApiConfig } from "@/utils/deck.config";
import { encodeParamsAES256 } from "@/utils/aes256";

// Create axios instance factory
const createApiClient = async () => {
  const config = await getApiConfig();

  return axios.create({
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

// Get or create a chat session for an assistant and user
export const getOrCreateChatSession = async (
  assistantId: string,
  userId: string,
): Promise<ChatSession> => {
  try {
    const apiClient = await createApiClient();

    /**
     * DEVELOPER NOTE, IGNORE THIS
     * TODO: properly put userId, keyspace, and role of the visitor
     * Not putting userId, keyspace, and role of the visitor here
     * because it will trigger credit check and deduction
     */
    const response = await apiClient.get(
      `/sessions/${assistantId}/sessions/${userId}`,
    );

    if (!response.data) {
      throw new Error("Failed to get or create chat session");
    }

    return response.data;
  } catch (error) {
    console.error("Error getting or creating chat session:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to get or create chat session: ${error.message}`);
    }
    throw new Error("Failed to get or create chat session");
  }
};

// Add to deck.api.ts
export const sendChatMessage = async (
  sessionId: string,
  message: string,
): Promise<{
  message: ChatMessage;
  session: { id: string; messageCount: number };
}> => {
  try {
    const apiClient = await createApiClient();
    const response = await apiClient.post(`/sessions/${sessionId}/messages`, {
      message: message,
    });

    return response.data;
  } catch (error) {
    console.error("Error sending message:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
    throw new Error("Failed to send message");
  }
};

export default createApiClient;
