"use client";

import { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { HeroSection } from "@/components/common/HeroSection";
import Image from "next/image";
import { offersData } from "@/data/services";
import { digitalEvolutionImgs, homepageImages } from "@/lib/frontend/images";
import ConsultationSection from "@/components/Home/ConsultationSection";

export default function OurOffersPage() {
  const [activeOffer, setActiveOffer] = useState(offersData[0]);
  const { hero1 } = digitalEvolutionImgs;

  // Memoize the active offer to prevent unnecessary re-renders
  const memoizedActiveOffer = useMemo(() => activeOffer, [activeOffer]);

  // Memoized callback for offer selection
  const handleOfferChange = useCallback((offer: typeof offersData[0]) => {
    setActiveOffer(offer);
  }, []);

  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <HeroSection
        title="Our Services"
        backgroundImage={hero1}
      />

      {/* Main Content Section */}
      <section className="relative py-16 bg-gradient-to-br from-[#EFF6FB] via-[#F7FAFC] to-white">
        <div className="container mx-auto px-6 sm:px-10 lg:px-20">
          {/* Breadcrumb */}
          <div className="mb-12">
            <Link
              href="/"
              className="text-[#0B4073] hover:text-[#4A6E80] inline-flex items-center font-medium transition-colors duration-300"
            >
              <FiArrowLeft className="mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Page Title */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0B4073] leading-tight mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Choose from our range of specialized services designed to support your journey of growth and transformation.
            </p>
          </div>

          {/* Service Selection Tabs */}
          <div className="mb-16">
            <div className="flex flex-wrap justify-center gap-3 md:gap-4">
              {offersData.map((offer) => (
                <button
                  key={offer.id}
                  onClick={() => handleOfferChange(offer)}
                  className={`px-6 py-3 rounded-full text-sm md:text-base font-semibold transition-all duration-300 transform hover:scale-105 ${
                    activeOffer.id === offer.id
                      ? "bg-[#0B4073] text-white shadow-lg"
                      : "bg-white text-[#0B4073] hover:bg-[#EFF6FB] shadow-md border border-gray-200"
                  }`}
                >
                  {offer.title}
                </button>
              ))}
            </div>
          </div>

          {/* Service Card */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-20 transform hover:scale-[1.02] transition-all duration-500">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Content Side */}
              <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-between bg-gradient-to-br from-white to-[#F7FAFC]">
                <div>
                  <div className="mb-6">
                    <span className="inline-block bg-[#0B4073]/10 text-[#0B4073] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                      Featured Service
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-[#0B4073] leading-tight mb-6">
                      {memoizedActiveOffer.title}
                    </h2>
                  </div>
                  
                  <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                    {memoizedActiveOffer.description}
                  </p>

                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-[#0B4073] mb-4">
                      Key Focus Areas:
                    </h3>
                    <ul className="space-y-3">
                      {memoizedActiveOffer.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-[#0B4073] rounded-full w-2 h-2 mt-2.5 mr-4 flex-shrink-0"></div>
                          <span className="text-gray-700 leading-relaxed">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href={memoizedActiveOffer.link}
                    className="bg-[#0B4073] text-white px-8 py-4 rounded-full hover:bg-[#0B4073]/90 transition-all duration-300 inline-flex items-center font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Learn More
                    <FiArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
              
              {/* Image Side */}
              <div className="h-80 lg:h-auto relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B4073]/20 to-transparent z-10"></div>
                <Image
                  src={memoizedActiveOffer.image}
                  alt={memoizedActiveOffer.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-700"
                  priority={memoizedActiveOffer.id === offersData[0].id}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
            <ConsultationSection/>
     
    </div>
  );
}
