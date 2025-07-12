import type { MiniApp } from "@/types";

import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";

import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryTags from "@/components/CategoryTags";
import { useNews } from "@/hooks/useNews";
import { useInformation } from "@/hooks/useInformation";
import { useMiniApps } from "@/hooks/useMiniApps";
import MiniAppsModal from "@/components/MiniAppsModal";

// Hero Section Component
function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Welcome to Your Hub
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Stay informed, access tools, and get things done efficiently
          </p>
        </div>
      </div>
    </section>
  );
}

// News Section Component
function NewsSection() {
  const {
    news,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useNews();

  const topNews = news.slice(0, 3);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-secondary-900">Latest News</h2>
        <div className="flex items-center space-x-2">
          {newsError && (
            <button
              className="inline-flex items-center px-3 py-2 text-primary-600 hover:text-primary-800 transition-colors"
              title="Retry loading news"
              onClick={refetchNews}
            >
              <RefreshCw size={16} />
            </button>
          )}
          <Link
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            to="/news"
          >
            View All News
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>

      {newsLoading ? (
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-secondary-600">Loading latest news...</p>
        </div>
      ) : newsError ? (
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-primary-500" size={48} />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Failed to load news
          </h3>
          <p className="text-secondary-600 mb-4">{newsError}</p>
          <button
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={refetchNews}
          >
            <RefreshCw className="mr-2" size={16} />
            Try Again
          </button>
        </div>
      ) : topNews.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-500 text-lg">
            No news articles available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {topNews.map((article) => (
            <Link
              key={article.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              to={`/news/${article.id}`}
            >
              <div className="h-48">
                <ImageWithFallback
                  alt={article.title}
                  className="w-full h-full object-cover"
                  iconSize={32}
                  src={article.image}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center text-sm text-secondary-500 mb-2">
                  <Calendar size={14} />
                  <span className="ml-1">
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2 line-clamp-2">
                  {article.title}
                </h3>
                <p
                  dangerouslySetInnerHTML={{ __html: article.subtitle || "" }}
                  className="text-secondary-600 mb-4 line-clamp-3"
                />
                <CategoryTags
                  categories={article.kategori}
                  maxDisplay={2}
                  size="sm"
                  variant="primary"
                />
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// Information Section Component
function InformationSection() {
  const {
    information,
    loading: informationLoading,
    error: informationError,
    refetch: refetchInformation,
  } = useInformation();

  const topInformation = information
    .filter((item) => item.featured)
    .slice(0, 3);

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-secondary-900">
          Important Information
        </h2>
        <div className="flex items-center space-x-2">
          {informationError && (
            <button
              className="inline-flex items-center px-3 py-2 text-primary-600 hover:text-primary-800 transition-colors"
              title="Retry loading information"
              onClick={refetchInformation}
            >
              <RefreshCw size={16} />
            </button>
          )}
          <Link
            className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            to="/information"
          >
            View All Information
            <ArrowRight className="ml-2" size={16} />
          </Link>
        </div>
      </div>

      {informationLoading ? (
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-secondary-600">Loading information...</p>
        </div>
      ) : informationError ? (
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-primary-500" size={48} />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Failed to load information
          </h3>
          <p className="text-secondary-600 mb-4">{informationError}</p>
          <button
            className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
            onClick={refetchInformation}
          >
            <RefreshCw className="mr-2" size={16} />
            Try Again
          </button>
        </div>
      ) : topInformation.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-500 text-lg">
            No featured information available at the moment.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {topInformation.map((info) => (
            <Link
              key={info.id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
              to={`/information/${info.id}`}
            >
              <div className="h-48">
                <ImageWithFallback
                  alt={info.title}
                  className="w-full h-full object-cover"
                  iconSize={32}
                  src={info.image}
                />
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-4 gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      info.priority === "high"
                        ? "bg-primary-100 text-primary-800"
                        : info.priority === "medium"
                          ? "bg-secondary-100 text-secondary-800"
                          : "bg-secondary-100 text-secondary-700"
                    }`}
                  >
                    {info.priority.toUpperCase()}
                  </span>
                  <span className="text-sm text-secondary-500 line-clamp-1 text-end">
                    {info.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-2 line-clamp-2">
                  {info.title}
                </h3>
                <p className="text-secondary-600 mb-4 line-clamp-3">
                  {info.summary}
                </p>
                <div className="flex flex-wrap gap-1">
                  {info.tags.slice(0, 3).map((tag: string) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

// MiniApps Section Component
function MiniAppsSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const {
    miniApps,
    loading: miniAppsLoading,
    error: miniAppsError,
    refetch: refetchMiniApps,
  } = useMiniApps();

  const topMiniApps = miniApps.slice(0, 8);

  const handleMiniAppSelect = (miniApp: MiniApp) => {
    navigate(`/miniapps/${miniApp.id}`);
    setIsModalOpen(false);
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-secondary-900">MiniApps</h2>
        {miniApps.length > 8 && (
          <button
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            View All MiniApps
            <ArrowRight className="ml-2" size={16} />
          </button>
        )}
      </div>

      {miniAppsLoading ? (
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-secondary-600">Loading MiniApps...</p>
        </div>
      ) : miniAppsError ? (
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-primary-500" size={48} />
          <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            Failed to load MiniApps
          </h3>
          <p className="text-secondary-600 mb-4">{miniAppsError}</p>
          <button
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            onClick={refetchMiniApps}
          >
            <RefreshCw className="mr-2" size={16} />
            Try Again
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {topMiniApps.map((miniApp) => {
            const IconComponent = Icons[
              miniApp.icon as keyof typeof Icons
            ] as React.ComponentType<{ size?: number }>;

            return (
              <button
                key={miniApp.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 text-center group relative h-full"
                onClick={() => handleMiniAppSelect(miniApp)}
              >
                <div className="p-3 bg-primary-50 rounded-lg text-primary-600 group-hover:bg-primary-100 transition-colors mb-2 w-fit mx-auto">
                  {IconComponent ? (
                    <IconComponent size={24} />
                  ) : (
                    <Icons.Square size={24} />
                  )}
                </div>
                <h3 className="font-medium text-secondary-900 text-sm mb-1 leading-tight h-full">
                  {miniApp.name}
                </h3>
                {miniAppsLoading && (
                  <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                    <RefreshCw
                      className="animate-spin text-primary-600"
                      size={16}
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* MiniApps Modal */}
      <MiniAppsModal
        isOpen={isModalOpen}
        miniApps={miniApps}
        onClose={() => setIsModalOpen(false)}
        onSelectMiniApp={handleMiniAppSelect}
      />
    </section>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <HeroSection />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <MiniAppsSection />

        <NewsSection />

        <InformationSection />
      </div>
    </div>
  );
}
