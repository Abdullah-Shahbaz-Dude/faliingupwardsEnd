"use client";

import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";
import { FiArrowRight } from "react-icons/fi";

export default function PrivacyPolicyPage() {
  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <HeroSection
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information"
        backgroundImage="/images/backgrounds/consultation-bg.jpg"
        height="small"
        textPosition="center"
      />

      <div className="container-custom mx-auto py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-10">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0B4073] mb-4">
              1. Introduction
            </h2>
            <p>
              Falling Upwards is committed to protecting your privacy. This
              Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you visit our website or use our
              services. Please read this privacy policy carefully. If you do not
              agree with the terms of this privacy policy, please do not access
              the site or use our services.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              2. Collection of Your Information
            </h2>
            <p>
              We may collect information about you in a variety of ways. The
              information we collect may include:
            </p>
            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Personal Data
            </h3>
            <p>
              Personal information you voluntarily provide to us when
              registering for our services, expressing interest in obtaining
              information about us or our services, or otherwise contacting us.
              This may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address, phone number</li>
              <li>Job title and company information</li>
              <li>Billing and payment information</li>
              <li>Demographic information</li>
              <li>Appointment preferences and history</li>
              <li>
                Information shared during consultations or coaching sessions
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Sensitive Personal Data
            </h3>
            <p>
              For therapeutic services, we may collect information related to
              your mental health, well-being, or neurodiversity status. This
              information is treated with the highest level of confidentiality
              and is only collected with your explicit consent.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Device Data
            </h3>
            <p>
              Information our servers automatically collect when you access our
              website, such as your IP address, browser type, operating system,
              access times, and the pages you have viewed.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Cookies
            </h3>
            <p>
              We may use cookies and similar tracking technologies to track
              activity on our website and store certain information. Cookies are
              files with small amounts of data, which may include an anonymous
              unique identifier. You can instruct your browser to refuse all
              cookies or to indicate when a cookie is being sent.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              3. Use of Your Information
            </h2>
            <p>
              We may use the information we collect about you for various
              purposes, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Providing, personalizing, and improving our services</li>
              <li>Processing transactions and sending related information</li>
              <li>Responding to inquiries and providing customer support</li>
              <li>
                Sending administrative information, updates, and promotional
                materials
              </li>
              <li>
                Protecting our rights and interests, including fraud prevention
              </li>
              <li>Complying with legal and regulatory requirements</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              4. Disclosure of Your Information
            </h2>
            <p>
              We may share information we have collected about you in certain
              situations. Your information may be disclosed as follows:
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              By Law or to Protect Rights
            </h3>
            <p>
              If we believe the release of information is necessary to respond
              to legal process, protect our rights, or protect the personal
              safety of our users or the public.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Third-Party Service Providers
            </h3>
            <p>
              We may share your information with third parties that perform
              services for us or on our behalf, including payment processing,
              data analysis, email delivery, hosting services, and customer
              service.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Professional Supervision
            </h3>
            <p>
              For therapeutic services, anonymized information may be shared
              during professional supervision sessions, which is standard
              practice to ensure quality of care.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              5. Security of Your Information
            </h2>
            <p>
              We use administrative, technical, and physical security measures
              to protect your personal information. While we have taken
              reasonable steps to secure the information you provide to us,
              please be aware that no security measures are perfect or
              impenetrable, and we cannot guarantee the security of your
              information.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              6. Data Retention
            </h2>
            <p>
              We will only keep your personal information for as long as it is
              necessary for the purposes set out in this privacy policy, unless
              a longer retention period is required or permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              7. Your Rights
            </h2>
            <p>
              You have the right to access, correct, or delete personal
              information we have collected about you. You may also have the
              right to data portability and to restrict or object to our
              processing of your personal data.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              8. Children's Privacy
            </h2>
            <p>
              Our services are not intended for individuals under the age of 18
              without parental consent. We do not knowingly collect personal
              information from children under 18. If we learn we have collected
              or received personal information from a child without parental
              consent, we will delete that information.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p>
              We may update our privacy policy from time to time. We will notify
              you of any changes by posting the new privacy policy on this page
              and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              10. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this privacy policy,
              please contact us at:
            </p>
            <p className="mb-8">
              <strong>Email:</strong> privacy@fallingupwards.com
              <br />
              <strong>Address:</strong> Falling Upwards, 123 Main Street,
              London, UK
            </p>

            <div className="text-sm text-gray-500 mt-10 pt-8 border-t border-gray-200">
              <p>Last Updated: June 10, 2023</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/terms-of-service"
            className="inline-flex items-center text-[#0B4073] font-medium hover:underline"
          >
            View our Terms of Service
            <FiArrowRight className="ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
