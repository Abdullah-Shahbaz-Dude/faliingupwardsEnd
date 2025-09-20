import { Metadata, Viewport } from "next";
import "./globals.css";
import { LoadingProvider } from "@/components/LoadingProvider";
import MainLayoutWrapper from "@/components/layout/MainLayoutWrapper";
import { NextAuthProvider } from "@/components/providers/NextAuthProvider";

export const metadata: Metadata = {
  title: "Falling Upwards - Psychology-Driven Solutions",
  description:
    "We provide psychology-driven solutions for individuals and organizations, including digital evolution, executive mentoring, therapy, and Different Thinking services.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Note: Database connections are handled by individual API routes
  // Removing connectMongo() from here improves page load performance
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <LoadingProvider>
            <MainLayoutWrapper>{children}</MainLayoutWrapper>
          </LoadingProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
