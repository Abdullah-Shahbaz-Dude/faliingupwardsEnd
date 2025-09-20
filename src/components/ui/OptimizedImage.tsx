"use client";

import Image, { StaticImageData } from "next/image";
import { useState } from "react";
import { cn, generateBlurDataURL, getResponsiveSizes } from "@/lib/utils";

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  fill?: boolean;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
  loading?: "lazy" | "eager";
  onLoad?: () => void;
  onError?: () => void;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  fill = false,
  objectFit = "cover",
  loading = "lazy",
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const responsiveSizes = sizes || getResponsiveSizes();
  const blurDataURL = generateBlurDataURL();

  if (hasError) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-gray-200 text-gray-500",
          className
        )}
        style={{ width: fill ? undefined : width, height: fill ? undefined : height }}
      >
        <span className="text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        loading={priority ? "eager" : loading}
        sizes={responsiveSizes}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={cn(
          "transition-all duration-300",
          isLoading && "scale-105 blur-sm",
          !isLoading && "scale-100 blur-0",
          objectFit === "cover" && "object-cover",
          objectFit === "contain" && "object-contain",
          objectFit === "fill" && "object-fill"
        )}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: fill ? objectFit : undefined,
        }}
      />
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}
