// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type { AssistantItem } from "@/types";

import { useState, useEffect } from "react";

import { fetchAssistants, fetchAssistantById } from "@/services/deck.api";

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
