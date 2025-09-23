import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";
import { FiArrowRight } from "react-icons/fi";

import image from "@/assets/shutterstock_2455025455.jpg";

// export async function getStaticProps() {
//   return {
//     props: {}, // No dynamic data needed for static content
//   };
// }

export default function TermsOfServicePage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <HeroSection title="Terms of Service" backgroundImage={image} />

      <div className="container-custom mx-auto py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-10">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0B4073] mb-4">
              1. Introduction
            </h2>
            <p>
              Welcome to Falling Upwards. These Terms of Service govern your use
              of our website, services, and any interactions with our company.
              By accessing or using our services, you agree to be bound by these
              Terms.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              2. Services Description
            </h2>
            <p>
              Falling Upwards provides consulting, coaching, and therapeutic
              services including but not limited to Digital Evolution & AI
              Adoption, Executive Mentoring & Boardroom Support, Psychological
              Therapy, and Neurodiversity services.
            </p>
            <p>
              Our services may include individual or group sessions, workshops,
              trainings, and consultations delivered in person or remotely.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              3. Eligibility
            </h2>
            <p>
              You must be at least 18 years of age or have parental/guardian
              consent to use our services. By accessing or using our services,
              you represent and warrant that you meet these eligibility
              requirements.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              4. Professional Relationship
            </h2>
            <p>
              The relationship between Falling Upwards and its clients is
              professional in nature. Our services do not establish a
              doctor-patient relationship, and coaching/consulting services are
              not a substitute for medical treatment, psychotherapy, or other
              forms of professional or licensed advice.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              5. Booking and Cancellations
            </h2>
            <p>
              Appointments must be booked in advance through our booking system.
              We request a minimum of 24 hours' notice for cancellations or
              rescheduling. Late cancellations or no-shows may be subject to our
              cancellation policy, which may include fees equivalent to the full
              session cost.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              6. Payment Terms
            </h2>
            <p>
              Fees for services are due at the time of booking unless otherwise
              arranged. We accept various payment methods as specified on our
              website. All fees are non-refundable except in cases where
              services cannot be delivered by Falling Upwards.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              7. Confidentiality
            </h2>
            <p>
              We respect the confidentiality of all client communications and
              information. However, there are legal limitations to
              confidentiality, including cases involving risk of harm to self or
              others, suspected abuse of children or vulnerable adults, or when
              required by court order.
            </p>
            <p>
              For therapeutic services, our confidentiality practices comply
              with relevant professional standards and legal requirements.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              8. Intellectual Property
            </h2>
            <p>
              All content, materials, and resources provided as part of our
              services are the intellectual property of Falling Upwards and are
              protected by copyright laws. Materials may not be reproduced,
              distributed, or used for commercial purposes without explicit
              permission.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              9. Limitation of Liability
            </h2>
            <p>
              Falling Upwards provides services on an "as is" basis without
              warranties of any kind. We are not liable for any indirect,
              incidental, special, or consequential damages resulting from the
              use of our services.
            </p>
            <p>
              The maximum liability of Falling Upwards arising from or relating
              to these Terms shall be limited to the amount paid by you for the
              services in question.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              10. Termination
            </h2>
            <p>
              Either party may terminate the professional relationship at any
              time. Upon termination, you remain responsible for any outstanding
              payments for services rendered.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              11. Modifications to Terms
            </h2>
            <p>
              Falling Upwards reserves the right to modify these Terms at any
              time. Changes will be effective immediately upon posting to our
              website. Your continued use of our services after changes
              constitutes acceptance of the modified Terms.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              12. Governing Law
            </h2>
            <p>
              These Terms are governed by and construed in accordance with the
              laws of the United Kingdom, without regard to its conflict of law
              principles.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              13. Contact Information
            </h2>
            <p>
              If you have questions about these Terms, please contact us at:
            </p>
            <p className="mb-8">
              <strong>Email:</strong> alex@fallingupwards.co.uk
              <br />
              <strong>Address:</strong> Falling Upwards, 123 Main Street,
              London, UK
            </p>

            <div className="text-sm text-gray-500 mt-10 pt-8 border-t border-gray-200">
              <p>{formattedDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/policies/privacy-policy"
            className="inline-flex items-center text-[#0B4073] font-medium hover:underline"
          >
            View our Privacy Policy
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
