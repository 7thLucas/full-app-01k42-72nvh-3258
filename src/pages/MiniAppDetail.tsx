import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Maximize2,
  Minimize2,
} from "lucide-react";
import * as Icons from "lucide-react";

import { mockMiniApps } from "@/data/mockData";
import { useNavigationWithParams } from "@/utils/navigation";

export default function MiniAppDetail() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const getPathWithParams = useNavigationWithParams();

  const miniApp = mockMiniApps.find((app) => app.id === id);

  useEffect(() => {
    if (miniApp) {
      setIsLoading(true);
      setHasError(false);

      // Simulate loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [miniApp]);

  if (!miniApp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MiniApp Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The MiniApp you're looking for doesn't exist.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            to={getPathWithParams("/")}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!miniApp.isActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            MiniApp Unavailable
          </h1>
          <p className="text-gray-600 mb-8">
            This MiniApp is currently not available.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            to={getPathWithParams("/")}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Link>
        </div>
      </div>
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
    const iframe = document.getElementById(
      "miniapp-iframe",
    ) as HTMLIFrameElement;

    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const relatedApps = mockMiniApps
    .filter(
      (app) =>
        app.id !== miniApp.id &&
        app.category === miniApp.category &&
        app.isActive,
    )
    .slice(0, 4);

  return (
    <div
      className={`min-h-screen bg-gray-50 ${isFullscreen ? "fixed inset-0 z-50 bg-white" : ""}`}
    >
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                to={getPathWithParams("/")}
              >
                <ArrowLeft size={20} />
              </Link>
              <div className="flex items-center">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 mr-3">
                  {getIcon(miniApp.icon)}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    {miniApp.name}
                  </h1>
                  <p className="text-sm text-gray-500">{miniApp.category}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={handleRefresh}
              >
                <RefreshCw size={16} />
              </button>
              <button
                className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize2 size={16} />
                ) : (
                  <Maximize2 size={16} />
                )}
              </button>
              <a
                className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                href={miniApp.url}
                rel="noopener noreferrer"
                target="_blank"
              >
                <ExternalLink className="mr-2" size={16} />
                Open in New Tab
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* App Description (hidden in fullscreen) */}
      {!isFullscreen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
            <p className="text-gray-600">{miniApp.description}</p>
          </div>
        </div>
      )}

      {/* MiniApp Container */}
      <div
        className={`${isFullscreen ? "h-screen" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}`}
      >
        <div
          className={`bg-white rounded-lg shadow-sm overflow-hidden ${isFullscreen ? "h-full rounded-none" : "h-[calc(100vh-200px)]"}`}
        >
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
                <p className="text-gray-600">Loading {miniApp.name}...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {hasError && !isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <AlertTriangle
                  className="mx-auto mb-4 text-red-500"
                  size={48}
                />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to load MiniApp
                </h3>
                <p className="text-gray-600 mb-4">
                  There was an error loading {miniApp.name}. This might be due
                  to network issues or the app being temporarily unavailable.
                </p>
                <div className="space-x-4">
                  <button
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    onClick={handleRefresh}
                  >
                    <RefreshCw className="mr-2" size={16} />
                    Try Again
                  </button>
                  <a
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    href={miniApp.url}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <ExternalLink className="mr-2" size={16} />
                    Open Directly
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Iframe */}
          <iframe
            className={`w-full h-full border-0 ${isLoading || hasError ? "hidden" : "block"}`}
            id="miniapp-iframe"
            src={miniApp.url}
            title={miniApp.name}
            onError={handleIframeError}
            onLoad={handleIframeLoad}
          />
        </div>
      </div>

      {/* Related Apps (hidden in fullscreen) */}
      {!isFullscreen && relatedApps.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Related MiniApps
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {relatedApps.map((app) => (
              <Link
                key={app.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 text-center"
                to={getPathWithParams(`/miniapps/${app.id}`)}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                    {getIcon(app.icon)}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {app.name}
                </h3>
                <p className="text-xs text-gray-600">{app.category}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
