"use client";

import Image from "next/image";
import AccordionItem from "./AccordionItem";
import { homepageImages } from "@/lib/frontend/images";

const WhyChooseSection = () => {
  return (
    <section className="section bg-white relative overflow-hidden py-20">
      <div className="container-custom mx-auto relative z-10 px-2 sm:px-4 md:px-6">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#0B4073] mb-10 sm:mb-14 leading-tight break-words"
          style={{ wordBreak: "break-word" }}
        >
          Why Choose Falling Upwards
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 sm:gap-x-12 gap-y-8 sm:gap-y-10 items-start">
          {/* Left side - Image */}
          <div className="flex justify-center items-center mb-6 md:mb-0">
            <div className="rounded-3xl overflow-hidden w-full max-w-[320px] sm:max-w-[400px] h-[180px] sm:h-[250px] md:w-[500px] md:h-[500px] shadow-xl border border-gray-200 transition-shadow duration-500 hover:shadow-2xl">
              <Image
                src={homepageImages.sections.whyChooseSection}
                alt="Aerial view of a beach"
                width={500}
                height={500}
                className="w-full h-full object-cover rounded-3xl"
                priority={false}
              />
            </div>
          </div>

          {/* Right side - Accordion */}
          <div className="w-full max-w-full space-y-4 sm:space-y-6">
            <AccordionItem
              title="Psychology at the Core"
              isOpen={false}
              content={
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
                  <p>
                    We ground all our work in evidence-based psychological
                    principles, from therapy to team development, strategy to
                    AI. We have a deep commitment to understanding people,
                    behaviour, systems, and creating meaningful change.
                  </p>
                </div>
              }
            />

            <AccordionItem
              title="Compassionate and People Centred"
              content={
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
                  <p>
                    We are unapologetically person-centred and compassionate. We
                    listen, build, challenge, and design. Whether working with
                    individuals or organisations, we hold space for
                    vulnerability, curiosity, and meaningful growth.
                  </p>
                </div>
              }
            />

            <AccordionItem
              title="Different Thinking"
              content={
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
                  <p>
                    We see neurodiversity as a strategic and creative advantage,
                    not something to be "managed," but understood, embraced, and
                    leveraged. Our work helps individuals thrive as they are,
                    and helps organisations create strategic advantage from
                    Neurodiverse thinking.
                  </p>
                </div>
              }
            />

            <AccordionItem
              title="Human Centred AI & Data Principles"
              content={
                <div className="text-gray-700 text-sm sm:text-base leading-relaxed space-y-2">
                  <p>
                    We develop AI and data efficiency from the ground up,
                    starting with people, not platforms. Using first principles
                    thinking and psychology we help solve problems and support
                    organisations think forwards in a simple and understandable
                    way.
                  </p>
                </div>
              }
            />
          </div>
        </div>
      </div>
      <style jsx global>{`
        @media (max-width: 400px) {
          .section h2 {
            font-size: 1.5rem !important;
            margin-bottom: 1.5rem !important;
          }
          .section .text-base,
          .section .text-sm {
            font-size: 0.95rem !important;
          }
          .section .leading-relaxed {
            line-height: 1.5 !important;
          }
          .section .rounded-3xl {
            border-radius: 1rem !important;
          }
          .section .p-4,
          .section .p-6 {
            padding: 0.75rem !important;
          }
        }

        /* Custom resolution for 2049x992 */
        @media screen and (width: 2049px) and (height: 992px) {
          .container-custom {
            max-width: 1800px !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }

          .hero-section {
            height: 80vh !important;
          }

          .hero-section h1 {
            font-size: 6rem !important;
          }

          .hero-section p {
            font-size: 1.5rem !important;
          }

          /* Adjust grid layouts */
          .grid {
            gap: 1.5rem !important;
          }

          /* Adjust card sizes */
          .rounded-xl {
            max-width: 400px !important;
          }

          /* Adjust logo sizes */
          .max-w-40 {
            max-width: 32px !important;
          }
        }
      `}</style>
    </section>
  );
};
export default WhyChooseSection;
