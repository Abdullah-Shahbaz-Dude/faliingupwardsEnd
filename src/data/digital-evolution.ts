import { digitalEvolutionImgs } from "@/lib/frontend/images";
import { StaticImageData } from "next/image";
const { approach1, approach2, approach3, empowerment, howWeHelp } =
  digitalEvolutionImgs;

export interface AccordionItem {
  title: string;
  content: string;
}

export interface Section {
  imageSrc: StaticImageData;
  imageAlt: string;
  title: string;
  description: string;
  imageLeft: boolean;
}

interface EmpowermentData {
  title: string;
  description: string;
  caption: string;
  imageSrc: StaticImageData;
  imageAlt: string;
}

export interface HowWeHelpData {
  title: string;
  description: string;
  imageSrc: StaticImageData;
  imageAlt: string;
}

export const digitalEvolutionData = {
  accordionItems: [
    {
      title: "Bottom-Up Change That Works",
      content:
        "Digital transformation isn't just about software, it's about people. We engage employees from the start, ensuring AI adoption is driven by real needs rather than imposed solutions.",
    },
    {
      title: "Workforce-Led Digital Maturity Audits Before implementing AI",
      content:
        "We assess existing workflows, data use, and employee attitudes to identify practical opportunities for human-centric AI integration.",
    },
    {
      title: "Psychological Insights & Thematic Analysis",
      content:
        "We engage employees at all levels, uncovering key resistance points and opportunities for cultural change. Our reports translate workforce insights into actionable AI adoption strategies.",
    },
    {
      title: "Bespoke AI Implementation Roadmaps",
      content:
        " Rather than prescribing generic AI solutions, we develop tailored roadmaps that align technology with workforce needs, business goals, and long-term sustainability.",
    },
    {
      title: "Strategic Change Management & Training",
      content:
        "We design bespoke training and support plans that help employees transition smoothly into AI-enhanced ways of working, building trust, competence, and digital confidence.",
    },
  ],

  sections: [
    {
      imageSrc: approach1, // Replace with your actual image path
      imageAlt: "Hands typing on a laptop with AI interface overlay",
      title: "Human-Centred AI Adoption",
      description:
        "AI should enhance work, not replace people. We align AI solutions with human psychology, ensuring teams feel empowered rather than displaced.",
      imageLeft: true,
    },
    {
      imageSrc: approach2,
      imageAlt: "Business meeting with a model house",
      title: "Overcoming Digital Resistance",
      description:
        "Change often triggers fear and uncertainty. We apply organisational psychology to help employees move past resistance, fostering confidence, curiosity, and digital competence.",
      imageLeft: false, // Image will be on the right
    },
    {
      imageSrc: approach3,
      imageAlt: "Piggy bank under an umbrella protecting coins",
      title: "Building Psychological Safety in Tech Adoption",
      description:
        "For AI adoption to succeed, people must feel safe to learn and experiment. We help organisations create a culture of trust, where AI becomes a tool for growth, not job loss.",
      imageLeft: true,
    },
  ],
};

export const empowermentData: EmpowermentData = {
  title: "Turning AI Into a Tool for Empowerment, Not Displacement",
  description:
    "By focusing on human behaviour, cognition, and trust, we bridge the gap between technological advancements and real-world usability.",
  caption:
    "If you want to introduce AI without resistance, fear, or disengagement, we can help you get it right from the start.",
  imageSrc: empowerment,
  imageAlt: "Aerial view of forest meeting a coastline",
};

export const challenges = [
  {
    id: 1,
    text: "Do you want to develop AI solutions but 	struggle to know where to start?",
  },
  {
    id: 2,
    text: "Have you invested in AI or digital technology, only to find it remains unused by staff?",
  },
  {
    id: 3,
    text: "Are you collecting vast amounts of data but unsure if you're leveraging 	it effectively?",
  },
  {
    id: 4,
    text: "Do 	your employees see AI as a threat rather than a tool for 	empowerment?",
  },
  {
    id: 5,
    text: "Are 	frontline staff disengaged because they feel technology is being 	imposed rather than designed with them in mind?",
  },
  {
    id: 6,
    text: "Have 	previous digital transformation projects failed due to a lack of 	workforce buy in?",
  },
  {
    id: 7,
    text: "Are 	you looking for an approach that works with human behaviour rather 	than against it?",
  },
];

export const howWeHelpData: HowWeHelpData = {
  title: "How We Help?",
  description:
    "Too often, digital transformation is approached as a technical challenge when, in reality, it's a psychological one. AI initiatives fail not because the technology is flawed, but because the human foundation isn't solid.\n\nAt Falling Upwards, we don't believe in digital transformation we believe in digital evolution. Transformation suggests disruption;evolution is about building sustainable, people-centred change from the ground up. Our psychology-driven approach ensures AI and digital adoption feel like a natural progression, not an imposed upheaval..",
  imageSrc: howWeHelp,
  imageAlt: "Team discussing digital evolution strategies",
};
