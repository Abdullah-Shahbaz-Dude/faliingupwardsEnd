import { IMAGE_PATHS } from "@/config/images";
import { executiveMentoringImgs } from "@/lib/frontend/images";
const { appointmentsImgs, offersImgs } = executiveMentoringImgs;
import { StaticImageData } from "next/image";

interface ApproachSection {
  title: string;
  icon: string;
  description: string | string[];
  reversed: boolean;
  img: StaticImageData;
}
export interface Offer {
  title: string;
  description: string;
  image: StaticImageData;
  bg: string;
}

export interface Offering {
  title: string;
  description: string;
  bgColor: string;
}

export interface Challenges {
  individuals: string[];
  boardroom: string[];
}

const approachSections: ApproachSection[] = [
  {
    title: "Bias & Decision-Making",
    icon: IMAGE_PATHS.favicon,

    description: [
      "Boards function best when open 	dialogue and constructive challenge are embedded into 	decision-making. We help leadership teams create a psychologically 	safe environment, ensuring that all perspectives are heard.",
    ],
    reversed: true,
    img: appointmentsImgs.appointment1,
  },
  {
    title: "Personality & Leadership Profiling",
    icon: IMAGE_PATHS.favicon,
    description:
      "Cognitive biases can silence 	innovation, reinforce outdated strategies, and limit organisational 	growth. We equip boards with tools to identify and mitigate 	unconscious bias, leading to more balanced, inclusive, and effective 	strategic choices.",
    reversed: false,
    img: appointmentsImgs.appointment2,
  },
  {
    title: "Bridging Leadership & Workforce Engagement",
    icon: IMAGE_PATHS.favicon,

    description: [
      "Understanding individual 	personality traits, cognitive styles, and leadership tendencies is 	essential for building high-functioning boards. We use validated 	psychological profiling tools to help leaders:",
      "Identify 	their own leadership styles and how they interact with others.",
      "Enhance 	communication, collaboration, and decision-making within the board.",
      "Build 	a balanced, complementary leadership team that plays to individual 	strengths.",
    ],
    reversed: true,
    img: appointmentsImgs.appointment3,
  },
  {
    title: "Board-Level Culture Audits",
    icon: IMAGE_PATHS.favicon,
    description:
      "Boards set the direction, but real change happens when leaders and employees move forward together. We help leadership teams align strategy with workforce psychology, ensuring that boardroom decisions resonate across all levels of the organisation.",
    reversed: false,
    img: appointmentsImgs.appointment4,
  },
];

const offers: Offer[] = [
  {
    title: "Psychology-informed thinking",
    description: `Grounded in organisational and behavioural psychology, we help you
    understand how your habits, thought patterns, and inner narratives
    influence your decision making and leadership.Using first principles
    thinking we strip away assumptions and offer solutions for any
    challenges you face.`,
    image: offersImgs.offer1,
    bg: "bg-indigo-100",
  },
  {
    title: "Therapeutic insight",
    description: `Therapeutic insight - sometimes, what blocks success isn't about skills or strategy. If needed, we integrate therapeutic support to address underlying barriers such burnout, rejection sensitivity, fear of failure, imposter syndrome, or past trauma that might be holding you back.`,
    image: offersImgs.offer2,
    bg: "bg-indigo-50",
  },
  {
    title: "System-aware mentoring",
    description: `We understand the complexities of systems, whether you're scaling a business, leading change, or juggling uncertainty. Our support meets you where you are.`,
    image: offersImgs.offer3,
    bg: "bg-indigo-100",
  },
];

const offerings: Offering[] = [
  {
    title: "Executives and Senior Leaders",
    description:
      "Executives and Senior Leaders wanting space to reflect and refine their leadership style.",
    bgColor: "bg-blue-50",
  },
  {
    title: "Founders & Entrepreneurs",
    description:
      "Founders & Entrepreneurs navigating growth, funding pressures, or team dynamics.",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Managers stepping into bigger roles",
    description:
      "Managers 	stepping into bigger roles who 	want to lead with clarity and emotional intelligence.",
    bgColor: "bg-purple-50",
  },
  {
    title: "Professionals feeling stuck",
    description:
      "Professionals 	feeling stuck in 	high-functioning roles but not thriving beneath the surface.",
    bgColor: "bg-teal-50",
  },
];
export { approachSections, offers, offerings };

export const challenges: Challenges = {
  individuals: [
    "Do you feel like your career or business vision has become unclear, and you need to reconnect with purpose?",
    "Are you feeling stuck, 	unmotivated or burnt out—despite 	being in a role you once wanted?",
    "Do 	you struggle to switch off, 	always carrying the weight of work?",
    "Are you experiencing imposter syndrome, perfectionism, or fear of failure that's hard to shake?",
    "Are you successful on paper but still feeling unfulfilled, overwhelmed, or lost?",
    "Do you find yourself emotionally triggered, reactive, or disconnected in your leadership role?",
    "Are you navigating team conflict, people-pleasing, or boundary issues in the workplace?",
    "Are you avoiding difficult decisions, conversations, or growth opportunities because of inner blocks?",
    'Do you want to lead with more confidence, clarity, and authenticity—without the pressure to "perform"?',
  ],
  boardroom: [
    "Are your board meetings 	dominated by a few voices, leaving others hesitant to speak up?",
    "Do unconscious biases impact decision-making, leading to missed opportunities or unseen risks?",
    "Are 	strategic discussions based on assumptions rather than data-driven 	behavioural insights?",
    "Do 	you want to create a culture where challenge and constructive 	dissent are encouraged rather than avoided?",
    "Does 	your leadership team struggle to balance long-term vision with the 	psychological realities of workforce engagement?",
    "Are 	board-level decisions disconnected from how change is experienced on 	the ground?",
    "Do 	you want to harness individual strengths within your leadership team 	to improve performance and decision-making?",
  ],
};
