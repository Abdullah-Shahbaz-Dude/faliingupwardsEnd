import { IMAGE_PATHS } from "@/config/images";
import Image from "next/image";
import whyExistsImage from "@/assets/home/dji_0355.webp";

const WhyExistsSection = () => {
  return (
    <section className="relative py-24 bg-gradient-to-br from-[#EFF6FB] via-[#F7FAFC] to-white overflow-hidden">
      <div className="container mx-auto px-6 sm:px-10 lg:px-20">
        {/* Title + Subtitle */}
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl sm:text-6xl font-bold text-[#0B4073] leading-tight mb-6">
            Why Falling Upwards Exists
          </h2>
        </div>

        {/* First paragraph */}
        <div className="max-w-3xl mx-auto text-center px-4 mb-10">
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-500">
            <p className="text-lg sm:text-xl text-gray-800 leading-relaxed">
              <span>Falling Upwards</span> exists to help individuals and
              organisations define a vision and direction shaped by who they
              truly are and what they value. The only certainty in life is that
              we move forwards. If we're lucky, we have around
              <span> 3 billion seconds</span> on this earth to make that journey
              count.
            </p>
          </div>
        </div>

        {/* Full Width Image Strip */}
        <div className="w-full my-12">
          <div
            className="rounded-xl overflow-hidden shadow-lg"
            style={{ height: "300px" }}
          >
            {/* Adjust height as needed */}
            <Image
              src={whyExistsImage}
              alt="Falling Upwards"
              width={1920} // Larger width for full-width display
              height={300} // Matches the container height
              className="object-cover w-full h-full"
              priority={false}
              quality={85}
              sizes="(max-width: 768px) 100vw, 1920px"
            />
          </div>
        </div>
        {/* Dual Cards */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mt-10">
          {/* Individual */}
          <div className="group bg-white p-10 md:p-12 rounded-3xl shadow-md border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#0B4073] text-white p-4 rounded-full text-2xl group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={IMAGE_PATHS.favicon}
                  alt="icon"
                  width={24}
                  height={24}
                  className="h-6 w-6 group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#0B4073]">
                For Individuals
              </h3>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              We aspire that you don't just wake up to repeat yesterday, or live
              a life built around who others want you to be but instead live
              each day with a sense of momentum, clarity, and connection.
            </p>
          </div>

          {/* Organisation */}
          <div className="group bg-white p-10 md:p-12 rounded-3xl shadow-md border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-[#0B4073] text-white p-4 rounded-full text-2xl group-hover:scale-110 transition-transform duration-300">
                <Image
                  src={IMAGE_PATHS.favicon}
                  alt="icon"
                  width={24}
                  height={24}
                  className="h-6 w-6 group-hover:scale-110 transition-transform"
                />
              </div>
              <h3 className="text-2xl font-bold text-[#0B4073]">
                For Organisations
              </h3>
            </div>
            <p className="text-gray-700 text-lg leading-relaxed">
              We help navigate change in a human-centred way. Using psychology,
              we aim to build meaningful connection between people and
              technology, creating a relationship with AI and automation that
              feels collaborative, not imposed, and works for everyone.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
export default WhyExistsSection;
