import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import {
  getFirstCategory,
  formatCategoriesForDisplay,
  splitCategories,
} from "@/types";
import { useNews } from "@/hooks/useNews";
import ImageWithFallback from "@/components/ImageWithFallback";
import CategoryTags from "@/components/CategoryTags";

export default function NewsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const { news, loading, error, refetch } = useNews();

  // Get all unique categories from all news items
  const allCategories = news.flatMap((newsItem) =>
    splitCategories(newsItem.kategori),
  );
  const categories = ["All", ...Array.from(new Set(allCategories))];

  const filteredNews = news
    .filter((news) => {
      const matchesSearch =
        news.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" ||
        splitCategories(news.kategori).includes(selectedCategory);

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
      } else if (sortBy === "category") {
        return getFirstCategory(a.kategori).localeCompare(
          getFirstCategory(b.kategori),
        );
      }

      return 0;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                to="/"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">News</h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredNews.length}{" "}
              {filteredNews.length === 1 ? "article" : "articles"}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search news..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
        </div>

        {/* News List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <RefreshCw className="mx-auto mb-4 animate-spin" size={48} />
              <p className="text-gray-600">Loading news...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Failed to load news
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                onClick={refetch}
              >
                <RefreshCw className="mr-2" size={16} />
                Try Again
              </button>
            </div>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No news articles found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((news) => (
              <article
                key={news.id}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <ImageWithFallback
                      alt={news.title}
                      className="w-full h-48 md:h-full object-cover"
                      iconSize={40}
                      src={news.image}
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center text-sm text-gray-500 mb-3">
                      <Calendar size={14} />
                      <span className="ml-1">{formatDate(news.createdAt)}</span>
                      <User className="ml-4" size={14} />
                      <span className="ml-1">
                        {getFirstCategory(news.kategori)}
                      </span>
                      {news.featured && (
                        <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <Link to={`/news/${news.id}`}>
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        {news.title}
                      </h2>
                    </Link>
                    <div
                      dangerouslySetInnerHTML={{ __html: news.description }}
                      className="text-gray-600 mb-4 line-clamp-3"
                    />
                    <div className="flex items-center justify-between">
                      <CategoryTags
                        categories={news.kategori}
                        maxDisplay={3}
                        size="sm"
                        variant="blue"
                      />
                      <Link
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        to={`/news/${news.id}`}
                      >
                        Read More →
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
