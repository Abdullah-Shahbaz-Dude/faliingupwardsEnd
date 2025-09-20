import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

const Breadcrumb = () => {
  return (
    <section className="relative pt-0 py-20 bg-gradient-to-br from-[#EFF6FB] pb-0  via-[#F7FAFC] to-white overflow-hidden">
      <div className="container-custom mx-auto pt-16">
        {/* Breadcrumb */}
        <div className="mb-8 px-10">
          <Link
            href="/our-services"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Our Services
          </Link>
        </div>
      </div>
    </section>
  );
};
export default Breadcrumb;
