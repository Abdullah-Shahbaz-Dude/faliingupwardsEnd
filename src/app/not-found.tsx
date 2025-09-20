'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';

function NotFoundContent() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 font-[Roboto]">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-[#0B4073] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center px-5 py-3 bg-[#0B4073] text-white rounded-md hover:bg-[#0B4073]/90 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-xl text-gray-600">Loading...</div>
    </div>}>
      <NotFoundContent />
    </Suspense>
  );
}
