import { useState } from "react";
import { IMAGE_PATHS } from "@/config/images";
import { howWeHelpData } from "@/data/digital-evolution";
import { digitalEvolutionImgs } from "@/lib/frontend/images";
import OptimizedImage from "@/components/ui/OptimizedImage";

const HowWeHelpSection = () => {
  const { howWeHelp } = digitalEvolutionImgs;
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <div className="w-full bg-[#6A90B5] py-20 mt-20  min-h-[0px] flex items-center">
      <div className="max-w-screen-xl mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-center md:justify-between gap-12 rounded-md">
        {/* Left: Image */}
        <div className="w-full md:w-1/2 px-4 md:px-0">
          <OptimizedImage
            src={hasImageError ? IMAGE_PATHS.fallback : howWeHelp}
            alt={howWeHelpData.imageAlt}
            sizes="(max-width: 768px) 100vw, 50vw"
            width={600}
            height={450}
            priority={false} // Not above the fold
            onError={() => setHasImageError(true)}
            className="rounded-lg shadow-md w-full object-cover h-full max-h-[450px]"
            objectFit="cover"
          />
        </div>

        {/* Right: Text */}
        <div className="w-full md:w-1/2 text-white text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {howWeHelpData.title}
          </h2>
          <p className="text-lg md:text-xl leading-relaxed">
            {howWeHelpData.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HowWeHelpSection;
