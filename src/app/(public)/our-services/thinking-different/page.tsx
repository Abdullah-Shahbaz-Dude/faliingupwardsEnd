"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { FiCheck } from "react-icons/fi";
import { HeroSection } from "@/components/common/HeroSection";
import ConsultationBookingSection from "@/components/ConsultationBookingSection";
import Breadcrumb from "@/components/Breadcrumb";
import { IMAGE_PATHS } from "@/config/images";
import { additionalServiceImages, homepageImages } from "@/lib/frontend/images";

function DifferentThinkingContent() {
  return (
    <div className="font-roboto">
      <HeroSection
        title="DifferentThinking For Different Thinkers"
        backgroundImage={homepageImages.hero.heroImg2}
      />
      <Breadcrumb />
      {/* Introduction Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2
            className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0B4073] mb-16 text-center tracking-wide uppercase"
            style={{ letterSpacing: "0.04em" }}
          >
            HOW BIG DATA, NEURODIVERSE INSIGHT AND BUSINESS PSYCHOLOGY CAN TURN
            WORKFORCE THINKING INTO STRATEGIC ADVANTAGE.
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            <div className="lg:col-span-7 flex flex-col gap-8">
              <div className="bg-[#0B4073] text-white rounded-3xl p-8 sm:p-10 shadow-xl mb-6">
                <h3 className="text-2xl font-semibold mb-6 text-white">
                  Our tool helps businesses:
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-3 flex-shrink-0 text-white" />
                    <p className="text-white">
                      Understand what kinds of thinkers they already have
                    </p>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-3 flex-shrink-0 text-white" />
                    <p className="text-white">
                      Discover where strengths are being missed or underused
                    </p>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-3 flex-shrink-0 text-white" />
                    <p className="text-white">
                      Identify how to adapt roles, teams, or work conditions to
                      get better performance
                    </p>
                  </li>
                  <li className="flex items-start">
                    <FiCheck className="mt-1 mr-3 flex-shrink-0 text-white" />
                    <p className="text-white">
                      Recruit and support neurodiverse talent more strategically
                    </p>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="bg-[#E9F0F7] rounded-3xl p-8 sm:p-10 shadow-lg">
                <h3 className="text-2xl font-semibold mb-6 text-[#0B4073]">
                  It combines:
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-[#0B4073] p-2 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-white" />
                    </div>
                    <p className="text-gray-700">
                      Psychological insight (how different brains work)
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#0B4073] p-2 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-white" />
                    </div>
                    <p className="text-gray-700">
                      Lived experience (what gets in the way)
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-[#0B4073] p-2 rounded-full mr-3 flex-shrink-0">
                      <FiCheck className="text-white" />
                    </div>
                    <p className="text-gray-700">
                      AI and structured data (to make patterns visible and
                      decisions easier)
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-2xl group mb-6">
            <Image
              src={additionalServiceImages.dji0111}
              alt="Different thinking approaches"
              width={1600}
              height={300}
              className="object-cover w-full h-[200px] md:h-[300px] lg:h-[400px] transition-transform duration-500 group-hover:scale-105"
              priority={false}
            />
          </div>

          {/* Why It Matters Section */}
          <div className="mb-20">
            <div className="bg-[#F7FAFC] rounded-3xl p-8 md:p-12 shadow-lg">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B4073] mb-8">
                WHY IT MATTERS
              </h2>
              <div className="text-lg text-gray-700 space-y-6">
                <p>
                  Businesses and organisations face growing pressure to innovate
                  from digital adoption to workforce shortages and new
                  compliance demands. Sometimes, processes and cultures in these
                  industries can be geared toward one way of thinking and
                  working.
                </p>
                <p>
                  This can mean missed opportunities because different minds
                  don't always fit the default mould.
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold text-[#0B4073] mb-4">
                    Neurodivergent people can bring strengths that the industry
                    urgently needs:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    {[
                      "Laser focus for digital workflows and data models",
                      "Logical thinking for site sequencing, planning, and logistics",
                      "Creative problem solving in fast changing project environments",
                      "Detail oriented oversight in safety, compliance, or testing roles",
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="bg-white p-6 rounded-xl shadow flex items-start"
                      >
                        <div className=" p-2 rounded-full mr-3 flex-shrink-0">
                          <Image
                            src={IMAGE_PATHS.favicon}
                            alt="Check"
                            width={20}
                            height={20}
                          />
                        </div>
                        <p className="text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="mt-8">
                  Yet too often, these capabilities go unrecognised or the
                  environment doesn't allow them to be expressed. This tool
                  helps teams see and activate those strengths and match them to
                  the work that needs doing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* What It Does Section */}
      <section className="py-10 px-6 bg-gradient-to-br from-white to-[#F7FAFC] pt-0">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-[#0B4073] mb-12">
            WHAT IT DOES
          </h2>

          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
            <div className="text-lg text-gray-700">
              <p className="mb-8">
                At its core, the tool is an insight engine powered by real data
                and behavioural patterns. It analyses how people think, work,
                and experience their roles and helps you make sense of that in a
                way that's practical and actionable.
              </p>
              <h3 className="text-xl font-semibold text-[#0B4073] mb-4">
                The tool:
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {[
                  "Maps cognitive strengths to real world tasks and roles",
                  "Identifies where people are under-used or poorly matched",
                  "Flags friction points (like communication challenges or adjustment gaps)",
                  "Generates role fit and innovation potential scores",
                  "Helps you make changes that unlock performance, quickly and affordably",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start bg-[#F7FAFC] p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className=" p-2 rounded-full mr-3 flex-shrink-0">
                      <Image
                        src={IMAGE_PATHS.favicon}
                        alt="Check"
                        width={20}
                        height={20}
                      />
                    </div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>

              <p>
                It's built for team audits, transformation planning, and
                strategic recruitment. Whether you want to better use your
                current workforce or bring in new minds, it gives you a clear
                picture of where the potential is, and what's stopping it from
                showing up.
              </p>

              {/* Adding a new image */}
              <div className="mt-10 rounded-xl overflow-hidden shadow-lg">
                <div className="relative h-[300px] w-full">
                  <Image
                    src={additionalServiceImages.dji0110}
                    alt="Team collaboration and neurodiversity"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section (Previously Accordion) */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B4073] mb-8">
              HOW IT WORKS
            </h2>
            <div className="text-lg text-gray-700 space-y-6">
              <p>
                The tool is powered by insight collected directly from
                neurodivergent individuals through coaching, mentoring, and
                structured feedback. These individuals have shared how they
                think, work, and experience recruitment and employment.
              </p>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-[#0B4073] mb-4">
                  Insights collected include:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[#F7FAFC] p-6 rounded-xl shadow">
                    <h4 className="font-semibold text-[#0B4073] mb-2">
                      Strength areas
                    </h4>
                    <p>Systems logic, creativity, focus, analytical thinking</p>
                  </div>
                  <div className="bg-[#F7FAFC] p-6 rounded-xl shadow">
                    <h4 className="font-semibold text-[#0B4073] mb-2">
                      Working preferences
                    </h4>
                    <p>
                      Team vs solo, structured vs flexible, verbal vs visual
                    </p>
                  </div>
                  <div className="bg-[#F7FAFC] p-6 rounded-xl shadow">
                    <h4 className="font-semibold text-[#0B4073] mb-2">
                      Blockers
                    </h4>
                    <p>
                      Fear of disclosing, lack of adjustments, poor
                      communication match
                    </p>
                  </div>
                  <div className="bg-[#F7FAFC] p-6 rounded-xl shadow">
                    <h4 className="font-semibold text-[#0B4073] mb-2">
                      Motivators
                    </h4>
                    <p>
                      Clarity, autonomy, feedback, safety to contribute ideas
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-xl font-semibold text-[#0B4073] mb-4">
                  It uses this insight to generate:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Fit analysis: what type of work best suits different thinking styles",
                    "Improvement plans: what small changes would help teams thrive",
                    "Hiring suggestions: which profiles you may be missing for specific types of work",
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start bg-white p-4 rounded-lg shadow"
                    >
                      <div className=" p-2 rounded-full mr-3 flex-shrink-0">
                        <Image
                          src={IMAGE_PATHS.favicon}
                          alt="Check"
                          width={20}
                          height={20}
                        />
                      </div>
                      <p className="text-gray-700">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-center font-semibold text-[#0B4073] text-xl mt-8">
                You can apply this insight to current employees, new roles, or
                full team design.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Main Content */}
      <section className="py-10 px-6 md:px-10 lg:px-20">
        <div className="max-w-6xl mx-auto">
          {/* Wireframe Section */}
          <section className=" px-6 bg-[#F7FAFC] pt-0">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-center text-[#0B4073] mb-12">
                Key Functions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-[#70a9d0] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    DATA INGESTION
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Begin with survey data, updated monthly to capture evolving
                    workforce insights.
                  </p>
                </div>

                <div className="bg-[#18B8A9] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    PERSONA CLUSTERING
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Cluster respondents into personas by grouping preferences
                    and reasonable adjustment experiences.
                  </p>
                </div>

                <div className="bg-[#142d42] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    INNOVATION MAPPING
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Map each persona to digital innovation solutions they are
                    best suited to deliver (e.g. AI, UX Design, Data Science).
                  </p>
                </div>

                <div className="bg-[#142d42] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    ANALYTICS DASHBOARD
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Use an interactive dashboard to explore persona fit,
                    adjustment mapping, and innovation roles.
                  </p>
                </div>

                <div className="bg-[#70a9d0] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    ROLE MATCHING
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Run simulations to match personas against specific roles,
                    innovation goals and working preferences.
                  </p>
                </div>

                <div className="bg-[#18B8A9] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    PREDICTIVE ANALYTICS
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Forecast the impact of reasonable adjustments on
                    productivity, wellbeing and role alignment.
                  </p>
                </div>

                <div className="bg-[#18B8A9] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    SELF-ASSESSMENT
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Benchmark organisational practices against industry
                    standards for neuro inclusion and innovation potential.
                  </p>
                </div>

                <div className="bg-[#142d42] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    HR INTEGRATION
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Export recommendations, adjustment prompts, and role-fit
                    insights directly into your HR system via API.
                  </p>
                </div>

                <div className="bg-[#70a9d0] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    LIVE QUERIES
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Use natural language queries to surface key insights from
                    the dataset in real time.
                  </p>
                </div>

                {/* Adding three more wireframes from the image */}
                <div className="bg-[#142d42] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    PERSONA EXPLORER
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Dive deep into each persona to understand core strengths,
                    needs, and optimal role alignments.
                  </p>
                </div>

                <div className="bg-[#70a9d0] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    ROLE SIMULATION
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Simulate assignments and working conditions to identify
                    where specific personas will excel.
                  </p>
                </div>

                <div className="bg-[#18B8A9] rounded-3xl p-8 shadow-xl text-center hover:shadow-2xl transition-all duration-300">
                  <h3 className="text-xl font-bold text-white mb-6 uppercase">
                    SUCCESS STORIES
                  </h3>
                  <div className="bg-white p-6 rounded-full w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                    <Image
                      src={IMAGE_PATHS.favicon}
                      alt="Icon"
                      width={64}
                      height={64}
                    />
                  </div>
                  <p className="text-white">
                    Present real-life examples and sector case studies that
                    demonstrate the innovation potential of neurodivergent
                    talent.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* What It's Not - Previous Accordion */}
          <div className="my-16 bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B4073] mb-8">
              WHAT IT'S NOT
            </h2>
            <div className="text-lg text-gray-700 space-y-6">
              <p>
                This is not a psychometric test or a diagnostic assessment. It
                doesn't label individuals or reduce them to a category.
              </p>
              <p>
                Instead, it's a practical workforce strategy tool grounded in:
              </p>

              <ul className="space-y-3 pl-6 list-none">
                {[
                  "Applied psychology",
                  "Organisational design thinking",
                  "Evidence from coaching, mentoring, and therapy work with neurodiverse professionals",
                  "Real-world data",
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <div className=" p-2 rounded-full mr-3 flex-shrink-0">
                      <Image
                        src={IMAGE_PATHS.favicon}
                        alt="Check"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 bg-[#6A90B5] p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-white mb-4">
                  It helps leaders ask better questions:
                </h3>
                <ul className="space-y-3 pl-6 list-none">
                  {[
                    "Are we getting the most from the brains in our business?",
                    "What's being held back and why?",
                    "Where can different thinking help us grow, improve, or de-risk?",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-white mr-2">•</span>
                      <span className="text-white">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* What You Can Use It For - Previous Accordion */}
          <div className="my-16 bg-white rounded-3xl p-8 md:p-12 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0B4073] mb-8">
              WHAT YOU CAN USE IT FOR
            </h2>
            <div className="text-lg text-gray-700 space-y-8">
              <div className="bg-[#F7FAFC] p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-[#0B4073] mb-4">
                  Inside your current workforce:
                </h3>
                <ul className="space-y-3 pl-6 list-none">
                  {[
                    "Run a light-touch audit to find underused strengths",
                    "Understand why some roles or teams aren't working well",
                    "Adjust job design or communication patterns to unlock performance",
                    "Create psychologically safer environments to keep good people engaged",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className=" p-2 rounded-full mr-3 flex-shrink-0">
                        <Image
                          src={IMAGE_PATHS.favicon}
                          alt="Check"
                          width={20}
                          height={20}
                        />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#F7FAFC] p-8 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold text-[#0B4073] mb-4">
                  For new hires or recruitment rounds:
                </h3>
                <ul className="space-y-3 pl-6 list-none">
                  {[
                    "Identify what kind of thinker would best suit a specific challenge",
                    "Use a data-backed framework to onboard, brief or support neurodivergent employees",
                    "Improve apprenticeship retention or digital team cohesion",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className=" p-2 rounded-full mr-3 flex-shrink-0">
                        <Image
                          src={IMAGE_PATHS.favicon}
                          alt="Check"
                          width={20}
                          height={20}
                        />
                      </div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Implementation Steps */}
          <div className="my-16 bg-gradient-to-br from-[#0B4073] to-[#6A90B5] rounded-3xl p-8 md:p-12 shadow-xl overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-5 rounded-full -mr-40 -mt-20"></div>
            <div className="absolute -left-10 bottom-10 w-40 h-40 bg-white opacity-5 rounded-full"></div>
            <div className="absolute right-20 bottom-0 w-20 h-20 bg-white opacity-5 rounded-full"></div>

            <h2 className="text-4xl font-bold text-white mb-4 text-center relative z-10">
              Implementation Steps
            </h2>
            <div className="w-32 h-1 bg-white opacity-50 mx-auto mb-8"></div>

            {/* Adding an image before the implementation steps */}
            <div className="mb-10 rounded-xl overflow-hidden shadow-2xl max-w-2xl mx-auto transform transition-all duration-300 hover:scale-[1.01]">
              <div className="relative h-[250px] w-full">
                <Image
                  src={homepageImages.hero.heroImg2}
                  alt="Implementation process visualization"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B4073]/50 to-transparent"></div>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              We guide you through:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              {[
                {
                  Image: IMAGE_PATHS.favicon,
                  text: "Discovery audit - understand team dynamics and strategic needs",
                },
                {
                  Image: IMAGE_PATHS.favicon,
                  text: "Insights capture - gather anonymised input using our structured format",
                },
                {
                  Image: IMAGE_PATHS.favicon,
                  text: "Algorithm analysis - map cognitive patterns to your organisation",
                },
                {
                  Image: IMAGE_PATHS.favicon,
                  text: "Insight report - visual summary of risks, gaps, and activation opportunities",
                },
                {
                  Image: IMAGE_PATHS.favicon,
                  text: "Workforce actions - recommend role adjustments, support steps, and innovation matches",
                },
                {
                  Image: IMAGE_PATHS.favicon,
                  text: "Recruitment mapping - help you design smarter briefs, or connect with matched candidates",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0B4073] to-[#70a9d0]"></div>
                  <div className="flex items-start pt-2">
                    <div className="   text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg mr-4 flex-shrink-0 shadow-md">
                      <Image
                        src={step.Image}
                        alt="Icon"
                        width={20}
                        height={20}
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">{step.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Who This Is For */}
          <div className="py-16 mb-16 bg-gradient-to-b from-white to-[#f0f7ff]">
            <div className="max-w-6xl mx-auto px-6">
              <h2 className="text-4xl font-bold text-[#0B4073] mb-4 text-center">
                Who This Is For
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-[#0B4073] to-[#70a9d0] mx-auto mb-12"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "CEOs",
                    description: "Looking to future-proof their business",
                    icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
                  },
                  {
                    title: "Project and Operations directors",
                    description: "Leading transformation and operations",
                    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
                  },
                  {
                    title: "HR Leaders",
                    description:
                      "Tackling talent retention and performance gaps",
                    icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
                  },
                  {
                    title: "Digital Teams",
                    description: "Building innovation capacity from within",
                    icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4",
                  },
                  {
                    title: "Tier 1 Contractors",
                    description: "Managing large, diverse, or blended teams",
                    icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                  },
                ].map((client, index) => (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-t border-gray-100 overflow-hidden"
                  >
                    {/* Background gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0B4073]/5 to-[#70a9d0]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B4073] to-[#70a9d0] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>

                    <div className="flex flex-col items-center text-center">
                      {/* Icon */}
                      <div className="bg-[#0B4073] w-16 h-16 rounded-full mb-6 flex items-center justify-center shadow-md transform group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-7 h-7 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={client.icon}
                          />
                        </svg>
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold text-[#0B4073] mb-2">
                        {client.title}
                      </h3>
                      <p className="text-gray-600">{client.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* PDF Resources Section - Added before booking section */}
      <section className="py-16 pt-0 px-6 bg-gradient-to-r from-[#EFF6FB] via-[#F7FAFC] to-white overflow-hidden relative">
        {/* Add decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#0B4073] opacity-5 rounded-full -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#70a9d0] opacity-5 rounded-full -ml-20 -mb-20"></div>

        <div className="max-w-4xl mx-auto relative">
          <h2 className="text-4xl font-bold text-[#0B4073] mb-4 text-center">
            Resources
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#0B4073] to-[#70a9d0] mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 text-center mb-12">
            Download our detailed information about neurodiversity in the
            workplace and how our services can help your organization thrive.
          </p>

          <div className="bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
            <div className="flex flex-col md:flex-row">
              {/* PDF Thumbnail/Preview - Improved */}
              <div className="md:w-1/3 bg-gradient-to-br from-[#0B4073] to-[#6A90B5] p-8 flex items-center justify-center">
                <div className="w-40 h-56 bg-white shadow-lg rounded transform rotate-3 transition-transform duration-300 hover:rotate-0 relative">
                  <div className="absolute inset-1 bg-white rounded border border-gray-200 flex flex-col overflow-hidden">
                    <div className="bg-red-600 w-full py-2 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        PDF RESOURCE
                      </span>
                    </div>
                    <div className="p-2 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-[#0B4073] font-bold text-xs mb-1">
                          THINKING DIFFERENTLY
                        </h4>
                        <p className="text-gray-600 text-xs mb-2">
                          About Different Thinkers
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded"></div>
                        <div className="h-1 bg-gray-200 rounded w-2/3"></div>
                      </div>
                      <div className="flex justify-end mt-4">
                        <div className="w-10 h-10 rounded-full bg-[#0B4073] opacity-20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Description & Download Button */}
              <div className="md:w-2/3 p-8 md:p-10">
                <h3 className="text-2xl font-semibold text-[#0B4073] mb-3">
                  Thinking Differently About Different Thinkers
                </h3>
                <div className="w-16 h-1 bg-[#0B4073] mb-4"></div>
                <p className="text-gray-600 mb-6">
                  This comprehensive guide covers everything you need to know
                  about implementing neurodiversity-friendly practices in your
                  organization. Includes case studies, implementation
                  strategies, and ROI analysis.
                </p>
                <div className="flex items-center text-gray-500 text-sm mb-8">
                  <svg
                    className="w-5 h-5 mr-2 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <p>PDF Format • Download for full information</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-5">
                  <a
                    href="/pdf/Thinking-Differently-About-Different-Thinkers-Main.pdf"
                    className="inline-flex items-center justify-center bg-[#0B4073] text-white rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#0a3863] hover:shadow-lg"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    View PDF
                  </a>

                  <a
                    href="/pdf/Thinking-Differently-About-Different-Thinkers-Main.pdf"
                    className="inline-flex items-center justify-center bg-white text-[#0B4073] border border-[#0B4073] rounded-full px-6 py-3 font-medium transition-all duration-300 hover:bg-[#F7FAFC] hover:shadow-lg"
                    download="Thinking-Differently-About-Different-Thinkers.pdf"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ConsultationBookingSection
        options={[
          {
            type: "thinking-different",
            title: "Different Thinking For Different Thinkers",
          },
        ]}
      />
    </div>
  );
}

export default function DifferentThinkingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50"></div>
      }
    >
      <DifferentThinkingContent />
    </Suspense>
  );
}
