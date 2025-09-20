"use client";

import React from "react";
import Image from "next/image";
import { useState } from "react";
import { FiUsers } from "react-icons/fi";
import { FiBriefcase } from "react-icons/fi";
import { HeroSection } from "@/components/common/HeroSection";
import { motion } from "framer-motion";
import ConsultationBookingSection from "@/components/ConsultationBookingSection";
import Breadcrumb from "@/components/Breadcrumb";
import { executiveMentoringImgs, additionalServiceImages, homepageImages } from "@/lib/frontend/images";
import { IMAGE_PATHS } from "@/config/images";
import SectionToggleButton from "./SectionToggleButton";
import ChallengeCard from "@/components/common/ChallengeCard";

import {
  approachSections,
  offers,
  offerings,
  challenges,
} from "@/data/executive-mentoring";

export default function ExecutiveMentoringPage() {
  const [activeSection, setActiveSection] = useState("For Individuals");
  return (
    <div className="font-roboto">
      <HeroSection
        title="Executive Mentoring & Boardroom Support"
        backgroundImage={homepageImages.services.executiveMentoring}
      />

      <section className="relative pt-0 px-10 py-20 bg-gradient-to-br from-[#EFF6FB] via-[#F7FAFC] to-white overflow-hidden">
        <Breadcrumb />
        <div className="container mx-auto px-0 py-16 mt-0 pt-6 max-w-7xl pb-3">
          {/* Section Toggle - Card Selection Style */}
          <div className="mb-0">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <SectionToggleButton
                isActive={activeSection === "For Individuals"}
                onClick={() => setActiveSection("For Individuals")}
                icon={
                  <FiUsers
                    className={`w-8 h-8 ${activeSection === "For Individuals" ? "text-white" : "text-[#0B4073]"}`}
                  />
                }
                title="For Individuals"
              />
              <SectionToggleButton
                isActive={activeSection === "Boardroom"}
                onClick={() => setActiveSection("Boardroom")}
                icon={
                  <FiBriefcase
                    className={`w-8 h-8 ${activeSection === "Boardroom" ? "text-white" : "text-[#0B4073]"}`}
                  />
                }
                title="For Boards"
              />
            </div>
          </div>
        </div>
      </section>
      {activeSection === "For Individuals" ? (
        <div className="max-w-7xl px-10 mx-auto mt-0">
          {/* List of challenges */}
          {/* Heading */}
          <div className="mb-20 text-center">
            <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
              Do any of these sound familiar?
            </h2>
          </div>

          <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {challenges.individuals.map((question, idx) => (
              <ChallengeCard key={idx} text={question} />
            ))}
          </div>
          {/* Closing message */}
          <div className="mt-20 text-center max-w-4xl mx-auto mb-20">
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
              Our mentoring combines
              <span> strategic thinking</span>,
              <span> first principles problem-solving</span>, and
              <span> applied psychology </span>
              to support you in making lasting progress, professionally and
              personally.
            </p>
          </div>
          <h2 className="text-3xl xs:text-3xl sm:text-4xl font-bold text-center text-[#0B4073] mb-12">
            What We Offer
          </h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-20">
            {offers.map((item, index) => (
              <React.Fragment key={index}>
                {/* Image Section with Motion */}
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="h-[200px] xs:h-[250px] sm:h-[300px] md:h-[350px] relative rounded-md overflow-hidden"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="w-full h-full object-cover rounded-md"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </motion.div>

                {/* Text Section with Motion */}
                <motion.div
                  className={`${item.bg} p-4 sm:p-6 rounded-md flex flex-col justify-center`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.1 }}
                >
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#0B4073] mb-3 sm:mb-4 pb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              </React.Fragment>
            ))}
          </div>

          <div className="container mx-auto px-6 mb-20">
            <h2 className="text-3xl xs:text-3xl sm:text-4xl font-bold text-center text-[#0B4073] mb-16">
              Who It's For
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {offerings.map((offering, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02 }}
                  className="transition-all duration-300"
                >
                  <div
                    className={`bg-white p-5 sm:p-8 rounded-xl shadow-sm hover:shadow-lg border border-[#D6E2EA] ${offering.bgColor}`}
                  >
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#0B4073] mb-3 sm:mb-4 border-b-2 border-[#D6E2EA] pb-2">
                      {offering.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
                      {offering.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {/* Heading */}
            <div className="mb-20 text-center">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Do any of these sound familiar?
              </h2>
            </div>

            <div className="grid gap-6 sm:gap-8 md:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
              {challenges.boardroom.map((question, idx) => (
                <div
                  key={idx}
                  className="flex items-start p-4 sm:p-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="text-[#0B4073] mt-1 mr-3 sm:mr-4 shrink-0">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <Image
                        src={IMAGE_PATHS.favicon}
                        alt="icon"
                        width={24}
                        height={24}
                        className="h-5 w-5 sm:h-6 sm:w-6 group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                  <p className="text-gray-800 text-base sm:text-lg leading-relaxed">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full bg-[#6A90B5] py-20 mt-20 mb-24 min-h-[0px] flex items-center">
            <div className="max-w-screen-xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 rounded-md">
              {/* Left: Image */}
              <div className="w-full md:w-1/2">
                <Image
                  src={additionalServiceImages.img8401}
                  alt="Team discussion"
                  width={600}
                  height={450}
                  className="rounded-lg shadow-md w-full object-cover h-full max-h-[450px]"
                />
              </div>

              {/* Right: Text */}
              <div className="w-full md:w-1/2 text-white text-center md:text-left">
                <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold mb-6">
                  How We Help?
                </h2>
                <p className="text-base sm:text-lg md:text-xl leading-relaxed">
                  True leadership excellence isn't just about processes and
                  expertise it's about people, behaviour, and decision-making at
                  the highest levels. Boards shape the direction of an
                  organisation, but fear, bias, and resistance to challenge can
                  often limit progress.
                  <br />
                  <br />
                  We use organisational and business psychology to help
                  leadership teams create high-performing boards. By
                  understanding how different personalities, cognitive styles,
                  and biases influence boardroom dynamics, we help leaders
                  create an open, high-performance culture where decisions are
                  informed, inclusive, and strategically sound.
                </p>
              </div>
            </div>
          </div>

          <h2 className="text-3xl xs:text-3xl sm:text-4xl font-bold text-center text-[#0B4073] mb-16">
            Our Approach
          </h2>
          <div className="space-y-12 sm:space-y-16 px-4 sm:px-10 mb-20">
            {approachSections.map((section, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.02 }}
                className="transition-all duration-300"
              >
                <div
                  className={`flex flex-col ${
                    section.reversed ? "md:flex-row-reverse" : "md:flex-row"
                  } gap-6 sm:gap-8 items-center`}
                >
                  <div className="flex-1">
                    <div className="bg-white shadow-sm rounded-xl p-5 sm:p-8 hover:shadow-lg transition-shadow duration-300 border border-[#D6E2EA]">
                      <div className="flex items-center mb-3 sm:mb-4">
                        <div className="mr-3 sm:mr-4 p-2 sm:p-3 rounded-full bg-[#D6E2EA]">
                          <Image
                            src={section.icon}
                            alt={section.title}
                            width={32}
                            height={32}
                          />
                        </div>
                        <h3 className="text-xl sm:text-2xl font-semibold text-[#0B4073]">
                          {section.title}
                        </h3>
                      </div>
                      <ul className=" pl-4 sm:pl-6 text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed space-y-1 sm:space-y-2">
                        {Array.isArray(section.description) ? (
                          section.description.map((point, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {point}
                            </motion.li>
                          ))
                        ) : (
                          <motion.li
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                          >
                            {section.description}
                          </motion.li>
                        )}
                      </ul>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="relative rounded-xl overflow-hidden shadow-sm bg-gradient-to-br from-[#D6E2EA]/20 to-[#D6E2EA]/10 aspect-video h-[150px] xs:h-[200px] sm:h-[250px] md:h-[300px] w-full">
                      <Image
                        src={section.img}
                        alt={section.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={idx < 2}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <ConsultationBookingSection
        options={[
          { type: "executive", title: "Executive Mentoring" },
          {
            type: "boardroom",
            title: "Boardroom Support",
          },
        ]}
      />
    </div>
  );
}
