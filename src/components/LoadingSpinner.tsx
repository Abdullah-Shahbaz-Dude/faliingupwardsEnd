"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { IMAGE_PATHS } from "@/config/images";

export function LoadingSpinner() {
  // Use state to track if we're on the client side
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set mounted state to true when component mounts on client
    setIsMounted(true);

    // Hide the spinner after content is loaded
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1500); // Adjust timing as needed

    return () => clearTimeout(timer);
  }, []);

  // Don't render anything during server-side rendering or if not visible
  // This prevents hydration mismatch
  if (!isMounted || !isVisible) return null;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#D6E2EA]/30 z-50">
      <div className="relative mb-8">
        {/* Logo with pulsing effect */}
        <div className="relative flex items-center justify-center">
          {/* Animated rings - positioned first in the DOM but visually behind due to z-index */}
          <motion.div
            className="absolute w-[120px] h-[120px] border-2 border-[#0B4073]/30 rounded-full z-0"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            className="absolute w-[140px] h-[140px] border-2 border-[#7094B7]/20 rounded-full z-0"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />

          <motion.div
            className="absolute w-[160px] h-[160px] border-2 border-[#D6E2EA]/40 rounded-full z-0"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />

          {/* Logo on top of rings */}
          <Image
            src={IMAGE_PATHS.favicon}
            alt="Falling Upward Logo"
            width={130}
            height={130}
            className="relative z-10 w-[130px] sm:w-[100px]"
          />
        </div>
      </div>

      {/* Animated dots */}
      <div className="flex items-center space-x-2 mt-4">
        <motion.div
          className="w-2 h-2 bg-[#0B4073] rounded-full"
          animate={{ y: ["-50%", "50%", "-50%"] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="w-2 h-2 bg-[#7094B7] rounded-full"
          animate={{ y: ["-50%", "50%", "-50%"] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.2,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-[#7094B7] rounded-full"
          animate={{ y: ["-50%", "50%", "-50%"] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />
        <motion.div
          className="w-2 h-2 bg-[#0B4073] rounded-full"
          animate={{ y: ["-50%", "50%", "-50%"] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />
      </div>

      {/* Loading text */}
      <motion.div
        className="text-[#0B4073] font-medium mt-6 tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        FALLING UPWARDS
      </motion.div>
    </div>
  );
}
