import type { MiniApp } from "@/types";

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import * as Icons from "lucide-react";

import { fetchMiniAppById } from "@/services/api";
import { getApiConfig } from "@/utils/config";
import Layout from "@/components/Layout";

export default function MiniAppDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [miniApp, setMiniApp] = useState<MiniApp | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [config, setConfig] = useState<{
    keyspace: string;
    userId: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const loadConfig = async () => {
      const config = await getApiConfig();

      setConfig({
        keyspace: config.keyspace,
        userId: config.userId,
        role: config.role,
      });
    };

    loadConfig();
  }, []);

  useEffect(() => {
    const loadMiniApp = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        setFetchError(null);

        const data = await fetchMiniAppById(id);

        if (data) {
          setMiniApp(data);
          // If the app is still loading (building), show loading state
          if (data.isLoading) {
            setIsLoading(true);
            setHasError(false);
          } else {
            setIsLoading(false);
            setHasError(false);
          }
        } else {
          setMiniApp(null);
          setFetchError("MiniApp not found");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error loading MiniApp:", error);
        setFetchError(
          error instanceof Error ? error.message : "Failed to load MiniApp",
        );
        setIsLoading(false);
      }
    };

    loadMiniApp();
  }, [id]);

  if (fetchError || (!miniApp && !isLoading)) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MiniApp Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            {fetchError || "The MiniApp you're looking for doesn't exist."}
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            to="/"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  if (!miniApp) {
    return (
      <Layout>
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-gray-600">Loading MiniApp...</p>
        </div>
      </Layout>
    );
  }

  if (!config) {
    return (
      <Layout>
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-gray-600">Loading config...</p>
        </div>
      </Layout>
    );
  }

  if (!miniApp.isActive) {
    return (
      <Layout>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MiniApp Unavailable
          </h1>
          <p className="text-gray-600 mb-8">
            This MiniApp is currently not available.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            to="/"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{ size?: number }>;

    return IconComponent ? (
      <IconComponent size={24} />
    ) : (
      <Icons.Square size={24} />
    );
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
  };

  return (
    <Layout hideFooter className="flex h-screen">
      {/* MiniApp Container */}
      <div className={`bg-white rounded-lg shadow-sm flex-1`}>
        {/* Loading State */}
        {(isLoading || miniApp.isLoading) && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
              <p className="text-gray-600">
                {miniApp.isLoading
                  ? `Building ${miniApp.name}...`
                  : `Loading ${miniApp.name}...`}
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && !isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load MiniApp
              </h3>
              <p className="text-gray-600 mb-4">
                There was an error loading {miniApp.name}. This might be due to
                network issues or the app being temporarily unavailable.
              </p>
              <div className="space-x-4">
                <button
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="mr-2" size={16} />
                  Try Again
                </button>
                {miniApp.url && (
                  <a
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    href={miniApp.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="mr-2" size={16} />
                    Open Directly
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Iframe */}
        {miniApp.url && !miniApp.isLoading && (
          <iframe
            className={`w-full h-full border-0 ${isLoading || hasError ? "hidden" : "block"}`}
            id="miniapp-iframe"
            src={`${miniApp.url}?utm_source=quantumbyte.ai&utm_medium=referral&t=${Date.now().toString()}&userId=${config.userId}&keyspace=${config.keyspace}&role=${config.role}`}
            title={miniApp.name}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        )}
      </div>
    </Layout>
  );
}
