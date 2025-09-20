import { digitalEvolutionData, Section } from "@/data/digital-evolution";
import Image from "next/image";
import { useState } from "react";
import { IMAGE_PATHS } from "@/config/images";

const { sections } = digitalEvolutionData as { sections: Section[] };

const ApproachSection = () => {
  const [hasImageError] = useState<{
    [key: number]: boolean;
  }>({});

  return (
    <div
      className="bg-gray-100 min-h-screen  p-6 pt-0 md:p-12 font-sans "
      role="region"
      aria-label="Approach Section"
    >
      <div className="max-w-6xl mx-auto pb-16">
        <h1
          aria-label="Our Approach to Psychology-Driven Digital Evolution"
          className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#0B4073] leading-snug mb-8 md:mb-12 text-left pt-16"
        >
          Our Approach: <br />
          Psychology-Driven Digital Evolution
        </h1>

        <div className="space-y-10 md:space-y-16">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`flex flex-col ${section.imageLeft ? "md:flex-row" : "md:flex-row-reverse"} gap-6 md:gap-10 items-center`}
            >
              <div className="w-full md:w-1/2 flex-shrink-0">
                <Image
                  src={
                    hasImageError[index]
                      ? IMAGE_PATHS.fallback
                      : section.imageSrc
                  }
                  alt={section.imageAlt}
                  width={600}
                  height={350}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                  className="rounded-lg shadow-md object-cover w-full h-auto max-h-[350px]"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h2 className="text-xl md:text-2xl font-semibold text-[#0B4073] mb-3">
                  {section.title}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  <span className="mr-2 text-blue-900 font-semibold">↳</span>
                  {section.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ApproachSection;
