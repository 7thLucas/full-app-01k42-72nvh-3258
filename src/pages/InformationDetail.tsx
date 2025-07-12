import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  Share2,
  Tag,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { useInformationItem, useInformation } from "@/hooks/useInformation";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function InformationDetail() {
  const { id } = useParams<{ id: string }>();
  const {
    informationItem: information,
    loading,
    error,
    refetch,
  } = useInformationItem(id || "");
  const { information: allInformation } = useInformation();

  if (loading) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
          <p className="text-secondary-600">Loading information...</p>
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
            Failed to Load Information
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
              className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
              to="/information"
            >
              <ArrowLeft className="mr-2" size={16} />
              Back to Information
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!information) {
    return (
      <div className="min-h-screen bg-secondary-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Information Not Found
          </h1>
          <p className="text-secondary-600 mb-8">
            The information you're looking for doesn't exist.
          </p>
          <Link
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            to="/information"
          >
            <ArrowLeft className="mr-2" size={16} />
            Back to Information
          </Link>
        </div>
      </div>
    );
  }

  const relatedInformation = allInformation
    .filter(
      (item) =>
        item.id !== information.id && item.category === information.category,
    )
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-primary-100 text-primary-800";
      case "medium":
        return "bg-secondary-100 text-secondary-800";
      case "low":
        return "bg-secondary-100 text-secondary-700";
      default:
        return "bg-secondary-100 text-secondary-800";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle size={16} />;
      case "medium":
        return <AlertTriangle size={16} />;
      case "low":
        return <CheckCircle size={16} />;
      default:
        return null;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: information.title,
          text: information.summary,
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
    <div className="min-h-screen bg-secondary-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link
              className="inline-flex items-center text-secondary-600 hover:text-secondary-900 transition-colors"
              to="/information"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Information
            </Link>
            <button
              className="inline-flex items-center px-3 py-2 text-secondary-600 hover:text-secondary-900 transition-colors"
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
          {information.image && (
            <div className="w-full h-64 md:h-96 flex-shrink-0">
              <ImageWithFallback
                alt={information.title}
                className="w-full h-full object-cover"
                iconSize={64}
                src={information.image}
              />
            </div>
          )}

          <div className="p-8">
            {/* Article Meta */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(information.priority)}`}
                >
                  {getPriorityIcon(information.priority)}
                  <span className="ml-1">
                    {information.priority.toUpperCase()} PRIORITY
                  </span>
                </span>
                <span className="text-sm text-secondary-500">
                  {information.category}
                </span>
              </div>
              <div className="flex items-center text-sm text-secondary-500">
                <Clock size={16} />
                <span className="ml-2">
                  Last updated {formatDate(information.lastUpdated)}
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
              {information.title}
            </h1>

            {/* Subtitle */}
            {information.subtitle && (
              <p className="text-xl text-secondary-600 mb-8 leading-relaxed">
                {information.subtitle}
              </p>
            )}

            {/* Summary */}
            <div className="mb-8">
              <div
                dangerouslySetInnerHTML={{ __html: information.summary }}
                className="text-secondary-700 leading-relaxed"
              />
            </div>

            {/* Tags */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {information.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-secondary-100 text-secondary-700"
                  >
                    <Tag className="mr-1" size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Content */}
            {information.content && (
              <div className="mb-8">
                <div
                  dangerouslySetInnerHTML={{ __html: information.content }}
                  className="prose prose-lg max-w-none text-secondary-700"
                />
              </div>
            )}
          </div>
        </article>

        {/* Related Information */}
        {relatedInformation.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-secondary-900 mb-6">
              Related Information
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedInformation.map((info) => (
                <Link
                  key={info.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                  to={`/information/${info.id}`}
                >
                  {info.image && (
                    <div className="h-32">
                      <ImageWithFallback
                        alt={info.title}
                        className="w-full h-full object-cover"
                        iconSize={24}
                        src={info.image}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(info.priority)}`}
                      >
                        {getPriorityIcon(info.priority)}
                        <span className="ml-1">
                          {info.priority.toUpperCase()}
                        </span>
                      </span>
                      <span className="text-xs text-secondary-500">
                        {info.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-secondary-900 mb-2 line-clamp-2">
                      {info.title}
                    </h3>
                    <p className="text-sm text-secondary-600 line-clamp-3">
                      {info.summary}
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
