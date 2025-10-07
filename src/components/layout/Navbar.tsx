"use client";

import { useState, useEffect, useRef } from "react";
import { NavLink } from "@/lib/types/nav";
import { navLinks } from "@/data/navLinks";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { debounce } from "@/utils/debounce";
import { LOGO } from "@/config/images";

const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);

export function Navbar() {
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const offersRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = debounce(() => {
      const heroElement = document.querySelector("section.hero") as HTMLElement;
      const heroHeight =
        heroElement?.getBoundingClientRect().height || window.innerHeight;
      setIsHeroVisible(window.scrollY <= heroHeight - 50);
      setIsScrolled(window.scrollY > heroHeight - 50);
    }, 100);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        offersRef.current &&
        !offersRef.current.contains(event.target as Node)
      ) {
        setIsOffersOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    if (!isTouchDevice) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (!isTouchDevice) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
    };
  }, [pathname, isTouchDevice]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md py-3 md:py-4 lg:py-6"
          : "bg-transparent py-4 md:py-6 lg:py-8"
      } ${isHeroVisible && !isScrolled ? "absolute top-0" : "fixed top-0"}`}
      role="banner"
    >
      <div className=" w-full max-w-8xl  sm:px-6 lg:px-8 navbar-container">
        <div className="flex justify-between items-center navbar-container-inner pr-10 ">
          <div className="flex items-start pl-0 ml-10 max-sm:-ml-2 max-md:-ml-2 max-lg:ml-12 max-xl:-ml-2">
            <Link
              href="/"
              className="flex items-start p-0"
              onClick={closeMenu}
              aria-label="Falling Upward Home"
            >
              <div
                className={`relative w-[140px] transition-all ${
                  isScrolled ? "h-12 sm:h-14 md:h-16 lg:h-20" : "h-20 sm:h-24 md:h-28 lg:h-32"
                }`}
              >
                <Image
                  src={LOGO}
                  alt="Falling Upward Logo"
                  fill
                  className="object-contain left-1"
                  priority
                  onError={() => console.error("Logo failed to load")}
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden md:flex items-center mt-3 space-x-4 lg:space-x-8 navbar-nav pr-10 font-medium md:text-lg lg:text-lg xl:text-xl "
            role="navigation"
            aria-label="Main navigation"
          >
            {navLinks.map((link: NavLink) =>
              link.hasDropdown ? (
                <div
                  key={link.name}
                  className="relative"
                  ref={offersRef}
                  onMouseEnter={() => setIsOffersOpen(true)}
                  onMouseLeave={() => setIsOffersOpen(false)}
                  role="button"
                >
                  <div
                    className={`flex items-center cursor-pointer font-medium transition-colors ${
                      isActive(link.href) || pathname.includes(link.href)
                        ? isScrolled
                          ? "text-[#0B4073] border-b-2 border-[#7094B7]"
                          : "text-[#D6E2EA] border-b-2 border-[#D6E2EA]"
                        : isScrolled
                          ? "text-gray-700 hover:text-[#0B4073]"
                          : "text-white hover:text-[#D6E2EA]"
                    }`}
                  >
                    {link.name}
                    <FiChevronDown
                      className={`ml-1 transition-transform duration-300 ${
                        isOffersOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  <AnimatePresence>
                    {isOffersOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-72 bg-white rounded-lg shadow-xl py-3 z-50 overflow-hidden"
                        role="menu"
                      >
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#0B4073] to-[#7094B7]"></div>

                        {link.dropdownItems?.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="group flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => setIsOffersOpen(false)}
                            role="menuitem"
                          >
                            <div>
                              <span className="font-medium group-hover:text-[#0B4073] transition-colors">
                                {item.name}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    isActive(link.href)
                      ? isScrolled
                        ? "text-[#0B4073] border-b-2 border-[#7094B7]"
                        : "text-[#D6E2EA] border-b-2 border-[#D6E2EA]"
                      : isScrolled
                        ? "text-gray-700 hover:text-[#0B4073]"
                        : "text-white hover:text-[#D6E2EA]"
                  }`}
                >
                  {link.name}
                </Link>
              )
            )}

            <Link
              href="/book"
              className={`${
                isScrolled
                  ? "bg-[#7094B7] hover:bg-[#0B4073] text-white"
                  : "border border-white text-white hover:bg-white/10"
              } py-2 px-4 rounded-md transition-colors mr-4 font-medium`}
            >
              Book a Consultation
            </Link>
            <Link
              href="/login"
              className={`${
                isScrolled
                  ? "bg-[#0B4073] hover:bg-[#083258] text-white"
                  : "border border-white text-white hover:bg-white/10"
              } py-2 px-4 rounded-md transition-colors font-medium`}
            >
              Login
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden focus:outline-none flex items-center h-full mt-2 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 bg-white shadow-xl md:hidden z-50 overflow-hidden"
            role="menu"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col px-4 py-3 space-y-3">
              {navLinks.map((link) =>
                link.hasDropdown ? (
                  <div key={link.name} className="flex flex-col pl-0">
                    <button
                      onClick={() => setIsOffersOpen(!isOffersOpen)}
                      className="flex items-center justify-between text-left font-medium text-gray-800 hover:text-[#0B4073] transition-colors py-2"
                      aria-expanded={isOffersOpen}
                      aria-controls="services-menu"
                    >
                      {link.name}
                      <FiChevronDown
                        className={`ml-1 transition-transform duration-300 ${
                          isOffersOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOffersOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="pl-0 mb-2 flex flex-col space-y-2 overflow-hidden"
                          role="menu"
                          id="services-menu"
                        >
                          {link.dropdownItems?.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className="text-gray-600 hover:text-[#0B4073] transition-colors py-2 pl-4 border-l-2 border-gray-200"
                              onClick={closeMenu}
                              role="menuitem"
                            >
                              {item.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="font-medium text-gray-800 hover:text-[#0B4073] transition-colors py-2"
                    onClick={closeMenu}
                    role="menuitem"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <div className="pt-2 space-y-3">
                <Link
                  href="/book"
                  className="block w-full bg-[#7094B7] hover:bg-[#0B4073] text-white py-3 px-4 rounded-md transition-colors font-medium text-center"
                  onClick={closeMenu}
                  role="menuitem"
                >
                  Book a Consultation
                </Link>
                <Link
                  href="/login"
                  className="block w-full bg-[#0B4073] hover:bg-[#083258] text-white py-3 px-4 rounded-md transition-colors font-medium text-center"
                  onClick={closeMenu}
                  role="menuitem"
                >
                  Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
