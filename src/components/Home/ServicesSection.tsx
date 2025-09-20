// import Link from "next/link";
// import { memo } from "react";
// import OptimizedImage from "@/components/ui/OptimizedImage";
// import { servicesSectionData } from "@/data/services";

// const ServicesSection = memo(() => {
//   return (
//     <section className="section bg-white relative overflow-hidden py-20 px-10 border-t border-b border-[#D6E2EA]/30">
//       <div className="container-custom mx-auto relative z-10 px-6">
//         {/* Section Title */}
//         <div className="text-center mb-14">
//           <h2 className="text-4xl sm:text-5xl font-bold text-[#0B4073]">
//             What we offer?
//           </h2>
//         </div>

//         {/* Service Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           {servicesSectionData.map((service, index) => (
//             <div 
//               key={service.href}
//               className="flex flex-col items-center bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
//             >
//               <Link
//                 href={service.href}
//                 className="group w-full"
//               >
//                 <div className="w-full aspect-square relative overflow-hidden">
//                   <OptimizedImage
//                     src={service.image}
//                     alt={service.alt}
//                     width={300}
//                     height={300}
//                     className="w-full h-full group-hover:scale-110 transition-transform duration-500"
//                     priority={index === 0} // First image gets priority loading
//                     sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//                     objectFit="cover"
//                   />
//                 </div>
//                 <div className="p-6 bg-white">
//                   <h3 className="text-center font-medium text-gray-800 text-lg">
//                     {service.title}
//                   </h3>
//                 </div>
//               </Link>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// });

// ServicesSection.displayName = 'ServicesSection';

// export default ServicesSection;
import Link from "next/link";
import { memo } from "react";
import OptimizedImage from "@/components/ui/OptimizedImage";
import { servicesSectionData } from "@/data/services";

const ServicesSection = memo(() => {
  return (
    <section className="section bg-white relative overflow-hidden py-20 px-10 border-t border-b border-[#D6E2EA]/30">
      <div className="container-custom mx-auto relative z-10 px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-bold text-[#0B4073]">
            What we offer?
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesSectionData.map((service, index) => (
            <div
              key={service.href}
              className="flex flex-col items-center bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl"
            >
              <Link href={service.href} className="group w-full">
                <div className="w-full aspect-square relative overflow-hidden">
                  <OptimizedImage
                    src={service.image}
                    alt={service.alt}
                    width={300}
                    height={300}
                    className={`w-full h-full transition-transform duration-500 ${
                      index === 2
                        ? "scale-[2] group-hover:scale-[2.2]"
                        : "group-hover:scale-110"
                    }`}
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    objectFit="cover"
                  />
                </div>
                <div className="p-6 bg-white">
                  <h3 className="text-center font-medium text-gray-800 text-lg">
                    {service.title}
                  </h3>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ServicesSection.displayName = "ServicesSection";

export default ServicesSection;