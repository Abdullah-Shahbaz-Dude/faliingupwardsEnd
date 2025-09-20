"use client";

import React, { useState, Suspense, useCallback } from "react";

import Image from "next/image";
import { HeroSection } from "@/components/common/HeroSection";
import { teamMembers } from "@/data/teamMembers";
import { motion } from "framer-motion";
import ConsultationSection from "@/components/common/ConsultationSection";
import { team } from "@/lib/frontend/images";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string[];
  qualifications?: { title: string }[];
  memberships?: { title: string }[];
  expertise?: { title: string; icon: string }[];
}

function WhoWeAreContent() {
  const { member1, member2 } = team;
  const [activeTab, setActiveTab] = useState("alexander");
  const [toggles, setToggles] = useState<
    Record<string, { qualifications?: boolean; memberships?: boolean }>
  >({});

  const handleTabChange = useCallback((memberId: string) => {
    setActiveTab(memberId);
    setToggles({});
  }, []);

  const toggleSection = useCallback(
    (memberId: string, section: "qualifications" | "memberships") => {
      setToggles((prev) => ({
        ...prev,
        [memberId]: {
          ...prev[memberId],
          [section]: !prev[memberId]?.[section],
        },
      }));
    },
    []
  );

  const { teamHero } = team;
  return (
    <div className="bg-background min-h-screen font-roboto">
      {/* Hero Section */}
      <HeroSection title="Meet Our Team" backgroundImage={teamHero} />

      {/* Team Section with Tabs */}
      <section className="py-20 bg-[#D6E2EA]/20 px-10">
        <div className="container mx-auto max-w-7xl">
          {/* Team Member Tabs */}
          <div className="flex justify-center mb-12 ">
            <div
              role="tablist"
              className="inline-flex bg-white rounded-full p-1 shadow-md"
            >
              {teamMembers.map((member) => (
                <button
                  key={member.id}
                  //
                  role="tab"
                  aria-selected={activeTab === member.id}
                  aria-controls={`panel-${member.id}`}
                  onClick={() => handleTabChange(member.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleTabChange(member.id);
                    }
                  }}
                  className={`px-6 py-3 rounded-full font-medium transition-all ${activeTab === member.id ? "bg-[#0B4073] text-white" : "text-gray-700 hover:bg-gray-100"}`}
                >
                  {member.name}
                </button>
              ))}
            </div>
          </div>

          {/* Team Member Content */}
          {teamMembers.map((member) => (
            <div
              key={member.id}
              role="tabpanel"
              className={`${activeTab === member.id ? "block" : "hidden"}`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                {/* Left Column - Photo and Quick Info */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="relative w-full aspect-[4/5] max-h-[90%]">
                      {/* <div className="relative h-96 w-full"> */}
                      <Image
                        src={member.image}
                        alt={`Portrait of ${member.name}, ${member.role}`}
                        fill
                        sizes="(max-width: 1024px) 100vw, 33vw"
                        loading="lazy"
                        className="object-cover"
                        onError={(e) =>
                          (e.currentTarget.src = "/images/fallback.webp")
                        }
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl md:text-2xl font-bold text-[#0B4073] mb-2">
                        {member.name}
                      </h3>
                      <p className="text-[#7094B7] font-medium mb-6 text-sm md:text-base">
                        {member.role}
                      </p>
                      {(["qualifications", "memberships"] as const).map(
                        (section) =>
                          member[section as keyof TeamMember] && (
                            <div key={section} className="mt-6">
                              <button
                                onClick={() =>
                                  toggleSection(
                                    member.id,
                                    section as "qualifications" | "memberships"
                                  )
                                }
                                aria-expanded={!!toggles[member.id]?.[section]}
                                aria-controls={`${section}-${member.id}`}
                                className="w-full flex items-center justify-between p-4 bg-white rounded-2xl shadow-md border border-[#D6E2EA] text-[#0B4073] font-semibold text-sm md:text-base hover:bg-[#EEF5FA] transition-colors"
                              >
                                <span>
                                  {section === "qualifications"
                                    ? "Qualifications & Training"
                                    : "Professional Memberships"}
                                </span>
                                <svg
                                  className={`w-5 h-5 transform transition-transform duration-300 ${
                                    toggles[member.id]?.[section]
                                      ? "rotate-180"
                                      : ""
                                  }`}
                                  fill="none"
                                  stroke="#0B4073"
                                  strokeWidth={2}
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 9l-7 7-7-7"
                                  />
                                </svg>
                              </button>
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{
                                  height: toggles[member.id]?.[section]
                                    ? "auto"
                                    : 0,
                                  opacity: toggles[member.id]?.[section]
                                    ? 1
                                    : 0,
                                }}
                                transition={{
                                  duration: 0.3,
                                  ease: "easeInOut",
                                }}
                                className="overflow-hidden"
                                id={`${section}-${member.id}`}
                              >
                                <div className="space-y-3 mt-4">
                                  {(
                                    member[section as keyof TeamMember] as {
                                      title: string;
                                    }[]
                                  )?.map((item, index) => (
                                    <motion.div
                                      key={item.title || index}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{
                                        duration: 0.3,
                                        delay: index * 0.1,
                                      }}
                                      className="flex items-start space-x-3 p-4 bg-white rounded-2xl shadow-sm border"
                                    >
                                      <span className="text-[#0B4073] text-xl leading-6 mt-1">
                                        •
                                      </span>
                                      <span className="text-[#0B4073] text-sm md:text-base font-medium">
                                        {item.title}
                                      </span>
                                    </motion.div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column - Bio */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6 md:p-8 shadow-lg">
                  <h3 className="text-xl md:text-2xl font-bold text-[#0B4073] mb-6">
                    Biography
                  </h3>
                  <div className="space-y-4">
                    {member.bio.map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-gray-700 leading-relaxed text-sm md:text-base"
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ConsultationSection />

      <style jsx global>{`
        @media screen and (width: 1080px) {
          .team-member-image {
            width: 300px !important;
            height: 300px !important;
            max-width: none !important;
            max-height: none !important;
          }
        }
        @media screen and (min-width: 1370px) and (max-width: 2000px) {
          .team-member-image {
            width: 500px !important;
            height: 500px !important;
            max-width: none !important;
            max-height: none !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function WhoWeAre() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div
            className="animate-pulse text-xl font-[Roboto]"
            style={{ color: "#7094B7" }}
          >
            Loading team information...
          </div>
        </div>
      }
    >
      <WhoWeAreContent />
    </Suspense>
  );
}
