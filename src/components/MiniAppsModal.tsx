import type { MiniApp } from "@/types";

import { useState } from "react";
import { X, Search } from "lucide-react";
import * as Icons from "lucide-react";

interface MiniAppsModalProps {
  isOpen: boolean;
  onClose: () => void;
  miniApps: MiniApp[];
  onSelectMiniApp: (miniApp: MiniApp) => void;
}

export default function MiniAppsModal({
  isOpen,
  onClose,
  miniApps,
  onSelectMiniApp,
}: MiniAppsModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (!isOpen) return null;

  const categories = [
    "All",
    ...Array.from(new Set(miniApps.map((app) => app.category))),
  ];

  const filteredApps = miniApps.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app.category === selectedCategory;

    return matchesSearch && matchesCategory && app.isActive;
  });

  const handleMiniAppClick = (miniApp: MiniApp) => {
    onSelectMiniApp(miniApp);
    onClose();
  };

  const getIcon = (iconName: string) => {
    const IconComponent = Icons[
      iconName as keyof typeof Icons
    ] as React.ComponentType<{ size?: number }>;

    return IconComponent ? (
      <IconComponent size={24} />
    ) : (
      <Icons.Square size={24} />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">All MiniApps</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search MiniApps..."
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
          </div>
        </div>

        {/* MiniApps Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredApps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No MiniApps found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all duration-200 text-left group"
                  onClick={() => handleMiniAppClick(app)}
                >
                  <div className="flex items-center mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                      {getIcon(app.icon)}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {app.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {app.description}
                  </p>
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {app.category}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
