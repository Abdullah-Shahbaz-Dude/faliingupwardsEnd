"use client";

import React, { useState } from "react";
import Image from "next/image";

import { FiChevronDown, FiUsers, FiBriefcase } from "react-icons/fi";
import { HeroSection } from "@/components/common/HeroSection";
import ConsultationBookingSection from "@/components/ConsultationBookingSection";
import Breadcrumb from "@/components/Breadcrumb";
import { psychologicalImgs } from "@/lib/frontend/images";
import { IMAGE_PATHS } from "@/config/images";

export default function PsychologicalTherapyPage() {
  const {
    help,
    achieve,
    hero,
    ourApproach,
    thingsForYou,
    togetherWeWill,
    walkingTherapy,
  } = psychologicalImgs;
  const coachingOutcomes = [
    "A clearer understanding of how your ADHD affects you",
    "Reduced stress, anxiety, and emotional overwhelm",
    "Increased self-awareness and self-acceptance",
    "Better habits and routines that support your energy levels",
    "Improved relationships through stronger communication and boundary-setting",
    "A more structured approach to work, career growth, or parenting",
    "A sense of empowerment and control over your life",
  ];
  const dropdownData = [
    {
      id: 1,
      title: "Identify Your Strengths & Challenges",
      content:
        "Understand how ADHD uniquely affects you and leverage your strengths to create practical strategies.",
    },
    {
      id: 2,
      title: "Improve Emotional Regulation & Resilience",
      content:
        "Build skills to manage overthinking, rejection sensitivity, and emotional fluctuations.",
    },
    {
      id: 3,
      title: "Increase Focus & Reduce Procrastination",
      content:
        "Discover tools and techniques to improve time management and task completion.",
    },
    {
      id: 4,
      title: "Enhance Decision-Making & Self-Trust",
      content:
        "Learn to trust your own judgement, reduce reliance on external validation, and build self-confidence.",
    },
    {
      id: 5,
      title: "Navigate Relationships & Boundaries",
      content:
        "Gain skills in communication, boundary-setting, and emotional balance in personal and professional relationships.",
    },
    {
      id: 6,
      title: "Optimise Productivity & Motivation",
      content:
        "Find strategies to work with your ADHD brain rather than against it, increasing efficiency and satisfaction in your work or business.",
    },
  ];

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  const toggleDropdown = (id: number): void => {
    setOpenDropdown((prev) => (prev === id ? null : id));
  };

  const [activeOption, setActiveOption] = useState("psychological");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <HeroSection
        title="Psychological Therapy & ADHD Coaching"
        backgroundImage={hero}
      />

      <Breadcrumb />
      {/* Selection Cards */}
      <section className="py-16 px-6 bg-[#F7FAFC] flex items-center justify-center">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            <button
              onClick={() => setActiveOption("psychological")}
              className={`group p-8 md:p-10 rounded-2xl transition-all duration-300 flex flex-col items-center text-center ${
                activeOption === "psychological"
                  ? "bg-[#0B4073] text-white shadow-xl"
                  : "bg-white hover:bg-[#D6E2EA]/30 text-gray-700 shadow-md hover:shadow-xl"
              }`}
            >
              <div
                className={`p-6 rounded-full mb-6 ${
                  activeOption === "psychological"
                    ? "bg-white/20"
                    : "bg-[#D6E2EA]"
                }`}
              >
                <FiUsers
                  className={`w-12 h-12 ${
                    activeOption === "psychological"
                      ? "text-white"
                      : "text-[#0B4073]"
                  }`}
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">Psychological Therapy</h3>
              <p
                className={`text-base ${
                  activeOption === "psychological"
                    ? "text-white/80"
                    : "text-gray-600"
                }`}
              ></p>
            </button>

            <button
              onClick={() => setActiveOption("adhd")}
              className={`group p-8 md:p-10 rounded-2xl transition-all duration-300 flex flex-col items-center text-center ${
                activeOption === "adhd"
                  ? "bg-[#0B4073] text-white shadow-xl"
                  : "bg-white hover:bg-[#D6E2EA]/30 text-gray-700 shadow-md hover:shadow-xl"
              }`}
            >
              <div
                className={`p-6 rounded-full mb-6 ${
                  activeOption === "adhd" ? "bg-white/20" : "bg-[#D6E2EA]"
                }`}
              >
                <FiBriefcase
                  className={`w-12 h-12 ${
                    activeOption === "adhd" ? "text-white" : "text-[#0B4073]"
                  }`}
                />
              </div>
              <h3 className="text-2xl font-bold mb-3">ADHD Coaching</h3>
              <p
                className={`text-base ${
                  activeOption === "adhd" ? "text-white/80" : "text-gray-600"
                }`}
              ></p>
            </button>
          </div>
        </div>
      </section>

      {/* Content based on selection */}
      {activeOption === "psychological" && (
        <>
          {/* New Content Section */}
          <section className="bg-[#0B4073] text-white py-20 px-6 md:px-12 relative mb-20">
            {/* Decorative Element */}
            <div className="absolute inset-0 bg-[#A0E7E5] opacity-20 -z-10"></div>

            {/* Header Section */}
            <div className="max-w-5xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-6 text-[#F5F5F5]">
                Are your worries, negative thoughts and{" "}
                <span>experiences impacting</span> the life you want to live?
              </h2>
            </div>

            {/* Content Section */}
            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-xl font-semibold text-[#F5F5F5] mb-4">
                Let us help
              </p>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Psychological therapy can help support people live happy and
                healthy lives, and not to feel shackled by experiences and
                situations that can prevent them from enjoying the here and now
                and looking forwards to a happy future.
              </p>
            </div>
            {/* Inserted Image */}
            <div className="flex justify-center mt-12">
              <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={help}
                  alt="Therapy in nature"
                  width={900}
                  height={350}
                  className="object-cover w-full h-[220px] md:h-[350px]"
                  priority={false}
                />
              </div>
            </div>
          </section>

          {/* List of challenges */}
          {/* Heading */}
          <div className="mb-20 text-center mt-16 ">
            <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#0B4073] leading-tight">
              How are things for you?
            </h2>
          </div>
          {/* Inserted Image after 'How are things for you?' */}
          <div className="flex justify-center mb-12">
            <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src={thingsForYou}
                alt="Therapy room"
                width={900}
                height={350}
                className="object-cover w-full h-[220px] md:h-[350px]"
                priority={false}
              />
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-6 md:px-12 ">
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
              {[
                "Do you feel lost, different, or excluded from the world around you?",
                "Do you struggle with your identity and sense of belonging?",
                "Do you carry unresolved pain, trauma or buried memories?",
                "Are relationships hard to build or maintain?",
                "Do you feel like you're living life for everyone but yourself?",
                "Do impulsive thoughts, overwhelming emotions, or cycles of behaviour keep pulling you off track?",
                "Are you masking who you really are to get through each day?",
                "Do you feel lonely, misunderstood, or unbalanced?",
                "Are you facing a major life change or living with grief that feels hard to name?",
              ].map((question, idx) => (
                <div
                  key={idx}
                  className="flex min-h-[120px] items-start p-6  bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="text-[#0B4073] mt-1 mr-4 shrink-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={IMAGE_PATHS.favicon} // Replace this with your image path
                        alt="icon"
                        className="h-6 w-6 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-base font-medium group-hover:text-[#0B4073] transition-colors duration-200"></span>
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed h-">
                    {question}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <section className="bg-[#F8FAFC] pt-20 px-6 md:px-12">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-[#0B4073]">
                  How Therapy Can Support You
                </h2>
                <p className="text-lg md:text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
                  Our sessions offer a safe, non-judgemental space to explore
                  what's going on, where it comes from, and how to move through
                  it with empathy, not pressure.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  "Feel listened to, validated, and genuinely seen",
                  "Make sense of your inner world and life experiences",
                  "Break free from patterns that no longer serve you",
                  "Feel more grounded, calm, and in control",
                  "Be kinder to yourself and reconnect with your values",
                  "Begin to accept, integrate, and heal",
                  "Move towards the life you want—not the one you've been surviving",
                ].map((point, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition-all duration-300 border border-gray-200 flex items-start gap-4"
                  >
                    <div className="flex-shrink-0">
                      <Image
                        src={IMAGE_PATHS.favicon}
                        alt="Icon"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                    </div>
                    <p className="text-gray-700 text-base font-medium leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Our Approach Section */}
          <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12 py-16 pt-0 mb-16 md:mb-0 mt-16">
            <div className="  p-8 pt-0 md:p-16 ">
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B4073] mb-8 text-center">
                Our Approach
              </h2>
              <p className="text-lg md:text-xl text-gray-700 mb-8 text-center">
                We use an integrative model of therapy, adapting each session to
                meet your unique needs. This may include:
              </p>
              {/* Inserted Image in Our Approach section */}
              <div className="flex justify-center mb-12">
                <div className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src={ourApproach}
                    alt="Therapy walk"
                    width={900}
                    height={350}
                    className="object-cover w-full h-[220px] md:h-[350px]"
                    priority={false}
                  />
                </div>
              </div>
              <div className="space-y-10 mt-12">
                {[
                  "Compassion-Focused Therapy",
                  "EMDR (Eye Movement Desensitisation and Reprocessing)",
                  "Inner Child Therapy",
                  "Existential / Person-Centred Therapy",
                  "Dialectic Behavioural Therapy",
                ].map((approach, idx) => (
                  <div
                    key={idx}
                    className="relative bg-white border-l-4 border-[#7094B7] pl-6 pr-4 py-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="absolute -left-4 top-6 h-8 w-8 rounded-full bg-[#7094B7] text-white flex items-center justify-center font-bold shadow-md">
                      {idx + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-[#0B4073] mb-2">
                      {approach}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Spacer for mobile only */}
          <div className="block md:hidden h-10"></div>
          <div>
            <div className="relative bg-white overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 opacity-50"></div>

              <div className="relative max-w-7xl mx-auto px-6 py-20 lg:px-8">
                {/* Header section */}
                <div className="text-center mb-16">
                  <h1 className="text-4xl md:text-5xl font-bold text-[#0B4073] mb-4">
                    <span className="block text-6xl mb-6">
                      Walking Therapy:
                    </span>
                    <span className="text-[#0B4073]">
                      A Different Way to Talk
                    </span>
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-[#0B4073] to-[#0B4073] mx-auto mt-6"></div>
                </div>

                {/* Content grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-start">
                  {/* Left column - Description */}
                  <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                    <div className="prose prose-lg text-gray-700">
                      <p>
                        As an alternative to face-to-face or online therapy,
                        Walking Therapy offers something a little different.
                        Sometimes, stepping outside can help us connect more
                        deeply, both with ourselves and with the world around
                        us.
                      </p>
                      <p className="mt-6">
                        Walking Therapy blends gentle movement with
                        conversation, allowing the rhythm of walking and the
                        presence of nature to support the therapeutic process.
                        For many people, walking side-by-side makes it easier to
                        talk, with words and feelings flowing more naturally in
                        the open air.
                      </p>
                    </div>
                    {/* Image below the white box */}
                    <div className="flex justify-center mt-8">
                      <div className="relative w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl">
                        <Image
                          src={walkingTherapy}
                          alt="Walking therapy in nature"
                          width={800}
                          height={300}
                          className="object-cover w-full h-[180px] md:h-[300px]"
                          priority={false}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right column - Benefits */}
                  <div className="space-y-8">
                    <div className="bg-gradient-to-br from-[#D6E2EA] to-[#D6E2EA] rounded-2xl shadow-lg p-8 border border-blue-100">
                      <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                        The Benefits of Walking Therapy
                      </h2>

                      <ul className="space-y-6">
                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-4 text-blue-500">
                            <img
                              src={IMAGE_PATHS.favicon}
                              alt="icon"
                              className="h-6 w-6 group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Connection with nature
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Supporting emotional regulation, reducing stress,
                              and offering a grounded sense of presence.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-4 text-blue-500">
                            <img
                              src={IMAGE_PATHS.favicon}
                              alt="icon"
                              className="h-6 w-6 group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Movement and Mindfulness
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Engaging the body can foster mindfulness, release
                              endorphins, and promote a sense of vitality.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-4 text-blue-500">
                            <img
                              src={IMAGE_PATHS.favicon}
                              alt="icon"
                              className="h-6 w-6 group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Ease and Flow
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Walking often makes difficult conversations feel
                              lighter and less intense, helping emotional
                              processing unfold more organically.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-4 text-blue-500">
                            <img
                              src={IMAGE_PATHS.favicon}
                              alt="icon"
                              className="h-6 w-6 group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Creativity and Insight
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Natural environments have been shown to boost
                              creative thinking and emotional exploration.
                            </p>
                          </div>
                        </li>

                        <li className="flex items-start">
                          <div className="flex-shrink-0 mt-1 mr-4 text-blue-500">
                            <img
                              src={IMAGE_PATHS.favicon}
                              alt="icon"
                              className="h-6 w-6 group-hover:scale-110 transition-transform"
                            />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              Support for mood
                            </h3>
                            <p className="text-gray-600 mt-1">
                              Regular time in nature has been associated with
                              reduced symptoms of depression and anxiety.
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <section className="bg-white py-16 px-6 sm:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto border border-blue-200 rounded-2xl p-6 sm:p-8 md:p-12 bg-white shadow-xl">
                {/* Main Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#0B4073] mb-6">
                  How therapy can support you
                </h2>

                {/* Subtitle */}
                <p className="text-center text-gray-700 max-w-3xl mx-auto mb-8 sm:mb-10 text-lg sm:text-xl leading-relaxed">
                  Our sessions offer a safe, non-judgemental space to explore
                  what's going on, where it comes from, and how to move through
                  it—with empathy, not pressure.
                </p>

                {/* Help Box */}
                <div className="bg-[#D6E2EA] rounded-2xl p-8 sm:p-12 md:p-16 space-y-6 border border-blue-100 shadow-inner">
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-[#0B4073] mb-6">
                    We can help you:
                  </h3>

                  <ul className="space-y-4">
                    {[
                      "Feel listened to, validated and genuinely seen",
                      "Make sense of your inner world and life experiences",
                      "Break free from patterns that no longer serve you",
                      "Feel more grounded, calm, and in control",
                      "Be kinder to yourself and reconnect with your values",
                      "Begin to accept, integrate and heal",
                      "Move towards the life you want—not the one you've been surviving",
                    ].map((item, index) => (
                      <li
                        key={index}
                        className="bg-white flex items-center text-gray-800 min-h-[80px] sm:min-h-[90px] md:min-h-[100px] text-base sm:text-lg md:text-xl leading-snug rounded-xl px-4 sm:px-5 md:px-6 py-4 sm:py-5 shadow-md border border-gray-200 hover:shadow-lg hover:border-blue-300 transition duration-300"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </>
      )}

      {/* Placeholder content for ADHD Coaching */}
      {activeOption === "adhd" && (
        <div>
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            {/* Heading */}
            <div className="mb-20 text-center mt-20">
              <h2 className="text-5xl md:text-6xl font-extrabold tracking-tight text-[#0B4073] leading-tight">
                Unlock Your Potential with ADHD Coaching
              </h2>
              <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
                Are any of these challenges holding you back?
              </p>
            </div>

            {/* List of challenges */}
            <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-2">
              {[
                "Do you struggle with 	overthinking and getting lost in your thoughts?",
                "Do you frequently start tasks but abandon them halfway through?",
                "Do you find it hard to relax or feel mentally exhausted all the time?",
                "Do you experience brain fog and struggle to think clearly?",
                "Are mornings difficult, leaving you groggy and unmotivated?",
                "Do you have trouble maintaining a consistent routine with diet, exercise, or self-care?",
                "Do you feel overly sensitive to criticism or fear rejection?",
                "Do you seek reassurance from others but struggle to trust your own decisions?",
                "Do you overcomplicate things, making it hard to follow through on your goals?",
                "Are you easily distracted by noise, visual stimuli, or your environment?",
                "Do you find it difficult to set and maintain personal boundaries?",
                "Do you struggle with emotional regulation, feeling intense highs and lows?",
                "Do you feel shame as you think you do not fit in and repeat cycles",
                "Do 	you analyse every interaction, worrying about how others perceive 	you?",
                "Do 	you often procrstinate?",
                "Have 	you felt stuck in unhealthy relationships, struggling to move on?",
                "Do 	you find you are overly sensitive to rejection.",
              ].map((question, idx) => (
                <div
                  key={idx}
                  className="flex items-start p-6 bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="text-[#0B4073] mt-1 mr-4 shrink-0">
                    <div className="flex items-center space-x-3">
                      <img
                        src={IMAGE_PATHS.favicon}
                        alt="icon"
                        className="h-6 w-6 group-hover:scale-110 transition-transform"
                      />
                      <span className="text-base font-medium group-hover:text-[#0B4073] transition-colors duration-200"></span>
                    </div>
                  </div>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {question}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-20 text-center max-w-4xl mx-auto ">
              <p className="text-2xl md:text-2xl text-gray-700 leading-relaxed">
                Whilst some of the above is directly assocated with{" "}
                <span>ADHD</span>, <span>some of it may not be</span>, and{" "}
                <span className="font-semibold text-[#0B4073]">
                  coaching will help you understand this better and develop a
                  better understand
                </span>{" "}
                to help you move forwards with clarity.
              </p>
            </div>
          </div>
          <div className="mb-16 mt-20 mx-5">
            <div className="bg-[#7094B7] rounded-xl overflow-hidden shadow-md">
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls="coachingForContent"
                className="w-full    text-left px-8 py-6 md:px-16 md:py-8 flex items-center justify-between text-[#0B4073] bg-[#7094B7] font-bold text-2xl md:text-4xl focus:outline-none transition-colors hover:bg-[#5f86ad]"
              >
                Who Is This ADHD Coaching For?
                <FiChevronDown
                  className={`ml-4 text-3xl text-[#0B4073] transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                id="coachingForContent"
                className={`transition-all duration-500 ease-in-out bg-[#7094B7] px-8 md:px-16 ${
                  isOpen
                    ? "max-h-[1000px] py-8 space-y-6"
                    : "max-h-0 overflow-hidden py-0"
                }`}
              >
                <p className="text-white leading-relaxed">
                  Whether you are an adult navigating ADHD in the workplace, a
                  business owner struggling with focus and organisation, a
                  parent managing the complexities of family life, or someone
                  looking to understand if they have ADHD and are unsure what to
                  do, this coaching is for you.
                </p>

                <p className="text-white leading-relaxed">
                  You may be struggling with focus, motivation, or feeling
                  overwhelmed in your personal or professional life. Do you
                  often feel like your brain is working against you rather than
                  with you? ADHD can impact various areas of life, from
                  relationships and career success to parenting and self-esteem.
                  My coaching is designed to help you navigate these challenges,
                  understand yourself better, and create strategies that work
                  for you.
                </p>

                <p className="text-white leading-relaxed">
                  I have ADHD myself and have real-world experience of many of
                  the challenges associated with it. However, I also thrive in
                  equal measure, as I've learned how to make the most of the
                  condition — and that's what I'd like to help you do .
                </p>
                <span className="font-semibold text-[#0B4073]">
                  Alex chruch{" "}
                </span>
              </div>
            </div>
          </div>

          {/* Together We Will Section */}
          <div className="mb-24">
            <div className="bg-[#D6E2EA] rounded-2xl p-10 md:p-16 shadow-sm">
              <div className="grid md:grid-cols-2 gap-12 items-start">
                {/* Left - Text & Image */}
                <div className="flex flex-col gap-6 p-8 bg-white rounded-2xl shadow transition-shadow hover:shadow-md">
                  <p className="text-gray-800 text-lg leading-relaxed">
                    I take a holistic, personalised approach to ADHD coaching,
                    combining evidence-basedstrategies with real-world
                    experience. Sessions are tailored to your unique needs,
                    whether you are looking for structure in your daily life,
                    better emotional regulation, or guidance in navigating
                    relationships and career decisions.
                  </p>

                  <div className="relative w-full h-[350px] overflow-hidden rounded-xl mt-4">
                    <Image
                      src={togetherWeWill}
                      alt="Colorful forest view representing ADHD coaching"
                      fill
                      style={{ objectFit: "cover" }}
                      className="rounded-xl"
                    />
                  </div>
                </div>

                {/* Right - Heading & Dropdowns */}
                <div className="flex flex-col gap-8">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-[#0B4073] leading-snug text-left">
                    Together we will
                  </h3>

                  <div className="flex flex-col gap-6">
                    {dropdownData.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl shadow transition-shadow hover:shadow-md overflow-hidden"
                      >
                        <button
                          className="w-full px-6 py-5 flex items-center justify-between text-left text-[#0B4073] font-semibold text-lg focus:outline-none"
                          onClick={() => toggleDropdown(item.id)}
                          aria-expanded={openDropdown === item.id}
                          aria-controls={`dropdown-${item.id}`}
                        >
                          <span>{item.title}</span>
                          <FiChevronDown
                            className={`text-xl transition-transform duration-300 ${
                              openDropdown === item.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <div
                          id={`dropdown-${item.id}`}
                          className={`transition-all duration-300 ease-in-out text-gray-700 text-base ${
                            openDropdown === item.id
                              ? "max-h-96 px-6 pb-6"
                              : "max-h-0 px-6 pb-0 overflow-hidden"
                          }`}
                        >
                          <p>{item.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* What You Can Expect to Achieve Section */}
          <div className="mb-10 bg-[#0B4073] text-white rounded-xl p-16">
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-10 text-center">
              What You Can Expect to Achieve
            </h3>

            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-32">
              {/* Left: Image */}
              <div className="flex-shrink-0 w-full lg:w-1/3 flex justify-center">
                <Image
                  src={achieve} // Replace with your actual image path
                  alt="What You Can Expect"
                  className="w-full max-w-sm rounded-lg"
                />
              </div>

              {/* Right: Bullet List */}
              <div className="w-full lg:w-2/3 grid md:grid-cols-1 gap-11  mt-4">
                {coachingOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      <img
                        src={IMAGE_PATHS.favicon}
                        alt="icon"
                        className="h-6 w-6 group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <p className="text-white">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <section className="mb-10 mt-20 text-center px-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-xl font-bold text-[#0B4073] mb-4">
                {" "}
                ADHD doesn't have to hold you back. With the right strategies
                and support, you can thrive and achieve your goals in a way that
                works for you.
              </h2>
            </div>
          </section>
        </div>
      )}

      <ConsultationBookingSection
        options={[
          { type: "psychological", title: " Psychological Therapy" },
          {
            type: "adhd",
            title: "ADHD Coaching",
          },
        ]}
      />
    </div>
  );
}
