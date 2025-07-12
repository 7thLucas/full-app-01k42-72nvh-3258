import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Clock, AlertCircle, ArrowLeft } from 'lucide-react';

import { mockInformation } from '@/data/mockData';
import { useNavigationWithParams } from '@/utils/navigation';

export default function InformationList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPriority, setSelectedPriority] = useState('All');
  const [sortBy, setSortBy] = useState('priority');
  const getPathWithParams = useNavigationWithParams();

  const categories = ['All', ...Array.from(new Set(mockInformation.map(info => info.category)))];
  const priorities = ['All', 'high', 'medium', 'low'];

  const filteredInformation = mockInformation
    .filter(info => {
      const matchesSearch = info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           info.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           info.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || info.category === selectedCategory;
      const matchesPriority = selectedPriority === 'All' || info.priority === selectedPriority;
      
      return matchesSearch && matchesCategory && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      } else if (sortBy === 'date') {
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      
      return 0;
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={14} />;
      case 'medium':
        return <Clock size={14} />;
      case 'low':
        return <Clock size={14} />;
      default:
        return null;
    }
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
                to={getPathWithParams("/")}
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Information</h1>
            </div>
            <div className="text-sm text-gray-500">
              {filteredInformation.length} {filteredInformation.length === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Search information..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              {priorities.slice(1).map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
                </option>
              ))}
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="priority">Sort by Priority</option>
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
            </select>
          </div>
        </div>

        {/* Information List */}
        {filteredInformation.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No information found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredInformation.map(info => (
              <article key={info.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(info.priority)}`}>
                      {getPriorityIcon(info.priority)}
                      <span className="ml-1">{info.priority.toUpperCase()}</span>
                    </span>
                    <span className="text-sm text-gray-500">{info.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock size={14} />
                    <span className="ml-1">Updated {formatDate(info.lastUpdated)}</span>
                  </div>
                </div>
                
                <Link to={getPathWithParams(`/information/${info.id}`)}>
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 hover:text-green-600 transition-colors">
                    {info.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{info.summary}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {info.tags.slice(0, 4).map(tag => (
                      <span key={tag} className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                    {info.tags.length > 4 && (
                      <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        +{info.tags.length - 4} more
                      </span>
                    )}
                  </div>
                  <Link
                    className="text-green-600 hover:text-green-800 font-medium text-sm"
                    to={getPathWithParams(`/information/${info.id}`)}
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 