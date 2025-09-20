"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import { IMAGE_PATHS } from "@/config/images";

interface HeroSectionProps {
  title: string;
  backgroundImage: StaticImageData;
  subtitle?: string;
  height?: string;
  textPosition?: string;
}

export function HeroSection({ title, backgroundImage, subtitle, height, textPosition }: HeroSectionProps) {
  const imageUrl = backgroundImage || "";

  const heightClass = {
    medium: "h-[50vh] md:h-[75vh]",
  };

  // Text position classes
  const positionClass = {
    center: "text-center justify-center",
    left: "text-lefimageUrlt justify-start",
  };

  return (
    <section
      className={`relative ${heightClass.medium} flex items-center overflow-hidden service-page-hero hero`}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden aspect-[16/9]">
        <Image
          src={imageUrl}
          alt={`${title} background image`}
          fill
          priority={false}
          className="object-cover object-[50%_80%]  "
          sizes="(max-width: 1280px) 100vw, 1280px"
          onError={(e) => (e.currentTarget.src = IMAGE_PATHS.fallback.src)}
        />
      </div>

      {/* Overlay */}

      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      {/* Content - Positioned at bottom of hero */}
      <div
        className={`
          absolute bottom-8 sm:bottom-12 md:bottom-16 lg:bottom-20 
          w-full max-w-7xl mx-auto
          flex flex-col items-start justify-end z-20
          ml-7 sm:ml-10 md:ml-14 lg:ml-[4.5rem] max-custom:ml-12
        `}
      >
        <div className="max-w-4xl hero-content">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-left"
          >
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}
