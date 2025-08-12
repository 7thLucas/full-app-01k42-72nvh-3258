import { DynamicIcon, iconNames } from "lucide-react/dynamic";
import { Square } from "lucide-react";

export const SafeDynamicIcon = ({
  name,
  className,
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) => {
  // If no name provided, use fallback
  if (!name || name.trim() === "") {
    return <Square className={className} size={size} />;
  }

  if (iconNames.includes(name as any)) {
    return <DynamicIcon className={className} name={name as any} size={size} />;
  }

  return <Square className={className} size={size} />;
};
