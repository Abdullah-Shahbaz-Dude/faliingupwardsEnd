import executiveMentoring from "@/assets/home/services/executive-mentoring.webp";
import digitalEvolution from "@/assets/home/services/digital-evolution.webp";
import psychologicalTherapy from "@/assets/home/services/psychological-therapy.webp";
import adhdCoaching from "@/assets/home/services/adhd-coaching.webp";

// Extracted from your existing code - preserving exact text and spellings
export const offersData = [
  {
    id: "digital-evolution",
    title: "Digital Evolution and AI Adoption",
    description:
      "We help organisations navigate the complex landscape of digital transformation and AI integration, ensuring technology serves human needs and enhances wellbeing rather than creating additional stress.",
    image: digitalEvolution,
    benefits: [
      "Human-centered digital transformation strategies",
      "Ethical AI implementation and governance",
      "Managing digital change with psychological insights",
      "Building digital resilience in teams and leadership",
      "Reducing technology-related stress and burnout",
    ],
    link: "/our-services/digital-evolution",
  },
  {
    id: "executive-mentoring",
    title: "Executive Mentoring & Boardroom Support",
    description:
      "We provide specialised mentoring and support for executives and board members, helping them navigate complex leadership challenges with psychological insights and evidence-based approaches.",
    image: executiveMentoring,
    benefits: [
      "One-to-one executive mentoring",
      "Board development and effectiveness",
      "Leadership team dynamics and conflict resolution",
      "Strategic decision-making with psychological awareness",
      "Building psychological safety in leadership teams",
    ],
    link: "/our-services/executive-mentoring",
  },
  {
    id: "psychological-therapy",
    title: "Psychological Therapy & ADHD Coaching",
    description:
      "Our psychological therapy services provide a safe, confidential space for individuals to explore challenges, process difficult experiences, and develop strategies for positive change and growth.",
    image: psychologicalTherapy,
    benefits: [
      "Evidence-based therapeutic approaches",
      "Trauma-informed care",
      "Support for anxiety, stress, and depression",
      "Relationship and interpersonal challenges",
      "Life transitions and identity exploration",
    ],
    link: "/our-services/psychological-therapy",
  },
  {
    id: "neurodiversity",
    title: "Different Thinking For Different Thinkers",
    description:
      "Our specialised ADHD coaching services help individuals harness their unique cognitive style, develop effective strategies, and thrive in both personal and professional environments.",
    image: adhdCoaching,
    benefits: [
      "Personalised strategies for executive functioning",
      "Work and study environment optimisation",
      "Harnessing ADHD strengths and managing challenges",
      "Building sustainable routines and habits",
      "Developing self-advocacy skills",
    ],
    link: "/our-services/thinking-different",
  },
];

// Services section data - preserving exact titles and text
export const servicesSectionData = [
  {
    href: "/our-services/digital-evolution",
    image: digitalEvolution,
    alt: "Digital evolution and AI adoption",
    title: "Digital Evolution & AI Adoption"
  },
  {
    href: "/our-services/psychological-therapy",
    image: psychologicalTherapy,
    alt: "Executive Mentoring & Boardroom Support",
    title: "Psychological Therapy & ADHD Coaching"
  },
  {
    href: "/our-services/executive-mentoring",
    image: executiveMentoring,
    alt: "Executive Mentoring & Boardroom Support",
    title: "Executive Mentoring & Board Room Support"
  },
  {
    href: "/our-services/thinking-different",
    image: adhdCoaching,
    alt: "neurodiversity",
    title: "Different Thinking For Different Thinkers "
  }
];
