import type { MiniApp } from "@/types";

import { useState } from "react";
import { X, Search, RefreshCw } from "lucide-react";
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
  const [selectedCategory, setSelectedCategory] = useState("All");

  if (!isOpen) return null;

  const categories = [
    "All",
    ...Array.from(new Set(miniApps.map((app) => app.category))),
  ];

  const filteredMiniApps = miniApps.filter((app) => {
    const matchesSearch = app.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || app.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      aria-labelledby="miniapps-modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6">
          <h2 className="text-2xl font-bold text-secondary-900">
            All Features
          </h2>
          <button
            className="p-2 hover:bg-secondary-100 rounded-full transition-colors"
            onClick={onClose}
          >
            <X size={24} />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="p-6 pt-0 border-b border-secondary-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-400"
                size={20}
              />
              <input
                className="w-full pl-10 pr-4 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Search Features..."
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* MiniApps Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {filteredMiniApps.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-secondary-500 text-lg">
                No Features found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {filteredMiniApps.map((miniApp) => {
                const IconComponent = Icons[
                  miniApp.icon as keyof typeof Icons
                ] as React.ComponentType<{ size?: number }>;

                return (
                  <button
                    key={miniApp.id}
                    className="p-4 border border-secondary-200 rounded-lg hover:shadow-md hover:border-primary-300 transition-all duration-200 text-left flex flex-col justify-between group relative"
                    onClick={() => onSelectMiniApp(miniApp)}
                  >
                    <div className="flex flex-col">
                      <div className="p-2 bg-primary-50 rounded-lg text-primary-600 group-hover:bg-primary-100 transition-colors mb-2 w-fit">
                        {IconComponent ? (
                          <IconComponent size={24} />
                        ) : (
                          <Icons.Square size={24} />
                        )}
                      </div>
                      <h3 className="font-semibold text-secondary-900 mb-2 leading-tight">
                        {miniApp.name}
                      </h3>
                      <p className="text-sm text-secondary-600 mb-2">
                        {miniApp.description}
                      </p>
                    </div>
                    <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full w-fit">
                      {miniApp.category}
                    </span>
                    {miniApp.isLoading && (
                      <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
                        <RefreshCw
                          className="animate-spin text-primary-600"
                          size={20}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
