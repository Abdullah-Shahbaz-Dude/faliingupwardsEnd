"use client";

import { useParams } from "next/navigation";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

// Custom component that wraps the imported page
function TypedBookingForm() {
  // Get the consultation type from the route parameter
  const params = useParams();
  const type = params.type as string;

  // Set the type in search params if needed
  const searchParams = useSearchParams();
  const searchParamsObj = new URLSearchParams(searchParams.toString());
  searchParamsObj.set("type", type);

  // Dynamically import the main page component
  const BookPage = dynamic(() => import("../page"), {
    loading: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div
          className="animate-pulse text-xl text-gray-600 font-[Roboto]"
          style={{ color: "#7094B7" }}
        >
          Loading booking form...
        </div>
      </div>
    ),
  });

  return <BookPage />;
}

export default function DynamicBookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div
            className="animate-pulse text-xl text-gray-600 font-[Roboto]"
            style={{ color: "#7094B7" }}
          >
            Loading booking form...
          </div>
        </div>
      }
    >
      <TypedBookingForm />
    </Suspense>
  );
}
