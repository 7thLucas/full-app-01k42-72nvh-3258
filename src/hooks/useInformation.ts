// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type { InformationItem } from "@/types";

import { useState, useEffect } from "react";

import { fetchInformation, fetchInformationById } from "@/services/api";

// Hook for fetching information list
export const useInformation = () => {
  const [information, setInformation] = useState<InformationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInformation = async () => {
    try {
      setLoading(true);
      setError(null);
      const informationData = await fetchInformation();

      setInformation(informationData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch information",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInformation();
  }, []);

  const refetch = () => {
    loadInformation();
  };

  return {
    information,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching a single information item
export const useInformationItem = (id: string) => {
  const [informationItem, setInformationItem] =
    useState<InformationItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInformationItem = async () => {
    try {
      setLoading(true);
      setError(null);
      const item = await fetchInformationById(id);

      setInformationItem(item);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch information item",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadInformationItem();
    }
  }, [id]);

  const refetch = () => {
    loadInformationItem();
  };

  return {
    informationItem,
    loading,
    error,
    refetch,
  };
};
