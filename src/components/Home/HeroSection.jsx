import Head from "next/head";
import { useEffect, useState } from "react";
import Image from "next/image";
import { homepageImages } from "@/lib/frontend/images";

const HeroSection = () => {
  const { hero } = homepageImages;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const backgroundImages = [
    hero.heroImg1,
    hero.heroImg2,
    hero.heroImg3,
    hero.heroImg4,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 4000); // Rotate every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Head>
        <title>Falling Upwards - Psychological Therapy & Consultancy</title>
        <meta
          name="description"
          content="Falling Upwards offers psychological therapy, mentoring, coaching, and business consultancy."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Falling Upwards" />
        <meta
          property="og:description"
          content="Discover our services in therapy, mentoring, and AI-driven consultancy."
        />
        <meta property="og:image" content="/images/og-image.jpg" />
      </Head>

      <section className="hero-section relative h-screen min-h-[500px] flex items-center overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`Hero image: Aerial view ${index + 1}`}
              fill
              sizes="100vw"
              className={`object-cover ${
                index === currentImageIndex ? "animate-zoom" : ""
              }`}
              priority={index === 0}
              onError={(e) => (e.currentTarget.src = "/images/fallback.webp")}
            />
          </div>
        ))}

        {/* Overlay with slightly reduced opacity for better text contrast */}
        <div className="absolute inset-0 bg-black opacity-45 z-0"></div>

        {/* Positioned at the left bottom corner with enhanced text styling */}
        <div className="absolute bottom-20 left-[1.5rem] sm:left-[2rem] md:left-[3rem] lg:left-[4rem] z-10 w-[90vw] sm:w-[85vw] md:max-w-2xl px-1 sm:px-2">
          <h1 className="text-4xl sm:text-4xl md:text-7xl lg:text-8xl text-white font-bold tracking-tight leading-tight">
            Falling Upwards
          </h1>
          <p className="text-white/95 text-xl md:text-2xl mt-4 tracking-wide">
            Psychological Therapy, Mentoring, Coaching and Business Consultancy
          </p>
          <div className="mt-6 w-32 h-1 bg-white/50 rounded-full"></div>
        </div>

        {/* Image indicators */}
        <div className="absolute bottom-10 right-0 transform -translate-x-1/2 flex space-x-2 z-20 max-w-full overflow-x-auto pb-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentImageIndex ? "bg-teal-400 w-8" : "bg-white/50"}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
