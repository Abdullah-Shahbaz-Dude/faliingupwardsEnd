"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroSection } from "@/components/common/HeroSection";
import {
  FiBriefcase,
  FiCpu,
  FiHeart,
  FiUsers,
  FiTarget,
  FiBookOpen,
  FiArrowRight,
  FiCalendar,
} from "react-icons/fi";
import { homepageImages, stockImages, digitalEvolutionImgs } from "@/lib/frontend/images";

// Define all the booking options available
const bookingOptions = [
  {
    id: "digital",
    title: "Digital Evolution & AI Adoption",
    description:
      "Schedule a consultation to explore AI integration and digital transformation strategies for your organisation.",
    icon: <FiCpu className="h-7 w-7" />,
    href: "/book/digital",
    image: homepageImages.services.digitalEvolution,
  },
  {
    id: "psychological",
    title: "Psychological Therapy",
    description:
      "Book a safe, confidential space to explore challenges and develop strategies for positive change.",
    icon: <FiHeart className="h-7 w-7" />,
    href: "/book/psychological",
    image: homepageImages.services.psychologicalTherapy,
  },
  {
    id: "executive",
    title: "Executive Mentoring",
    description:
      "Specialised mentoring for executives to navigate complex leadership challenges.",
    icon: <FiBriefcase className="h-7 w-7" />,
    href: "/book/executive",
    image: homepageImages.services.executiveMentoring,
  },
  {
    id: "boardroom",
    title: "Boardroom Advisory",
    description:
      "Specialised guidance and facilitation for boards navigating change and strategic challenges.",
    icon: <FiUsers className="h-7 w-7" />,
    href: "/book/boardroom",
    image: digitalEvolutionImgs.approach1,
  },
  {
    id: "adhd",
    title: "ADHD Coaching",
    description:
      "Supportive coaching to develop strategies for managing ADHD and leveraging your unique strengths.",
    icon: <FiTarget className="h-7 w-7" />,
    href: "/book/adhd",
    image: homepageImages.services.adhdCoaching,
  },
  {
    id: "neurodiversity",
    title: "Different Thinking For Different Thinkers",
    description:
      "Leverage neurodiversity to drive innovation and competitive advantage in your organisation.",
    icon: <FiBookOpen className="h-7 w-7" />,
    href: "/book/thinking-different",
    image: stockImages.shutterstock2455025455,
  },
];

function BookPageContent() {
  return (
    <div className="min-h-screen pb-24 bg-gray-50">
      {/* Hero Section */}
      <HeroSection
        title="Book a Consultation"
        subtitle="Choose from our range of specialised services"
        backgroundImage={digitalEvolutionImgs.hero1}
        height="medium"
        textPosition="left"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0B4073] mb-4">
            Our Services
          </h2>
          <div className="w-20 h-1 bg-[#0B4073] mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the service you're interested in to schedule your
            consultation. Our team will contact you to confirm your appointment
            details.
          </p>
        </div>

        {/* Featured Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {bookingOptions.map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-gray-100 hover:border-[#0B4073]/20"
            >
              {/* Service Image */}
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>

                {/* Icon overlay */}
                <div className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg">
                  <div className="text-[#0B4073]">{service.icon}</div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 flex-grow">
                  {service.description}
                </p>

                <Link
                  href={service.href}
                  className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-md bg-[#0B4073] text-white font-medium shadow-sm hover:bg-[#083258] transition-all w-full"
                >
                  <FiCalendar className="mr-1" />
                  Book Consultation
                  <FiArrowRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 pb-16 flex items-center justify-center bg-gray-50">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-[#0B4073]/20 mb-4"></div>
            <div className="h-4 w-40 bg-[#0B4073]/20 rounded mb-3"></div>
            <div className="h-3 w-32 bg-[#0B4073]/10 rounded"></div>
          </div>
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}
