import { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";

// 🏗️ SERVER COMPONENTS - Static content (no interactivity needed)
import WhyExistsSection from "@/components/Home/WhyExistsSection";
import ServicesSection from "@/components/Home/ServicesSection";
import ConsultationSection from "@/components/Home/ConsultationSection";

// 🎮 CLIENT COMPONENTS - Interactive sections only
const HeroSection = dynamic(() => import("@/components/Home/HeroSection"), {
  loading: () => <HeroSkeleton />,
});

const WhyChooseSection = dynamic(
  () => import("@/components/Home/WhyChooseSection"),
  {
    loading: () => <SectionSkeleton />,
  }
);

const PartnersSection = dynamic(
  () => import("@/components/Home/PartnersSection"),
  {
    loading: () => <SectionSkeleton />,
  }
);

// 🎨 OPTIMIZED SKELETONS
const HeroSkeleton = () => (
  <div className="h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 animate-pulse flex items-center justify-center">
    <div className="text-4xl md:text-8xl text-gray-500 font-bold opacity-30">
      Falling Upwards
    </div>
  </div>
);

const SectionSkeleton = () => (
  <div className="w-full h-96 bg-gradient-to-r from-gray-100 to-gray-200 animate-pulse rounded-lg mb-8">
    <div className="flex items-center justify-center h-full">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
        <div
          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
    </div>
  </div>
);

// 🔍 SEO METADATA - Exactly same content as your Head section
export const metadata: Metadata = {
  title:
    "Falling Upwards | Psychological Therapy, Mentoring, Coaching and Business Consultancy",
  description:
    "We help organizations navigate digital transformation and AI integration with a psychology-driven approach.",
  icons: {
    icon: "/favicon.ico",
  },
};

// 🏠 MAIN PAGE - Server Component for better performance
export default function Home() {
  return (
    <>
      {/* 🚀 PRELOAD CRITICAL RESOURCES - Same as your original */}
      <link
        rel="preload"
        href="/fonts/roboto.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />

      <main className="min-h-screen font-roboto">
        {/* 🎯 HERO SECTION - Client component (needs carousel) */}
        <Suspense fallback={<HeroSkeleton />}>
          <HeroSection />
        </Suspense>

        {/* 📊 STATIC SECTIONS - Server-rendered for performance */}
        <WhyExistsSection />

        {/* 🎮 INTERACTIVE SECTIONS - Client components */}
        <Suspense fallback={<SectionSkeleton />}>
          <WhyChooseSection />
        </Suspense>

        <ServicesSection />

        <Suspense fallback={<SectionSkeleton />}>
          <PartnersSection />
        </Suspense>

        {/* 📞 CONSULTATION - Server component (just links) */}
        <ConsultationSection />
      </main>
    </>
  );
}
