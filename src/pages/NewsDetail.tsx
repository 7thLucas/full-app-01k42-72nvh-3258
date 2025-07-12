import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";

import { useNews } from "@/hooks/useNews";
import { getFirstCategory } from "@/types";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-secondary-600">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-primary-500" size={48} />
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Error Loading Article
          </h1>
          <p className="text-secondary-600 mb-8">{error}</p>
          <div className="flex items-center justify-center space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              onClick={refetch}
            >
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </button>
            <Link
              className="inline-flex items-center px-4 py-2 border border-secondary-300 text-secondary-700 rounded-lg hover:bg-secondary-50 transition-colors"
              to="/"
            >
              <ArrowLeft className="mr-2" size={16} />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!newsArticle) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Article Not Found
          </h1>
          <p className="text-secondary-600 mb-8">
            The news article you're looking for doesn't exist or has been
            removed.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            to="/news"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              className="inline-flex items-center text-secondary-600 hover:text-secondary-900 transition-colors"
              to="/news"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to News
            </Link>
            <button
              className="inline-flex items-center px-3 py-2 text-secondary-600 hover:text-secondary-900 transition-colors"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-64 md:h-96">
            <ImageWithFallback
              alt={newsArticle.title}
              className="w-full h-full object-cover"
              iconSize={64}
              src={newsArticle.image}
            />
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex items-center text-sm text-secondary-500 mb-6">
              <Calendar size={16} />
              <span className="ml-2">{formatDate(newsArticle.createdAt)}</span>
              <User className="ml-6" size={16} />
              <span className="ml-2">{getFirstCategory(newsArticle.kategori)}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {newsArticle.title}
            </h1>

            {/* Summary */}
            {newsArticle.subtitle && (
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                {newsArticle.subtitle}
              </p>
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
                  className="text-secondary-700 leading-relaxed whitespace-pre-line"
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
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Related News
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedNews.map((article) => (
                <Link
                  key={article.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  to={`/news/${article.id}`}
                >
                  <div className="h-32">
                    <ImageWithFallback
                      alt={article.title}
                      className="w-full h-full object-cover"
                      iconSize={24}
                      src={article.image}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center text-sm text-secondary-500 mb-2">
                      <Calendar size={14} />
                      <span className="ml-1">
                        {formatDate(article.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-secondary-600 line-clamp-3">
                      {article.subtitle}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
