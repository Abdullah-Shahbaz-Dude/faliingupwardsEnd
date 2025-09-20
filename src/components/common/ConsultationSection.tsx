import Image from "next/image";
import { FiArrowRight } from "react-icons/fi";
import Link from "next/link";
import { backgroundImages, team } from "@/lib/frontend/images";

const ConsultationSection = () => {
  return (
    <section className="relative py-20 md:py-24 px-10">
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImages.consultationBg}
          alt="Consultation Background"
          fill
          className="object-cover brightness-[0.3]"
          priority
        />
      </div>

      <div className="flex flex-col md:flex-row items-center container-custom mx-auto relative z-10 px-4 md:px-0">
        {/* Left Side (Text) */}
        <div className="w-full md:flex-1 text-center md:text-left mb-12 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book a Free Consultation
          </h2>
          <p className="text-lg text-white opacity-80 max-w-2xl mx-auto md:mx-0">
            Select one of our services to book your free consultation with us.
          </p>
        </div>

        {/* Right Side (Consultation Options) */}
        <div className="w-full md:w-auto flex flex-col space-y-4 md:space-y-6 md:ml-10">
          {[
            { type: "digital", title: "Digital Evolution & AI Adoption" },
            {
              type: "executive",
              title: "Executive Mentoring & Boardroom Support",
            },
            { type: "psychological", title: "Psychological Therapy" },
            {
              type: "thinking-different",
              title: "Different Thinking For Different Thinkers",
            },
          ].map(({ type, title }) => (
            <Link key={type} href={`/book/${type}`} className="group w-full">
              <div className="bg-[#0B4073]/90 backdrop-blur-sm hover:bg-[#0B4073] text-white rounded-full py-3 md:py-5 px-5 md:px-8 flex items-center justify-between transition-all duration-300 w-full">
                <span className="font-medium text-base md:text-lg">
                  {title}
                </span>
                <div className="bg-[#D6E2EA] rounded-full p-2 md:p-3 ml-2 md:ml-4 flex-shrink-0 text-[#0B4073] group-hover:bg-[#D6E2EA]/90 transition-all">
                  <FiArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ConsultationSection;
