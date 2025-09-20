import { useState, useEffect } from "react";
import Image, { StaticImageData } from "next/image";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import logos from "@/data/logos.json";
import { homepageImages } from "@/lib/frontend/images";
import { IMAGE_PATHS } from "@/config/images";

interface Logo {
  name: string;
  src: StaticImageData;
}

function LogoSlider({ logosPerSlide = 5 }: { logosPerSlide?: number }) {
  const { logos } = homepageImages;

  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Validate logos data from JSON
  const validLogosData: Logo[][] = Array.isArray(logos) ? logos : [];
  const totalSlides: number = Math.ceil(
    validLogosData.flat().length / logosPerSlide
  );
  const slides: Logo[][] = Array.from({ length: totalSlides }, (_, i) =>
    validLogosData.flat().slice(i * logosPerSlide, (i + 1) * logosPerSlide)
  );

  // Auto-scrolling with setInterval
  useEffect(() => {
    if (isHovering) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, [isHovering, totalSlides]);

  return (
    <div
      className="relative py-16 md:py-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="relative overflow-hidden rounded-xl">
        <button
          onClick={() =>
            setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
          }
          aria-label="Previous slide"
          aria-controls="logo-slider"
          className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
        >
          <FiChevronLeft className="text-[#6A8EA0] text-3xl" />
        </button>
        <div id="logo-slider" className="w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, groupIndex) => (
              <div key={groupIndex} className="flex-shrink-0 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center px-4 md:px-8">
                  {slide.map((logo, logoIndex) => (
                    <div
                      key={logoIndex}
                      className="flex flex-col justify-center items-center py-6 px-4 transition-all duration-300"
                    >
                      <div className="relative h-28 md:h-36 w-full mb-4 flex items-center justify-center">
                        <Image
                          src={logo.src}
                          alt={logo.name}
                          width={160}
                          height={96}
                          sizes="(max-width: 768px) 100vw, 20vw"
                          className="object-contain max-h-24 max-w-40 transition-all duration-300"
                          priority={groupIndex === 0 && logoIndex === 0}
                          onError={(e) =>
                            (e.currentTarget.src = IMAGE_PATHS.fallback.src)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={() => setCurrentSlide((prev) => (prev + 1) % totalSlides)}
          aria-label="Next slide"
          aria-controls="logo-slider"
          className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-all"
        >
          <FiChevronRight className="text-[#6A8EA0] text-3xl" />
        </button>
      </div>
      <div className="flex justify-center mt-10 space-x-3">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setCurrentSlide(index);
              }
            }}
            className={`w-8 h-8 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-[#6A8EA0]"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="text-white font-medium">{index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LogoSlider;
