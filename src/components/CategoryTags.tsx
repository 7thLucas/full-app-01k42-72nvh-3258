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

  const sizeClasses = {
    sm: "text-xs px-2.5 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-2",
  };

  const variantClasses = {
    primary: "bg-primary-100 text-primary-800",
    secondary: "bg-secondary-100 text-secondary-800",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  if (displayCategories.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {displayCategories.map((category, index) => (
        <span
          key={index}
          className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${variantClasses[variant]}`}
        >
          {showIcon && <Tag className="mr-1" size={iconSizes[size]} />}
          {category}
        </span>
      ))}
      {hasMore && (
        <span
          className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} bg-secondary-100 text-secondary-600`}
        >
          +{totalCount - maxDisplay}
        </span>
      )}
    </div>
  );
} 