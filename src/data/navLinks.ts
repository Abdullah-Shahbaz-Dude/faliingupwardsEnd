import { NavLink } from "@/lib/types/nav";

export const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Meet Our Team", href: "/meet-our-team" },
  {
    name: "Our Services",
    href: "/our-services",
    hasDropdown: true,
    dropdownItems: [
      {
        name: "Digital evolution and AI adoption",
        href: "/our-services/digital-evolution",
      },
      {
        name: "Executive Mentoring & Boardroom Support",
        href: "/our-services/executive-mentoring",
      },
      {
        name: "Psychological Therapy & ADHD Coaching",
        href: "/our-services/psychological-therapy",
      },
      {
        name: "Different Thinking For Different Thinkers",
        href: "/our-services/thinking-different",
      },
    ],
  },
];
