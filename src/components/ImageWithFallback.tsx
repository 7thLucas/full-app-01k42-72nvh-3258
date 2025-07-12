import { useState } from "react";
import { Image, AlertCircle } from "lucide-react";

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
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        {showIcon && (
          <div className="text-gray-400 text-center">
            <Image className="mx-auto mb-2" size={iconSize} />
            <p className="text-sm">No image</p>
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
        className={`bg-gray-100 flex items-center justify-center ${className}`}
      >
        {showIcon && (
          <div className="text-gray-400 text-center">
            <AlertCircle className="mx-auto mb-2" size={iconSize} />
            <p className="text-sm">Failed to load</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`bg-gray-200 animate-pulse flex items-center justify-center ${className}`}
        >
          {showIcon && (
            <div className="text-gray-400">
              <Image className="animate-pulse" size={iconSize} />
            </div>
          )}
        </div>
      )}
      <img
        alt={alt}
        className={`${className} ${isLoading ? "hidden" : "block"}`}
        src={src}
        onError={handleError}
        onLoad={handleLoad}
      />
    </>
  );
}
