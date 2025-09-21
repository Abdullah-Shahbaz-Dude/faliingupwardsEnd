"use client";

import Image, { StaticImageData } from "next/image";
import { useState, useRef, useEffect } from "react";
import { cn, generateBlurDataURL, getResponsiveSizes } from "@/lib/utils";

interface OptimizedImageProps {
  src: string | StaticImageData;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  loading?: "lazy" | "eager";
  placeholder?: "blur" | "empty";
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  // Performance optimization props
  lazy?: boolean;
  responsive?: boolean;
  webpFallback?: boolean;
  preload?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85, // Optimized quality for web
  sizes,
  fill = false,
  loading = "lazy",
  placeholder = "blur",
  blurDataURL,
  onLoad,
  onError,
  lazy = true,
  responsive = true,
  webpFallback = true,
  preload = false,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy || priority);
  const imgRef = useRef<HTMLDivElement>(null);

  // INTERSECTION OBSERVER FOR LAZY LOADING
  useEffect(() => {
    if (!lazy || priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: "50px", // Load images 50px before they come into view
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [lazy, priority, isInView]);

  // PRELOAD CRITICAL IMAGES
  useEffect(() => {
    if (preload && typeof src === 'string') {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [preload, src]);

  // RESPONSIVE SIZES CALCULATION
  const responsiveSizes = responsive && !sizes 
    ? getResponsiveSizes()
    : sizes;

  // BLUR PLACEHOLDER GENERATION
  const placeholderDataURL = blurDataURL || 
    (placeholder === "blur" ? generateBlurDataURL(width || 400, height || 300) : undefined);

  // HANDLE IMAGE LOAD
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  // HANDLE IMAGE ERROR
  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // FALLBACK IMAGE FOR ERRORS
  const fallbackSrc = "/images/fallback.webp";

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        !isLoaded && "animate-pulse bg-gray-200",
        className
      )}
      style={!fill ? { width, height } : undefined}
    >
      {/* OPTIMIZED IMAGE RENDERING */}
      {isInView && (
        <>
          {/* MODERN FORMAT WITH FALLBACK */}
          {webpFallback && typeof src === 'string' && (
            <picture>
              {/* AVIF format for maximum compression */}
              <source 
                srcSet={`${src.replace(/\.(jpg|jpeg|png)$/i, '.avif')}`}
                type="image/avif"
                sizes={responsiveSizes}
              />
              {/* WebP format for better compression */}
              <source 
                srcSet={`${src.replace(/\.(jpg|jpeg|png)$/i, '.webp')}`}
                type="image/webp"
                sizes={responsiveSizes}
              />
              {/* Fallback to original format */}
              <Image
                src={hasError ? fallbackSrc : src}
                alt={alt}
                width={width}
                height={height}
                fill={fill}
                quality={quality}
                priority={priority}
                loading={priority ? "eager" : loading}
                placeholder={placeholder}
                blurDataURL={placeholderDataURL}
                sizes={responsiveSizes}
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                  "transition-opacity duration-300",
                  isLoaded ? "opacity-100" : "opacity-0",
                  fill && "object-cover"
                )}
                {...props}
              />
            </picture>
          )}

          {/* STANDARD IMAGE (for StaticImageData or when webpFallback is false) */}
          {(!webpFallback || typeof src !== 'string') && (
            <Image
              src={hasError ? fallbackSrc : src}
              alt={alt}
              width={width}
              height={height}
              fill={fill}
              quality={quality}
              priority={priority}
              loading={priority ? "eager" : loading}
              placeholder={placeholder}
              blurDataURL={placeholderDataURL}
              sizes={responsiveSizes}
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                "transition-opacity duration-300",
                isLoaded ? "opacity-100" : "opacity-0",
                fill && "object-cover"
              )}
              {...props}
            />
          )}
        </>
      )}

      {/* LOADING PLACEHOLDER */}
      {!isInView && lazy && !priority && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse",
            "bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite]"
          )}
          style={!fill ? { width, height } : undefined}
        />
      )}

      {/* ERROR STATE */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
          <span className="text-sm">Failed to load image</span>
        </div>
      )}
    </div>
  );
}

// SHIMMER ANIMATION CSS (add to globals.css)
/*
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
*/
