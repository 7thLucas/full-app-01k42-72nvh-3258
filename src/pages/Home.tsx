import type { MiniApp } from "@/types";

import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  RefreshCw,
  AlertCircle,
  Zap,
} from "lucide-react";
import * as Icons from "lucide-react";
import { useState } from "react";

import Layout from "@/components/Layout";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryTags from "@/components/CategoryTags";
import { useNews } from "@/hooks/useNews";
import { useInformation } from "@/hooks/useInformation";
import { useMiniApps } from "@/hooks/useMiniApps";
import MiniAppsModal from "@/components/MiniAppsModal";

// Enhanced Hero Section Component
function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-hero text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-800" />
      </div>

      <div className="relative max-w-7xl mx-auto container-padding section-padding">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-8 border border-white/20">
            <Zap className="mr-2" size={16} />
            Welcome to the Future of Professional Productivity
          </div>

          <h1 className="heading-1 mb-6 text-white">
            Your Ultimate
            <span className="block text-primary-200">Professional Hub</span>
          </h1>

          <p className="body-large mb-8 text-primary-100 max-w-2xl mx-auto">
            Stay informed with the latest news, access critical information, and
            boost your productivity with our suite of powerful
            mini-applications. Everything you need in one elegant platform.
          </p>
        </div>
      </div>
    </section>
  );
}

// Enhanced News Section Component
function NewsSection() {
  const {
    news,
    loading: newsLoading,
    error: newsError,
    refetch: refetchNews,
  } = useNews();

  const topNews = news.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="heading-3 text-secondary-900 mb-2">Latest News</h2>
          </div>
          <div className="flex items-center space-x-3">
            {newsError && (
              <button
                className="btn btn-ghost text-primary-600 hover:text-primary-800"
                title="Retry loading news"
                onClick={refetchNews}
              >
                <RefreshCw size={16} />
              </button>
            )}
            <Link className="btn btn-primary" to="/news">
              View All News
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>

        {newsLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-secondary-200 rounded-t-xl" />
                <div className="card-content">
                  <div className="h-4 bg-secondary-200 rounded mb-3" />
                  <div className="h-6 bg-secondary-200 rounded mb-2" />
                  <div className="h-4 bg-secondary-200 rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-secondary-200 rounded-full w-16" />
                    <div className="h-6 bg-secondary-200 rounded-full w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : newsError ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-danger-500" size={48} />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Failed to load news
            </h3>
            <p className="text-secondary-600 mb-6">{newsError}</p>
            <button className="btn btn-primary" onClick={refetchNews}>
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </button>
          </div>
        ) : topNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-500 body-large">
              No news articles available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {topNews.map((article, index) => (
              <Link
                key={article.id}
                className="card hover-lift group"
                to={`/news/${article.id}`}
              >
                <div className="h-48 overflow-hidden rounded-t-xl">
                  <ImageWithFallback
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    iconSize={32}
                    src={article.image}
                  />
                </div>
                <div className="card-content">
                  <div className="flex items-center text-sm text-secondary-500 mb-3">
                    <Calendar size={14} />
                    <span className="ml-2">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </span>
                    {index === 0 && (
                      <span className="ml-auto badge badge-primary">
                        Latest
                      </span>
                    )}
                  </div>
                  <h3 className="heading-4 text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {article.title}
                  </h3>
                  <p
                    dangerouslySetInnerHTML={{ __html: article.subtitle || "" }}
                    className="text-secondary-600 mb-4 line-clamp-3 body-small"
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
      </div>
    </section>
  );
}

// Enhanced Information Section Component
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
    <section className="section-padding bg-secondary-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="heading-3 text-secondary-900 mb-2">
              Important Information
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            {informationError && (
              <button
                className="btn btn-ghost text-primary-600 hover:text-primary-800"
                title="Retry loading information"
                onClick={refetchInformation}
              >
                <RefreshCw size={16} />
              </button>
            )}
            <Link className="btn btn-secondary" to="/information">
              View All Information
              <ArrowRight className="ml-2" size={16} />
            </Link>
          </div>
        </div>

        {informationLoading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-secondary-200 rounded-t-xl" />
                <div className="card-content">
                  <div className="flex justify-between mb-4">
                    <div className="h-6 bg-secondary-200 rounded-full w-16" />
                    <div className="h-4 bg-secondary-200 rounded w-20" />
                  </div>
                  <div className="h-6 bg-secondary-200 rounded mb-2" />
                  <div className="h-4 bg-secondary-200 rounded mb-4" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-secondary-200 rounded-full w-12" />
                    <div className="h-6 bg-secondary-200 rounded-full w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : informationError ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-danger-500" size={48} />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Failed to load information
            </h3>
            <p className="text-secondary-600 mb-6">{informationError}</p>
            <button className="btn btn-secondary" onClick={refetchInformation}>
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </button>
          </div>
        ) : topInformation.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-secondary-500 body-large">
              No featured information available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {topInformation.map((info) => (
              <Link
                key={info.id}
                className="card hover-lift group"
                to={`/information/${info.id}`}
              >
                <div className="h-48 overflow-hidden rounded-t-xl">
                  <ImageWithFallback
                    alt={info.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    iconSize={32}
                    src={info.image}
                  />
                </div>
                <div className="card-content">
                  <div className="flex items-center justify-between mb-4 gap-2">
                    <span
                      className={`badge ${
                        info.priority === "high"
                          ? "badge-danger"
                          : info.priority === "medium"
                            ? "badge-warning"
                            : "badge-secondary"
                      }`}
                    >
                      {info.priority.toUpperCase()}
                    </span>
                    <span className="text-sm text-secondary-500 line-clamp-1">
                      {info.category}
                    </span>
                  </div>
                  <h3 className="heading-4 text-secondary-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {info.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 line-clamp-3 body-small">
                    {info.summary}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {info.tags.slice(0, 3).map((tag: string) => (
                      <span key={tag} className="badge badge-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// Enhanced MiniApps Section Component
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
    <section className="section-padding" id="miniapps-section">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="heading-3 text-secondary-900 mb-2">MiniApps</h2>
          </div>
          {miniApps.length > 8 && (
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              View All
              <ArrowRight className="ml-2" size={16} />
            </button>
          )}
        </div>

        {miniAppsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="card-content text-center">
                  <div className="w-12 h-12 bg-secondary-200 rounded-lg mx-auto mb-3" />
                  <div className="h-4 bg-secondary-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : miniAppsError ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-danger-500" size={48} />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Failed to load MiniApps
            </h3>
            <p className="text-secondary-600 mb-6">{miniAppsError}</p>
            <button className="btn btn-primary" onClick={refetchMiniApps}>
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
                  className="card hover-lift group text-center p-6 transition-all duration-200 hover:shadow-medium"
                  onClick={() => handleMiniAppSelect(miniApp)}
                >
                  <div className="p-3 bg-primary-50 rounded-lg text-primary-600 group-hover:bg-primary-100 transition-colors mb-3 w-fit mx-auto">
                    {IconComponent ? (
                      <IconComponent size={24} />
                    ) : (
                      <Icons.Square size={24} />
                    )}
                  </div>
                  <h3 className="font-medium text-secondary-900 text-sm leading-tight">
                    {miniApp.name}
                  </h3>
                  {miniAppsLoading && (
                    <div className="absolute inset-0 bg-white/75 flex items-center justify-center rounded-xl">
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
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <Layout>
      <HeroSection />
      <MiniAppsSection />
      <NewsSection />
      <InformationSection />
    </Layout>
  );
}
