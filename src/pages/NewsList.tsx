import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Calendar,
  User,
  Tag,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Filter,
  SortAsc,
  Clock,
  TrendingUp,
} from "lucide-react";

import { getFirstCategory, splitCategories } from "@/types";
import { useNews } from "@/hooks/useNews";
import Layout from "@/components/Layout";
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

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";

    return formatDate(dateString);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h1 className="heading-3 text-secondary-900">News</h1>
                <p className="text-secondary-600 mt-1">
                  Stay updated with the latest news and insights
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-secondary-500 bg-secondary-50 px-3 py-2 rounded-lg">
                <TrendingUp className="mr-2" size={16} />
                {filteredNews.length}{" "}
                {filteredNews.length === 1 ? "article" : "articles"}
              </div>
              <button
                className="btn btn-ghost"
                disabled={loading}
                onClick={refetch}
              >
                <RefreshCw
                  className={loading ? "animate-spin" : ""}
                  size={16}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-padding py-8">
        {/* Enhanced Filters */}
        <div className="card mb-8">
          <div className="card-content">
            <div className="flex items-center mb-6">
              <Filter className="mr-2 text-secondary-500" size={20} />
              <h2 className="text-lg font-semibold text-secondary-900">
                Filter & Search
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  size={20}
                />
                <input
                  className="input pl-10"
                  placeholder="Search news articles..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Tag
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  size={20}
                />
                <select
                  className="input pl-10 appearance-none cursor-pointer"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <SortAsc
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  size={20}
                />
                <select
                  className="input pl-10 appearance-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                  <option value="category">Sort by Category</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* News List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-secondary-200 rounded-t-xl md:rounded-l-xl md:rounded-tr-none" />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center mb-3">
                      <div className="h-4 bg-secondary-200 rounded w-24" />
                      <div className="ml-4 h-4 bg-secondary-200 rounded w-16" />
                    </div>
                    <div className="h-6 bg-secondary-200 rounded mb-3" />
                    <div className="h-4 bg-secondary-200 rounded mb-4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-secondary-200 rounded-full w-16" />
                      <div className="h-6 bg-secondary-200 rounded-full w-20" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="mx-auto mb-4 text-danger-500" size={48} />
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              Failed to load news
            </h3>
            <p className="text-secondary-600 mb-6">{error}</p>
            <button className="btn btn-primary" onClick={refetch}>
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </button>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-secondary-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No articles found
            </h3>
            <p className="text-secondary-600 mb-6">
              Try adjusting your search criteria or browse all categories.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredNews.map((news, index) => (
              <article key={news.id} className="card hover-lift group">
                <div className="md:flex h-48 md:h-64">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                      <ImageWithFallback
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        iconSize={40}
                        src={news.image}
                      />
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-center text-sm text-secondary-500 mb-3">
                      <Calendar size={14} />
                      <span className="ml-2">{formatDate(news.createdAt)}</span>
                      <Clock className="ml-4" size={14} />
                      <span className="ml-1">
                        {formatRelativeTime(news.createdAt)}
                      </span>
                      <User className="ml-4" size={14} />
                      <span className="ml-1">
                        {getFirstCategory(news.kategori)}
                      </span>
                      {news.featured && (
                        <span className="ml-4 badge badge-primary">
                          Featured
                        </span>
                      )}
                      {index < 3 && (
                        <span className="ml-2 badge badge-success">Recent</span>
                      )}
                    </div>
                    <Link to={`/news/${news.id}`}>
                      <h2 className="heading-4 text-secondary-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2">
                        {news.title}
                      </h2>
                    </Link>
                    <div
                      dangerouslySetInnerHTML={{ __html: news.subtitle || "" }}
                      className="text-secondary-600 mb-4 line-clamp-3 body-small"
                    />
                    <div className="flex items-center justify-between">
                      <CategoryTags
                        categories={news.kategori}
                        maxDisplay={3}
                        size="sm"
                        variant="primary"
                      />
                      <Link
                        className="btn btn-ghost btn-sm group-hover:bg-primary-50 group-hover:text-primary-700"
                        to={`/news/${news.id}`}
                      >
                        Read More
                        <ArrowRight className="ml-1" size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
