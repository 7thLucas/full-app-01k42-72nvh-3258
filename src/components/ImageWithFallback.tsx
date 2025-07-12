import { useState } from "react";
import { Image, AlertCircle, Loader } from "lucide-react";

interface ImageWithFallbackProps {
  src?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  showIcon?: boolean;
  iconSize?: number;
}

export default function ImageWithFallback({
  src,
  alt,
  className = "",
  fallbackSrc,
  showIcon = true,
  iconSize = 48,
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // If no src provided, show fallback immediately
  if (!src || src.trim() === "") {
    return (
      <div
        className={`bg-secondary-50 flex items-center justify-center ${className}`}
      >
        {showIcon && (
          <div className="text-secondary-400 text-center">
            <Image className="mx-auto mb-2" size={iconSize} />
            <p className="text-xs font-medium">No image available</p>
          </div>
        )}
      </div>
    );
  }

  // If primary image failed and we have a fallback, try fallback
  if (hasError && fallbackSrc && !fallbackSrc.includes("error")) {
    return (
      <ImageWithFallback
        alt={alt}
        className={className}
        fallbackSrc={fallbackSrc + "_error"} // Prevent infinite loop
        iconSize={iconSize}
        showIcon={showIcon}
        src={fallbackSrc}
      />
    );
  }

  // If image failed and no fallback, show error state
  if (hasError) {
    return (
      <div
        className={`bg-danger-50 flex items-center justify-center ${className}`}
      >
        {showIcon && (
          <div className="text-danger-400 text-center">
            <AlertCircle className="mx-auto mb-2" size={iconSize} />
            <p className="text-xs font-medium" data-src={src}>
              Failed to load image
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div
          className={`absolute inset-0 bg-secondary-100 animate-pulse flex items-center justify-center z-10 ${className}`}
        >
          {showIcon && (
            <div className="text-secondary-400 text-center">
              <Loader
                className="animate-spin mx-auto mb-2"
                size={iconSize / 2}
              />
              <p className="text-xs font-medium">Loading...</p>
            </div>
          )}
        </div>
      )}
      <img
        alt={alt}
        className={`${className} ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-300`}
        src={src}
        onError={handleError}
        onLoad={handleLoad}
      />
    </div>
  );
}
