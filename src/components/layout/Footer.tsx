"use client";

import Link from "next/link";
import Image from "next/image";
import { LOGO, BACP_LOGO } from "@/config/images";

function LogoSection() {
  return (
    <div className="mb-4">
      <Image
        src={LOGO}
        alt="Falling Upward Organizational Consulting Logo"
        width={130}
        height={130}
        className="border border-gray-200 p-2 w-[130px] sm:w-[100px]"
        loading="lazy"
      />
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-primary">Alexander Church</h3>
      <p className="text-primary">
        Organisational & Business Consultant, Psychological therapist & ADHD
        Coach
      </p>
      <div className="flex items-center text-primary">
        <span className="mr-1">E:</span>
        <a
          aria-label="Email Alexander Church"
          href="mailto:alex@fallingupwards.co.uk"
          className="text-primary hover:underline"
        >
          alex@fallingupwards.co.uk
        </a>
      </div>
      <div className="flex items-center text-primary">
        <span className="mr-1">M:</span>
        <a
          href="tel:07725780382"
          className="hover:underline"
          aria-label="Call Alexander Church"
          lang="en-GB"
        >
          07725780382
        </a>
      </div>
      <div className="flex items-center text-primary">
        <a
          href="https://www.fallingupwards.co.uk"
          className="hover:underline"
          aria-label="Visit Falling Upward website"
        >
          www.fallingupwards.co.uk
        </a>
      </div>
    </div>
  );
}

function CopyrightBar() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-primary py-3 px-10">
      <div className="container-custom mx-auto flex flex-col md:flex-row justify-between items-center text-white text-sm">
        <div>
          <p>
            Copyright {currentYear} Fallingupward. All rights reserved.
            Powered by FALLINGUPWARD
          </p>
        </div>
        <div className="flex space-x-6 mt-2 md:mt-0">
          <Link
            href="/policies/terms-of-service"
            className="hover:underline focus:ring-2 focus:ring-white focus:outline-none"
          >
            Terms of Services
          </Link>
          <Link
            href="/policies/privacy-policy"
            className="hover:underline focus:ring-2 focus:ring-white focus:outline-none"
          >
            Privacy Policy
          </Link>
          <Link
            href="/policies/cookie-policy"
            className="hover:underline focus:ring-2 focus:ring-white focus:outline-none"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="bg-[#E2E6EB] text-gray-800 " role="contentinfo">
      {/* Main Footer Content */}
      <div className="container-custom mx-auto py-8 px-10">
        <div className="flex flex-col mb-8">
          {/* Logo and Contact Info */}
          <div className="flex flex-col items-start mb-6">
            <h2 className="sr-only">Contact Information</h2>
            <LogoSection />
            <ContactInfo />
          </div>

          {/* Certification Images */}
          <div className="flex flex-row items-center space-x-4 sm:space-x-6 mt-4">
            <Image
              src={BACP_LOGO}
              alt="BACP Certification"
              width={150}
              height={100}
              className="object-contain w-[150px] sm:w-[100px]"
              loading="lazy"
            />
          </div>
        </div>
      </div>
      <CopyrightBar />
    </footer>
  );
}
