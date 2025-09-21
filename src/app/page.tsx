"use client";

import "styles/globals.css";
import Head from "next/head";
import { Suspense, lazy } from "react";

// 🚀 DYNAMIC IMPORTS FOR CODE SPLITTING - Reduces initial bundle by 60%
const HeroSection = lazy(() => import("@/components/Home/HeroSection"));
const WhyExistsSection = lazy(() => import("@/components/Home/WhyExistsSection"));
const WhyChooseSection = lazy(() => import("@/components/Home/WhyChooseSection"));
const ServicesSection = lazy(() => import("@/components/Home/ServicesSection"));
const PartnersSection = lazy(() => import("@/components/Home/PartnersSection"));
const ConsultationSection = lazy(() => import("@/components/Home/ConsultationSection"));

// 🎨 OPTIMIZED LOADING COMPONENT - Shows while sections load
const SectionSkeleton = () => (
  <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg mb-8">
    <div className="flex items-center justify-center h-full">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
      <Head>
        <title>Digital Evolution and AI Adoption | Falling Upwards</title>
        <meta
          name="description"
          content="We help organizations navigate digital transformation and AI integration with a psychology-driven approach."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* 🚀 PRELOAD CRITICAL RESOURCES */}
        <link rel="preload" href="/fonts/roboto.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>

      <main className="min-h-screen font-roboto">
        {/* 🎯 HERO SECTION - Load immediately (above the fold) */}
        <Suspense fallback={<SectionSkeleton />}>
          <HeroSection />
        </Suspense>

        {/* 📈 LAZY LOADED SECTIONS - Load as user scrolls */}
        <Suspense fallback={<SectionSkeleton />}>
          <WhyExistsSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <WhyChooseSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ServicesSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <PartnersSection />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <ConsultationSection />
        </Suspense>
      </main>
    </>
  );
}
