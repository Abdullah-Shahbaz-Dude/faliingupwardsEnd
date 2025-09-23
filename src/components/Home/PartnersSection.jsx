"use client";

import LogoSlider from "./LogoSlider";

const PartnersSection = () => {
  return (
    <section className="section bg-[#F0F5F8] py-24 md:py-32">
      <div className="container-custom mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-6xl font-bold mb-6 text-[#0B4073]">
            Who we have worked with
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-[#0B4073] to-[#7094B7] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 md:p-12 max-w-7xl mx-auto">
          <LogoSlider />
        </div>
      </div>
    </section>
  );
};
export default PartnersSection;
