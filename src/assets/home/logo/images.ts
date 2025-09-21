// lib/images.js

import heroImg1 from "@/assets/home/hero/IMG_7551.webp";
import heroImg2 from "@/assets/home/hero/IMG_7552.webp";
import heroImg3 from "@/assets/home/hero/IMG_7553.jpg";
import heroImg4 from "@/assets/home/hero/IMG_7554.webp";

import whyExistsSection from "@/assets/home/dji_0355.webp";
import whyChooseSection from "@/assets/home/aerial-beach.webp";

import executiveMentoring from "@/assets/home/services/executive-mentoring.webp";
import digitalEvolution from "@/assets/home/services/digital-evolution.webp";
import psychologicalTherapy from "@/assets/home/services/psychological-therapy.webp";
import adhdCoaching from "@/assets/home/services/adhd-coaching.webp";

//logo

import logoOIP from "@/assets/home/logo/OIP.png";
import logoOIP2 from "@/assets/home/logo/OIP-2.png";
import logoOIP3 from "@/assets/home/logo/OIP-3.png";
import logoOIP5 from "@/assets/home/logo/OIP-5.png";
import logoOIP6 from "@/assets/home/logo/OIP-6.png";
import logoOIP7 from "@/assets/home/logo/OIP-7.png";
import logoOIP8 from "@/assets/home/logo/OIP-8.png";
import logoOIP9 from "@/assets/home/logo/OIP-9.png";
import logoDownload from "@/assets/home/logo/download.png";
import logoDownload1 from "@/assets/home/logo/download-1.png";

import bookingConsultation from "@/assets/home/consultation/consultation-bg.jpg";

// TeamMembers

import member1 from "@/assets/meetOurTeam/alex.webp";
import member2 from "@/assets/meetOurTeam/dr.webp";

// services

export const homepageImages = {
  hero: {
    heroImg1,
    heroImg2,
    heroImg3,
    heroImg4,
  },
  sections: {
    whyExistsSection,
    whyChooseSection,
    bookingConsultation,
  },
  logos: [
    [
      { name: "Organization 1", src: logoOIP },
      { name: "Organization 2", src: logoOIP2 },
      { name: "Organization 3", src: logoOIP3 },
      { name: "Organization 5", src: logoOIP5 },
      { name: "Organization 6", src: logoOIP6 },
    ],
    [
      { name: "Organization 7", src: logoOIP7 },
      { name: "Organization 8", src: logoOIP8 },
      { name: "Organization 9", src: logoOIP9 },
      { name: "Organization 10", src: logoDownload },
      { name: "Organization 11", src: logoDownload1 },
    ],

    [
      { name: "Organization 12", src: "/images/logos/download-1-1.png" },
      { name: "Organization 13", src: "/images/logos/download-11.png" },
      {
        name: "Organization 14",
        src: "/images/logos/thumbnail_image001.png",
      },
      { name: "Organization 15", src: "/images/logos/thumbnail_image002.png" },
    ],
  ],
  services: {
    executiveMentoring,
    digitalEvolution,
    psychologicalTherapy,
    adhdCoaching,
  },
};

export const team = {
  member1,
  member2,
};
