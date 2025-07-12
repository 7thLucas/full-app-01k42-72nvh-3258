import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, RefreshCw, AlertCircle, Share2, Bookmark, Clock } from "lucide-react";

import { useNews } from "@/hooks/useNews";
import { getFirstCategory } from "@/types";
import Layout from "@/components/Layout";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryTags from "@/components/CategoryTags";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { news, loading, error, refetch } = useNews();
  const [newsArticle, setNewsArticle] = useState<any>(null);

  useEffect(() => {
    if (id && news.length > 0) {
      const article = news.find((item) => item.id === id);
      setNewsArticle(article);
    }
  }, [id, news]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-4 animate-spin text-primary-600" size={48} />
            <p className="text-secondary-600">Loading news article...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <AlertCircle className="mx-auto mb-4 text-danger-500" size={48} />
            <h1 className="heading-3 text-secondary-900 mb-4">
              Error Loading Article
            </h1>
            <p className="text-secondary-600 mb-8">{error}</p>
            <div className="flex items-center justify-center space-x-4">
              <button
                className="btn btn-primary"
                onClick={refetch}
              >
                <RefreshCw className="mr-2" size={16} />
                Try Again
              </button>
              <Link
                className="btn btn-secondary"
                to="/"
              >
                <ArrowLeft className="mr-2" size={16} />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!newsArticle) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-md mx-auto">
            <h1 className="heading-3 text-secondary-900 mb-4">
              Article Not Found
            </h1>
            <p className="text-secondary-600 mb-8">
              The news article you're looking for doesn't exist or has been removed.
            </p>
            <Link
              className="btn btn-primary"
              to="/news"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to News
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const relatedNews = news
    .filter(
      (item) =>
        item.id !== newsArticle.id &&
        item.kategori
          .split(",")
          .some((cat: string) =>
            newsArticle.kategori.split(",").includes(cat.trim()),
          ),
    )
    .slice(0, 3);

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto container-padding py-6">
          <div className="flex items-center justify-between">
            <Link
              className="btn btn-ghost"
              to="/news"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to News
            </Link>
            <div className="flex items-center space-x-2">
              <button
                className="btn btn-ghost"
                onClick={() => navigator.share?.({ title: newsArticle.title, url: window.location.href })}
                title="Share article"
              >
                <Share2 size={16} />
              </button>
              <button
                className="btn btn-ghost"
                title="Bookmark article"
              >
                <Bookmark size={16} />
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => window.location.reload()}
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto container-padding py-8">
        <article className="card">
          {/* Featured Image */}
          <div className="w-full h-64 md:h-96 overflow-hidden rounded-t-xl">
            <ImageWithFallback
              alt={newsArticle.title}
              className="w-full h-full object-cover"
              iconSize={64}
              src={newsArticle.image}
            />
          </div>

          <div className="card-content">
            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-500 mb-6">
              <div className="flex items-center">
                <Calendar size={16} />
                <span className="ml-2">{formatDate(newsArticle.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} />
                <span className="ml-2">{formatRelativeTime(newsArticle.createdAt)}</span>
              </div>
              <div className="flex items-center">
                <User size={16} />
                <span className="ml-2">{getFirstCategory(newsArticle.kategori)}</span>
              </div>
              {newsArticle.featured && (
                <span className="badge badge-primary">Featured</span>
              )}
            </div>

            {/* Title */}
            <h1 className="heading-2 text-secondary-900 mb-6">
              {newsArticle.title}
            </h1>

            {/* Summary */}
            {newsArticle.subtitle && (
              <div className="bg-primary-50 border-l-4 border-primary-500 p-6 mb-8 rounded-r-lg">
                <p 
                  className="body-large text-secondary-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: newsArticle.subtitle }}
                />
              </div>
            )}

            {/* Categories */}
            <div className="mb-8">
              <CategoryTags
                categories={newsArticle.kategori}
                maxDisplay={10}
                size="md"
                variant="primary"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {newsArticle.description?.includes("<") ? (
                <div
                  dangerouslySetInnerHTML={{ __html: newsArticle.description }}
                  className="text-secondary-700 leading-relaxed"
                />
              ) : (
                <div className="whitespace-pre-line text-secondary-700 leading-relaxed">
                  {newsArticle.description}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="heading-3 text-secondary-900 mb-8">Related News</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((article) => (
                <Link
                  key={article.id}
                  className="card hover-lift group"
                  to={`/news/${article.id}`}
                >
                  <div className="h-40 overflow-hidden rounded-t-xl">
                    <ImageWithFallback
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      iconSize={24}
                      src={article.image}
                    />
                  </div>
                  <div className="card-content">
                    <div className="flex items-center text-sm text-secondary-500 mb-2">
                      <Calendar size={12} />
                      <span className="ml-1">{formatDate(article.createdAt)}</span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {article.title}
                    </h3>
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
          </div>
        )}
      </div>
    </Layout>
  );
}
