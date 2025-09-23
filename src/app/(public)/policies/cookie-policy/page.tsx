"use client";

import React from "react";
import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";
import { FiArrowRight } from "react-icons/fi";
import image from "@/assets/shutterstock_2455025455.jpg";

export default function CookiePolicyPage() {
  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="font-roboto">
      {/* Hero Section */}
      <HeroSection title="Cookie Policy" backgroundImage={image} />

      <div className="container-custom mx-auto py-16">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 md:p-10">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-[#0B4073] mb-4">
              1. Introduction
            </h2>
            <p>
              This Cookie Policy explains how Falling Upwards ("we", "us", or
              "our") uses cookies and similar technologies on our website. By
              using our website, you consent to the use of cookies as described
              in this policy.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              2. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files that are placed on your device when
              you visit a website. They are widely used to make websites work
              more efficiently and provide information to the website owners.
              Cookies can be "persistent" or "session" cookies.
            </p>
            <p>
              Persistent cookies remain on your device for a set period or until
              you delete them, while session cookies are deleted when you close
              your browser.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              3. How We Use Cookies
            </h2>
            <p>We use different types of cookies for various purposes:</p>
            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Essential Cookies
            </h3>
            <p>
              These cookies are necessary for the website to function properly.
              They enable core functionality such as security, network
              management, and account access. You cannot opt out of these
              cookies.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Performance and Analytics Cookies
            </h3>
            <p>
              These cookies help us understand how visitors interact with our
              website by collecting and reporting information anonymously. They
              help us improve the way our website works.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Functionality Cookies
            </h3>
            <p>
              These cookies allow the website to remember choices you make (such
              as your username, language, or region) and provide enhanced, more
              personal features.
            </p>

            <h3 className="text-xl font-semibold text-[#0B4073] mt-4 mb-2">
              Marketing and Advertising Cookies
            </h3>
            <p>
              These cookies track your browsing habits to enable us to show
              advertising which is more likely to be of interest to you. They
              are also used to limit the number of times you see an
              advertisement and help measure the effectiveness of advertising
              campaigns.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              4. Third-Party Cookies
            </h2>
            <p>
              We may allow third parties to place cookies on your device when
              you visit our website. These third parties include analytics
              services, advertising networks, and social media platforms.
            </p>
            <p>
              They use cookies to collect information about your browsing
              activities over time and across different websites. This
              information may be used to provide measurement services, targeted
              ads, or to personalize your experience.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              5. Managing Cookies
            </h2>
            <p>
              Most web browsers allow you to control cookies through their
              settings preferences. Here's how you can manage cookies in common
              browsers:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Google Chrome</strong>: Settings → Privacy and Security
                → Cookies and other site data
              </li>
              <li>
                <strong>Mozilla Firefox</strong>: Options → Privacy & Security →
                Cookies and Site Data
              </li>
              <li>
                <strong>Safari</strong>: Preferences → Privacy → Cookies and
                website data
              </li>
              <li>
                <strong>Microsoft Edge</strong>: Settings → Cookies and site
                permissions → Cookies and data stored
              </li>
            </ul>
            <p>
              Please note that restricting cookies may impact the functionality
              of our website.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              6. Cookie Consent
            </h2>
            <p>
              When you first visit our website, you will be presented with a
              cookie banner that allows you to accept or decline non-essential
              cookies. You can change your preferences at any time by clicking
              on the "Cookie Settings" link in the footer of our website.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              7. Changes to This Cookie Policy
            </h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify
              you of any changes by posting the new Cookie Policy on this page
              and updating the "Last Updated" date.
            </p>

            <h2 className="text-2xl font-bold text-[#0B4073] mt-8 mb-4">
              8. Contact Us
            </h2>
            <p>
              If you have questions or concerns about this Cookie Policy, please
              contact us at:
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
