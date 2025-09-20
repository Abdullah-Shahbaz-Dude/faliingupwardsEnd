import { useState } from "react";
import { empowermentData } from "@/data/digital-evolution";
import Image from "next/image";
import { IMAGE_PATHS } from "@/config/images";

const EmpowermentSection = () => {
  const [hasImageError, setHasImageError] = useState(false);
  const { title, description, caption, imageSrc, imageAlt } = empowermentData;
  return (
    <section
      className="bg-gray-100 p-8 md:p-12 lg:p-16 font-sans"
      aria-labelledby="empowerment-heading"
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
        <div className="md:col-span-1">
          <h1
            id="empowerment-heading"
            className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0B4073] mb-4 md:mb-6 leading-tight"
          >
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="md:col-span-1 flex flex-col items-center md:items-start">
          <Image
            src={hasImageError ? IMAGE_PATHS.fallback : imageSrc}
            alt={imageAlt}
            width={640}
            height={360}
            priority={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            className="rounded-lg shadow-md w-full h-auto object-cover mb-4 md:mb-6 max-w-lg"
            onError={() => setHasImageError(true)}
            style={{ aspectRatio: "16/9" }}
          />
          <p className="text-base text-gray-600 text-center md:text-left max-w-lg">
            {caption}
          </p>
        </div>
      </div>
    </section>
  );
};
export default EmpowermentSection;
