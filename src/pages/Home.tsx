import type { MiniApp } from "@/types";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  User,
  Tag,
  MoreHorizontal,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import * as Icons from "lucide-react";

import { mockInformation, mockMiniApps } from "@/data/mockData";
import MiniAppsModal from "@/components/MiniAppsModal";
import ImageWithFallback from "@/components/ImageWithFallback";
import { useNews } from "@/hooks/useNews";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    news,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useNews();

  // Get featured/latest items
  const latestNews = news.filter((newsItem) => newsItem.featured).slice(0, 3);
  const topInformation = mockInformation
    .filter((info) => info.priority === "high")
    .slice(0, 3);
  const featuredMiniApps = mockMiniApps
    .filter((app) => app.featured && app.isActive)
    .slice(0, 8);

  const handleMiniAppSelect = (miniApp: MiniApp) => {
    navigate(`/miniapps/${miniApp.id}`);
  };

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{ size?: number }>;

    return IconComponent ? (
      <IconComponent size={20} />
    ) : (
      <Icons.Square size={20} />
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to Your Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Stay informed, access tools, and get things done efficiently
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Latest News Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
            <div className="flex items-center space-x-2">
              {newsError && (
                <button
                  className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Retry loading news"
                  onClick={refetchNews}
                >
                  <RefreshCw size={16} />
                </button>
              )}
              <Link
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                to="/news"
              >
                View All News
                <ArrowRight className="ml-2" size={16} />
              </Link>
            </div>
          </div>

          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
                <p className="text-gray-600">Loading latest news...</p>
              </div>
            </div>
          ) : newsError ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to load news
                </h3>
                <p className="text-gray-600 mb-4">{newsError}</p>
                <button
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  onClick={refetchNews}
                >
                  <RefreshCw className="mr-2" size={16} />
                  Try Again
                </button>
              </div>
            </div>
          ) : latestNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No featured news available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestNews.map((newsItem) => (
                <Link
                  key={newsItem.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  to={`/news/${newsItem.id}`}
                >
                  <ImageWithFallback
                    alt={newsItem.title}
                    className="w-full h-48 object-cover"
                    iconSize={32}
                    src={newsItem.imageUrl}
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={14} />
                      <span className="ml-1">
                        {formatDate(newsItem.publishDate)}
                      </span>
                      <User className="ml-4" size={14} />
                      <span className="ml-1">{newsItem.author}</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {newsItem.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{newsItem.summary}</p>
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag className="mr-1" size={12} />
                        {newsItem.category}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Information Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Important Information
            </h2>
            <Link
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              to="/information"
            >
              View All Information
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topInformation.map((info) => (
              <Link
                key={info.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                to={`/information/${info.id}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      info.priority === "high"
                        ? "bg-red-100 text-red-800"
                        : info.priority === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {info.priority.toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-500">{info.category}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {info.title}
                </h3>
                <p className="text-gray-600 mb-4">{info.summary}</p>
                <div className="flex flex-wrap gap-1">
                  {info.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* MiniApps Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">MiniApps</h2>
            <button
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              onClick={() => setIsModalOpen(true)}
            >
              View All MiniApps
              <MoreHorizontal className="ml-2" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {featuredMiniApps.map((app) => (
              <button
                key={app.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 text-center group"
                onClick={() => handleMiniAppSelect(app)}
              >
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-purple-50 rounded-lg text-purple-600 group-hover:bg-purple-100 transition-colors">
                    {getIcon(app.icon)}
                  </div>
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {app.name}
                </h3>
                <p className="text-xs text-gray-600">{app.category}</p>
              </button>
            ))}
          </div>
        </section>
      </div>

      {/* MiniApps Modal */}
      <MiniAppsModal
        isOpen={isModalOpen}
        miniApps={mockMiniApps}
        onClose={() => setIsModalOpen(false)}
        onSelectMiniApp={handleMiniAppSelect}
      />
    </div>
  );
}
