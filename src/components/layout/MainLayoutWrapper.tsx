"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieConsent } from "./CookieConsent";

export default function MainLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdminOrDashboard =
    pathname?.startsWith("/admin-dashboard") ||
    pathname?.startsWith("/dashboard") ||
    pathname?.startsWith("/user-dashboard") ||
    pathname?.startsWith("/workbook");

  const isThankYouPage = pathname?.startsWith("/thank-you");
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrDashboard && !isThankYouPage && <Navbar />}

      <main className="flex-grow">{children}</main>
      {!isAdminOrDashboard && <Footer />}
      {!isAdminOrDashboard && <CookieConsent />}
    </div>
  );
}
