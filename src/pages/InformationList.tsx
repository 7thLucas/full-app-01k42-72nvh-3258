import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Filter,
  SortAsc,
  Tag,
  TrendingUp,
  Info,
  Calendar,
  Star,
} from "lucide-react";

import { useInformation } from "@/hooks/useInformation";
import Layout from "@/components/Layout";
import ImageWithFallback from "@/components/ImageWithFallback";

export default function InformationList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [sortBy, setSortBy] = useState("priority");

  const { information, loading, error, refetch } = useInformation();

  const categories = [
    "All",
    ...Array.from(new Set(information.map((info) => info.category))),
  ];
  const priorities = ["All", "high", "medium", "low"];

  const filteredInformation = information
    .filter((info) => {
      const matchesSearch =
        info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        info.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        );
      const matchesCategory =
        selectedCategory === "All" || info.category === selectedCategory;
      const matchesPriority =
        selectedPriority === "All" || info.priority === selectedPriority;

      return matchesSearch && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 3, medium: 2, low: 1 };

        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === "date") {
        return (
          new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
        );
      } else if (sortBy === "title") {
        return a.title.localeCompare(b.title);
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
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;

    return formatDate(dateString);
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "badge-danger";
      case "medium":
        return "badge-warning";
      case "low":
        return "badge-success";
      default:
        return "badge-secondary";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle size={14} />;
      case "medium":
        return <AlertTriangle size={14} />;
      case "low":
        return <CheckCircle size={14} />;
      default:
        return <Info size={14} />;
    }
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-border/50 shadow-soft">
        <div className="max-w-7xl mx-auto container-padding py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div>
                <h1 className="heading-3 text-secondary-900">Information</h1>
                <p className="text-secondary-600 mt-1">
                  Important updates and essential information
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-secondary-500 bg-secondary-50 px-3 py-2 rounded-lg">
                <TrendingUp className="mr-2" size={16} />
                {filteredInformation.length}{" "}
                {filteredInformation.length === 1 ? "item" : "items"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  size={20}
                />
                <input
                  className="input pl-10"
                  placeholder="Search information..."
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
                <AlertTriangle
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                  size={20}
                />
                <select
                  className="input pl-10 appearance-none cursor-pointer"
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value)}
                >
                  <option value="All">All Priorities</option>
                  {priorities.slice(1).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}{" "}
                      Priority
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
                  <option value="priority">Sort by Priority</option>
                  <option value="date">Sort by Date</option>
                  <option value="title">Sort by Title</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Information List */}
        {loading ? (
          <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex">
                  <div className="w-48 h-32 bg-secondary-200 rounded-l-xl flex-shrink-0" />
                  <div className="flex-1 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex space-x-3">
                        <div className="h-6 bg-secondary-200 rounded-full w-16" />
                        <div className="h-4 bg-secondary-200 rounded w-20" />
                      </div>
                      <div className="h-4 bg-secondary-200 rounded w-24" />
                    </div>
                    <div className="h-6 bg-secondary-200 rounded mb-3" />
                    <div className="h-4 bg-secondary-200 rounded mb-4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-secondary-200 rounded-full w-12" />
                      <div className="h-6 bg-secondary-200 rounded-full w-16" />
                      <div className="h-6 bg-secondary-200 rounded-full w-14" />
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
              Failed to load information
            </h3>
            <p className="text-secondary-600 mb-6">{error}</p>
            <button className="btn btn-primary" onClick={refetch}>
              <RefreshCw className="mr-2" size={16} />
              Try Again
            </button>
          </div>
        ) : filteredInformation.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-secondary-400" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-secondary-900 mb-2">
              No information found
            </h3>
            <p className="text-secondary-600 mb-6">
              Try adjusting your search criteria or browse all categories.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All");
                setSelectedPriority("All");
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInformation.map((info) => (
              <article key={info.id} className="card hover-lift group">
                <div className="md:flex h-48 md:h-64">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full overflow-hidden rounded-t-xl md:rounded-l-xl md:rounded-tr-none">
                      <ImageWithFallback
                        alt={info.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        iconSize={24}
                        src={info.image}
                      />
                    </div>
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`badge ${getPriorityBadge(info.priority)}`}
                        >
                          <span className="ml-1">
                            {info.priority.toUpperCase()}
                          </span>
                        </span>
                        {info.featured && (
                          <span className="badge badge-primary">
                            <Star size={14} />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-sm text-secondary-500">
                        <Calendar size={14} />
                        <span className="ml-1">
                          {formatRelativeTime(info.lastUpdated)}
                        </span>
                      </div>
                    </div>

                    <Link to={`/information/${info.id}`}>
                      <h2 className="heading-4 text-secondary-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2">
                        {info.title}
                      </h2>
                    </Link>

                    <div
                      dangerouslySetInnerHTML={{ __html: info.summary }}
                      className="text-secondary-600 mb-4 line-clamp-3 body-small"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {info.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="badge badge-secondary">
                            {tag}
                          </span>
                        ))}
                        {info.tags.length > 4 && (
                          <span className="badge badge-secondary">
                            +{info.tags.length - 4} more
                          </span>
                        )}
                      </div>
                      <Link
                        className="btn btn-ghost btn-sm group-hover:bg-primary-50 group-hover:text-primary-700"
                        to={`/information/${info.id}`}
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
