"use client";

import "styles/globals.css";

import HeroSection from "@/components/Home/HeroSection";
import WhyExistsSection from "@/components/Home/WhyExistsSection";
import WhyChooseSection from "@/components/Home/WhyChooseSection";
import ServicesSection from "@/components/Home/ServicesSection";
import PartnersSection from "@/components/Home/PartnersSection";
import ConsultationSection from "@/components/Home/ConsultationSection";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Digital Evolution and AI Adoption | Falling Upwards</title>
        <meta
          name="description"
          content="We help organizations navigate digital transformation and AI integration with a psychology-driven approach."
        />
      </Head>
      <HeroSection />
      <div className="font-roboto ">
        <WhyExistsSection />
        <WhyChooseSection />
        <ServicesSection />
        <PartnersSection />
        <ConsultationSection />
      </div>
    </>
  );
}
