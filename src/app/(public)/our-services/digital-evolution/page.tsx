"use client";

import React, { useCallback, useState } from "react";
import { HeroSection } from "@/components/common/HeroSection";
import Breadcrumb from "@/components/Breadcrumb";
import EmpowermentSection from "./EmpowermentSection";
import ApproachSection from "./ApproachSection";
import HowWeHelpSection from "./HowWeHelpSection";
import ConsultationBookingSection from "@/components/ConsultationBookingSection";
import dynamic from "next/dynamic";
import { digitalEvolutionImgs } from "@/lib/frontend/images";
import ChallengesSection from "./ChallengesSection";

const DynamicAccordion = dynamic(
  () => Promise.resolve(AccordionItemComponent),
  {
    ssr: false,
    loading: () => (
      <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
    ),
  }
);

import AccordionItemComponent from "./AccordionItemComponent";

export default function DigitalEvolutionPage() {
  const { hero1 } = digitalEvolutionImgs;

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = useCallback(
    (index: number) => {
      setOpenIndex(openIndex === index ? null : index);
    },
    [openIndex]
  );
  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <HeroSection
        title="Digital Evolution and AI Adoption"
        backgroundImage={hero1}
      />
      <Breadcrumb />

      <div className=" mt-2">
        <ChallengesSection />
        <HowWeHelpSection />
        <ApproachSection />
        <DynamicAccordion handleToggle={handleToggle} openIndex={openIndex} />
        <EmpowermentSection />
      </div>
      <ConsultationBookingSection
        options={[
          { type: "digital", title: "Digital Evolution & AI Adoption" },
        ]}
      />
    </div>
  );
}
