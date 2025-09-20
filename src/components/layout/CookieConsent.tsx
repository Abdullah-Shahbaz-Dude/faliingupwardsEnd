"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Link from "next/link";

export const CookieConsent = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check icookiesf user has already accepted
    const hasAccepted = localStorage.getItem("cookie-consent");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  const declineCookies = () => {
    localStorage.setItem("cookie-consent", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t shadow-lg md:flex md:items-center md:justify-between">
      <div className="max-w-3xl mr-4 text-sm">
        <p>
          We use cookies to enhance your experience. By continuing to visit this
          site you agree to our use of cookies.
          <Link href="/privacy-policy" className="text-blue-600 underline">
            Learn more
          </Link>
        </p>
      </div>
      <div className="flex items-center mt-4 space-x-4 md:mt-0">
        <button
          onClick={declineCookies}
          className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-100"
        >
          Decline
        </button>
        <button
          onClick={acceptCookies}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Accept
        </button>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full hover:bg-gray-200"
          aria-label="Close cookie consent"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
