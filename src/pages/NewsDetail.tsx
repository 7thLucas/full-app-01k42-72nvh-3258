import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Share2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { getFirstCategory, splitCategories } from "@/types";

import { useNewsItem, useNews } from "@/hooks/useNews";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryTags from "@/components/CategoryTags";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { newsItem: news, loading, error, refetch } = useNewsItem(id || "");
  const { news: allNews } = useNews();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-gray-600">Loading news article...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Failed to Load News
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              onClick={refetch}
            >
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </button>
            <Link
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              to="/news"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to News
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!news) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            News Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The news article you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            to="/news"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const relatedNews = allNews
    .filter((item) => {
      if (item.id === news.id) return false;
      
      // Check if any category matches
      const newsCategories = splitCategories(news.kategori);
      const itemCategories = splitCategories(item.kategori);
      
      return newsCategories.some(category => itemCategories.includes(category));
    })
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.subtitle || news.description,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              to="/news"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to News
            </Link>
            <button
              className="inline-flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              onClick={handleShare}
            >
              <Share2 className="mr-2" size={16} />
              Share
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="w-full h-64 md:h-96">
            <ImageWithFallback
              alt={news.title}
              className="w-full h-full object-cover"
              iconSize={64}
              src={news.image}
            />
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar size={16} />
              <span className="ml-2">{formatDate(news.createdAt)}</span>
              <User className="ml-6" size={16} />
              <span className="ml-2">{getFirstCategory(news.kategori)}</span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>

            {/* Summary */}
            {news.subtitle && (
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                {news.subtitle}
              </p>
            )}

            {/* Categories */}
            <div className="mb-8">
              <CategoryTags
                categories={news.kategori}
                maxDisplay={10}
                size="md"
                variant="blue"
              />
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {news.description?.includes("<") ? (
                <div
                  dangerouslySetInnerHTML={{ __html: news.description }}
                  className="text-gray-700 leading-relaxed whitespace-pre-line"
                />
              ) : (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {news.description}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Related News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map((relatedItem) => (
                <Link
                  key={relatedItem.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  to={`/news/${relatedItem.id}`}
                >
                  <ImageWithFallback
                    alt={relatedItem.title}
                    className="w-full h-48 object-cover"
                    iconSize={24}
                    src={relatedItem.image}
                  />
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={12} />
                      <span className="ml-1">
                        {formatDate(relatedItem.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {relatedItem.subtitle || relatedItem.description}
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
