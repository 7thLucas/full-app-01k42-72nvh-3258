// THIS FILE IS STATIC, THEREFORE NEVER CHANGE IT

import type { MiniApp } from "@/types";

import { useState, useEffect } from "react";

import { fetchMiniApps } from "@/services/api";

interface UseMiniAppsReturn {
  miniApps: MiniApp[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useMiniApps = (): UseMiniAppsReturn => {
  const [miniApps, setMiniApps] = useState<MiniApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMiniApps = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchMiniApps();

      setMiniApps(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch MiniApps";

      setError(errorMessage);
      console.error("Error loading MiniApps:", err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = async () => {
    await loadMiniApps();
  };

  useEffect(() => {
    loadMiniApps();
  }, []);

  return {
    miniApps,
    loading,
    error,
    refetch,
  };
};

export default useMiniApps;
