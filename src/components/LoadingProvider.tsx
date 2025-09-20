"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  Suspense,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";

// Create context
const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (loading: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

function LoadingProviderContent({ children }: { children: React.ReactNode }) {
  // Start with isLoading as false to prevent hydration mismatch
  const [isLoading, setIsLoading] = useState(false);
  // Track if component is mounted on client
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Show loading spinner on route changes
  useEffect(() => {
    // Mark as mounted on client side
    setIsMounted(true);

    // On initial load or route change, show the spinner
    setIsLoading(true);

    // Hide spinner after a short delay to allow content to load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {isMounted && isLoading && <LoadingSpinner />}
      <div
        className={
          !isMounted
            ? ""
            : isLoading
              ? "opacity-0"
              : "opacity-100 transition-opacity duration-300"
        }
      >
        {children}
      </div>
    </LoadingContext.Provider>
  );
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div
            className="animate-pulse text-xl font-[Roboto]"
            style={{ color: "#7094B7" }}
          >
            Loading...
          </div>
        </div>
      }
    >
      <LoadingProviderContent>{children}</LoadingProviderContent>
    </Suspense>
  );
}
