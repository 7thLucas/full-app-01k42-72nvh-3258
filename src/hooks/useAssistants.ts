// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type { AssistantItem, ChatSession } from "@/types";

import { useState, useEffect, useCallback } from "react";

import {
  fetchAssistants,
  fetchAssistantById,
  getOrCreateChatSession,
  sendChatMessage,
} from "@/services/deck.api";

export const useAssistants = () => {
  const [assistants, setAssistants] = useState<AssistantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssistants = async () => {
    try {
      setLoading(true);
      setError(null);
      const assistantsData = await fetchAssistants();

      setAssistants(assistantsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssistants();
  }, []);

  const refetch = () => {
    loadAssistants();
  };

  return {
    assistants,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching a single news item
export const useAssistantItem = (id: string) => {
  const [assistantItem, setAssistantItem] = useState<AssistantItem | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAssistantItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const item = await fetchAssistantById(id);

      setAssistantItem(item);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch news item",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadAssistantItem();
    }
  }, [id]);

  const refetch = () => {
    loadAssistantItem();
  };

  return {
    assistantItem,
    loading,
    error,
    refetch,
  };
};

// Hook for managing chat sessions
export const useChatSession = (assistantId?: string, userId?: string) => {
  const [session, setSession] = useState<ChatSession | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageError, setMessageError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const initializeSession = useCallback(async () => {
    if (!assistantId || !userId) return;

    try {
      setLoading(true);
      setError(null);
      setMessageError(null);
      const chatSession = await getOrCreateChatSession(assistantId, userId);

      setSession(chatSession);
    } catch (err) {
      console.error("Error initializing chat session:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to initialize chat session",
      );
    } finally {
      setLoading(false);
    }
  }, [assistantId, userId]);

  // Initialize session when assistantId or userId changes
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  // Function to refresh the current session
  const refreshSession = async () => {
    if (!assistantId || !userId) return;

    try {
      setLoading(true);
      setMessageError(null);
      const chatSession = await getOrCreateChatSession(assistantId, userId);

      setSession(chatSession);
    } catch (err) {
      console.error("Error refreshing chat session:", err);
      setError(
        err instanceof Error ? err.message : "Failed to refresh chat session",
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    if (!session || !message.trim()) return;

    try {
      setIsSending(true);
      setMessageError(null);
      const response = await sendChatMessage(session._id, message);

      // Update the session with the new messages
      if (response?.session) {
        await refreshSession();
      }

      return response;
    } catch (err) {
      console.error("Error sending message:", err);
      setMessageError(
        err instanceof Error ? err.message : "Failed to send message",
      );
      throw err;
    } finally {
      setIsSending(false);
    }
  };

  return {
    session,
    loading,
    error,
    refreshSession,
    initializeSession,
    sendMessage,
    isSending,
    messageError,
  };
};
