import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Tag, Share2, RefreshCw, AlertCircle } from 'lucide-react';

import { useNewsItem, useNews } from '@/hooks/useNews';
import { formatHtmlContent } from '@/utils/htmlUtils';
import { useNavigationWithParams } from '@/utils/navigation';
import ImageWithFallback from '@/components/ImageWithFallback';

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { newsItem: news, loading, error, refetch } = useNewsItem(id || '');
  const { news: allNews } = useNews();
  const getPathWithParams = useNavigationWithParams();

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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Failed to Load News</h1>
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
              to={getPathWithParams("/news")}
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News Not Found</h1>
          <p className="text-gray-600 mb-8">The news article you&apos;re looking for doesn&apos;t exist.</p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            to={getPathWithParams("/news")}
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to News
          </Link>
        </div>
      </div>
    );
  }

  const relatedNews = allNews
    .filter(item => item.id !== news.id && item.category === news.category)
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: news.title,
          text: news.summary,
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
              to={getPathWithParams("/news")}
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
              src={news.imageUrl}
              alt={news.title}
              className="w-full h-full object-cover"
              iconSize={64}
            />
          </div>

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar size={16} />
              <span className="ml-2">{formatDate(news.publishDate)}</span>
              <User className="ml-6" size={16} />
              <span className="ml-2">{news.author}</span>
              {news.featured && (
                <span className="ml-6 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Featured
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {news.title}
            </h1>

            {/* Summary */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {news.summary}
            </p>

            {/* Category */}
            <div className="mb-8">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Tag className="mr-1" size={14} />
                {news.category}
              </span>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {news.content.includes('<') ? (
                <div 
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
              ) : (
                <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                  {formatHtmlContent(news.content)}
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related News */}
        {relatedNews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related News</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedNews.map(relatedItem => (
                <Link
                  key={relatedItem.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  to={getPathWithParams(`/news/${relatedItem.id}`)}
                >
                  <ImageWithFallback
                    src={relatedItem.imageUrl}
                    alt={relatedItem.title}
                    className="w-full h-48 object-cover"
                    iconSize={24}
                  />
                  <div className="p-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar size={12} />
                      <span className="ml-1">{formatDate(relatedItem.publishDate)}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedItem.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {relatedItem.summary}
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