import { Tag } from "lucide-react";

import { formatCategoriesForDisplay } from "@/types";

interface CategoryTagsProps {
  categories: string;
  maxDisplay?: number;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary";
  showIcon?: boolean;
  className?: string;
}

export default function CategoryTags({
  categories,
  maxDisplay = 2,
  size = "sm",
  variant = "primary",
  showIcon = true,
  className = "",
}: CategoryTagsProps) {
  const { displayCategories, hasMore, totalCount } = formatCategoriesForDisplay(
    categories,
    maxDisplay,
  );

  const getBadgeVariant = () => {
    switch (variant) {
      case "primary":
        return "badge-primary";
      case "secondary":
        return "badge-secondary";
      default:
        return "badge-secondary";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "text-xs px-2 py-1";
      case "md":
        return "text-sm px-3 py-1.5";
      case "lg":
        return "text-base px-4 py-2";
      default:
        return "text-xs px-2 py-1";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return 12;
      case "md":
        return 14;
      case "lg":
        return 16;
      default:
        return 12;
    }
  };

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayCategories.map((category, index) => (
        <span
          key={index}
          className={`badge ${getBadgeVariant()} ${getSizeClasses()} inline-flex items-center font-medium transition-colors hover:scale-105 transform duration-200`}
        >
          {showIcon && <Tag className="mr-1" size={getIconSize()} />}
          {category}
        </span>
      ))}
      {hasMore && (
        <span
          className={`badge badge-secondary ${getSizeClasses()} inline-flex items-center font-medium opacity-75`}
        >
          +{totalCount - maxDisplay}
        </span>
      )}
    </div>
  );
}
