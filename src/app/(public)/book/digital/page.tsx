"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiCheck,
  FiGlobe,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiUser,
} from "react-icons/fi";

import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";

const bookingSchema = z.object({
  // Agreement and Consent
  dataProtectionAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to our data protection policy",
  }),

  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  jobTitle: z.string().optional(),

  // Organization Information
  organisationName: z.string().optional(),
  organisationWebsite: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),

  // Project Information
  projectType: z.array(z.string()).optional(),
  projectScope: z.array(z.string()).optional(),
  otherProjectType: z.string().optional(),
  otherProjectScope: z.string().optional(),
  requirements: z.string().optional(),
  timeline: z.string().optional(),
  budget: z.string().optional(),
  challenges: z.array(z.string()).optional(),
  otherChallenge: z.string().optional(),
  barriers: z.array(z.string()).optional(),
  otherBarrier: z.string().optional(),
  additionalInfo: z.string().optional(),

  // Custom message
  message: z.string().optional(),

  // Hidden fields
  __displayFormat: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otherSectorSelected, setOtherSectorSelected] = useState(false);
  const [otherSupportSelected, setOtherSupportSelected] = useState(false);
  const [otherBarrierSelected, setOtherBarrierSelected] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      supportType: [],
      barriers: [],
    },
  });

  // Watch for "Other" selections
  const selectedSector = watch("sector");
  const selectedSupportTypes = watch("supportType") || [];
  const selectedBarriers = watch("barriers") || [];

  // Update state when selections change
  useEffect(() => {
    setOtherSectorSelected(selectedSector === "Other");
    setOtherSupportSelected(selectedSupportTypes.includes("Other"));
    setOtherBarrierSelected(selectedBarriers.includes("Other"));
  }, [selectedSector, selectedSupportTypes, selectedBarriers]);

  const supportTypes = [
    "AI Integration & Strategy",
    "Workflow & Process Automation",
    "Digital Readiness & Change Management",
    "Workforce Engagement & Upskilling",
    "Data Insight & Dashboard Development",
    "Innovation Culture & Mindset Shifts",
    "Strategic Use of Technology for Service Delivery",
    "Other",
  ];

  const barrierTypes = [
    "Leadership buy-in",
    "Technical expertise",
    "Staff resistance or low confidence",
    "Budget constraints",
    "Legacy systems / fragmentation",
    "Competing organisational priorities",
    "Other",
  ];

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // Format the data for submission
      const formData = {
        ...data,
        // Format any specific fields if needed
        supportType: data.supportType ? data.supportType.join(", ") : "",
        barriers: data.barriers ? data.barriers.join(", ") : "",
        formType: "digital-evolution-ai-adoption",
        consultationTypeLabel: "Digital Evolution & AI Adoption",
      };

      console.log("Form data submitted:", formData);

      // Send data to API
      let response;
      try {
        response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        });
      } catch (fetchError: any) {
        throw new Error(`Network error: ${fetchError.message}`);
      }

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        // Try to get the text content for debugging
        const textContent = await response.text();
        console.error("Received non-JSON response:", textContent);
        throw new Error(
          "Server returned non-JSON response. Please try again later."
        );
      }

      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        throw new Error("Failed to parse server response. Please try again.");
      }

      if (!response.ok) {
        throw new Error(
          result.error || `Failed to submit form (Status ${response.status})`
        );
      }

      // Show success message
      const successMessage =
        "Thanks for submitting the booking form. We will be in touch ASAP to arrange your free consultation";
      setSuccess(successMessage);
      reset();
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(
        err.message ||
          "There was an error booking your consultation. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add global styles for form inputs
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .input-field {
        width: 100%;
        padding: 0.75rem;
        padding-left: 2.5rem;
        border: 1px solid #e2e8f0;
        border-radius: 0.375rem;
        background-color: white;
        font-size: 0.875rem;
        transition: border-color 0.15s ease-in-out;
      }
      .input-field:focus {
        outline: none;
        border-color: #7094B7;
        box-shadow: 0 0 0 3px rgba(112, 148, 183, 0.1);
      }
      .btn-primary {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75rem 1.5rem;
        background-color: #0B4073;
        color: white;
        font-weight: 600;
        border-radius: 0.375rem;
        transition: background-color 0.15s ease-in-out;
      }
      .btn-primary:hover {
        background-color: #072E53;
      }
      .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="min-h-screen  pb-16">
      {/* Hero Section */}
      <HeroSection
        title="Digital Evolution & AI Adoption"
        subtitle="We provide specialized mentoring and support for executives and board members, helping them navigate complex leadership challenges."
        backgroundImage="/images/backgrounds/Digital-Evolution -Ai-Adoption.JPG"
        height="medium"
        textPosition="left"
      />

      <div className="container-custom mx-auto">
        <div className="mb-16 mt-16 ml-10">
          <Link
            href="/our-services/digital-evolution"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Digital Evolution & AI Adoption
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#0B4073] p-6 text-white">
            <h1 className="text-3xl font-bold">
              Digital Evolution & AI Adoption Consultation Form
            </h1>
            <p className="mt-2 opacity-90">
              Schedule your consultation session
            </p>
          </div>

          <div className="p-6 md:p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-md">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-600 rounded-md flex items-start">
                <FiCheck className="mr-2 mt-1" />
                <div>
                  <p className="font-medium">{success}</p>

                  <Link
                    href="/"
                    className="inline-block mt-4 text-[#0B4073] hover:text-[#083056] font-medium"
                  >
                    Return to Home
                  </Link>
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Data Protection Agreement */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <div className="flex items-start mb-2">
                    <div className="flex items-center h-5">
                      <input
                        id="dataProtectionAgreement"
                        type="checkbox"
                        {...register("dataProtectionAgreement")}
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                      />
                    </div>
                    <label
                      htmlFor="dataProtectionAgreement"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      Please tick the box to confirm you are happy to adhere to
                      our data protection policy.
                    </label>
                  </div>
                  <div className="text-sm text-blue-600 hover:underline">
                    <Link href="/privacy-policy">
                      Click here to view policy
                    </Link>
                  </div>
                  {errors.dataProtectionAgreement && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.dataProtectionAgreement.message}
                    </p>
                  )}
                </div>

                {/* Personal Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Personal Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Full name (First &amp; Last)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          {...register("name")}
                          className={`input-field pl-10 ${
                            errors.name ? "border-red-500" : ""
                          }`}
                          placeholder="John Doe"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="organisationName"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Organisation Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="organisationName"
                          type="text"
                          {...register("organisationName")}
                          className="input-field pl-10"
                          placeholder="Your Organisation Ltd"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="jobTitle"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Job Title / Role
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="jobTitle"
                          type="text"
                          {...register("jobTitle")}
                          className="input-field pl-10"
                          placeholder="CEO / Manager / Director"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Email address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          {...register("email")}
                          className={`input-field pl-10 ${
                            errors.email ? "border-red-500" : ""
                          }`}
                          placeholder="your@email.com"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Contact number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          {...register("phone")}
                          className={`input-field pl-10 ${
                            errors.phone ? "border-red-500" : ""
                          }`}
                          placeholder="+1 (555) 123-4567"
                          disabled={isLoading}
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="organisationWebsite"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Organisation website (if applicable)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="organisationWebsite"
                          type="text"
                          {...register("organisationWebsite")}
                          className="input-field pl-10"
                          placeholder="https://www.example.com"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Organisation Overview Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Organisation Overview
                  </h3>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      1. What size is your organisation?
                    </label>
                    <div className="space-y-2">
                      {[
                        "Micro (1–9 employees)",
                        "Small (10–49 employees)",
                        "Medium SME (50–249 employees)",
                        "Large SME (250–499 employees)",
                        "Large Organisation / Enterprise (500+ employees)",
                      ].map((size) => (
                        <div key={size} className="flex items-center">
                          <input
                            id={`size-${size}`}
                            type="radio"
                            value={size}
                            {...register("organisationSize")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`size-${size}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {size}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      2. What sector best describes your organisation's work?
                    </label>
                    <div className="space-y-2">
                      {[
                        "Digital / Technology",
                        "Construction",
                        "Recruitment / HR",
                        "Healthcare (NHS or Private)",
                        "Education / Training",
                        "Local Government / Public Sector",
                        "Logistics / Transport",
                        "Manufacturing / Engineering",
                        "Charity / Voluntary Sector",
                        "Finance / Professional Services",
                        "Creative Industries / Media",
                        "Other",
                      ].map((sector) => (
                        <div key={sector} className="flex items-center">
                          <input
                            id={`sector-${sector}`}
                            type="radio"
                            value={sector}
                            {...register("sector")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`sector-${sector}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {sector}
                          </label>
                        </div>
                      ))}
                    </div>

                    {selectedSector === "Other" && (
                      <div className="mt-3">
                        <input
                          type="text"
                          {...register("otherSector")}
                          className="input-field"
                          placeholder="Please specify"
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Digital and AI Context Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Digital and AI Context
                  </h3>

                  <div className="mb-6">
                    <label
                      htmlFor="challenge"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      3. What challenge or opportunity is prompting you to
                      explore digital or AI solutions right now?
                    </label>
                    <textarea
                      id="challenge"
                      {...register("challenge")}
                      rows={4}
                      className="input-field"
                      placeholder="Describe your current challenges or opportunities..."
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      4. How would you describe the current digital maturity of
                      your organisation?
                    </label>
                    <div className="space-y-2">
                      {[
                        "Early-stage / Paper-based processes",
                        "Mixed digital and manual systems",
                        "Mostly digital, but lacking integration",
                        "Highly digital with established tools and data insight",
                        "Unsure / Not assessed",
                      ].map((maturity) => (
                        <div key={maturity} className="flex items-center">
                          <input
                            id={`maturity-${maturity}`}
                            type="radio"
                            value={maturity}
                            {...register("digitalMaturity")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`maturity-${maturity}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {maturity}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="currentSystems"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      5. What systems or platforms are you currently using (if
                      any)?
                    </label>
                    <textarea
                      id="currentSystems"
                      {...register("currentSystems")}
                      rows={3}
                      className="input-field"
                      placeholder="e.g. Excel, Google Workspace, Microsoft 365, CRMs, EMIS, SystmOne, custom platforms"
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      6. What kind of support or input are you interested in?
                    </label>
                    <div className="space-y-2">
                      {[
                        "AI Integration & Strategy",
                        "Workflow & Process Automation",
                        "Digital Readiness & Change Management",
                        "Workforce Engagement & Upskilling",
                        "Data Insight & Dashboard Development",
                        "Innovation Culture & Mindset Shifts",
                        "Strategic Use of Technology for Service Delivery",
                        "Other",
                      ].map((support) => (
                        <div key={support} className="flex items-center">
                          <input
                            id={`support-${support}`}
                            type="checkbox"
                            value={support}
                            {...register("supportType")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`support-${support}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {support}
                          </label>
                        </div>
                      ))}
                    </div>

                    {selectedSupportTypes.includes("Other") && (
                      <div className="mt-3">
                        <input
                          type="text"
                          {...register("otherSupportType")}
                          className="input-field"
                          placeholder="Please specify"
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="keyPeople"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      7. Who are the key people or teams currently responsible
                      for digital change in your organisation?
                    </label>
                    <textarea
                      id="keyPeople"
                      {...register("keyPeople")}
                      rows={3}
                      className="input-field"
                      placeholder="List key stakeholders, teams, or roles..."
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      8. What barriers (if any) are limiting your organisation's
                      ability to scale or embed digital or AI tools?
                    </label>
                    <div className="space-y-2">
                      {[
                        "Leadership buy-in",
                        "Technical expertise",
                        "Staff resistance or low confidence",
                        "Budget constraints",
                        "Legacy systems / fragmentation",
                        "Competing organisational priorities",
                        "Other",
                      ].map((barrier) => (
                        <div key={barrier} className="flex items-center">
                          <input
                            id={`barrier-${barrier}`}
                            type="checkbox"
                            value={barrier}
                            {...register("barriers")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor={`barrier-${barrier}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {barrier}
                          </label>
                        </div>
                      ))}
                    </div>

                    {selectedBarriers.includes("Other") && (
                      <div className="mt-3">
                        <input
                          type="text"
                          {...register("otherBarrier")}
                          className="input-field"
                          placeholder="Please specify"
                          disabled={isLoading}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="successOutcome"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      9. What would a successful outcome look like from working
                      with us on this initiative?
                    </label>
                    <textarea
                      id="successOutcome"
                      {...register("successOutcome")}
                      rows={4}
                      className="input-field"
                      placeholder="Describe your desired outcomes and success criteria..."
                      disabled={isLoading}
                    ></textarea>
                  </div>
                </div>

                {/* Additional Message */}
                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block mb-2 text-sm font-medium text-gray-700"
                  >
                    Additional Message (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                      <FiMessageSquare size={18} className="text-gray-400" />
                    </div>
                    <textarea
                      id="message"
                      {...register("message")}
                      rows={4}
                      className="input-field pl-10"
                      placeholder="Add any special requests, questions, or information you'd like us to know before the consultation..."
                      disabled={isLoading}
                    ></textarea>
                  </div>
                </div>

                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md mb-6">
                  <p>
                    Your privacy is important to us. All information shared is
                    confidential and protected under our{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-[#0B4073] hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                {/* Hidden fields to customize email display */}
                <input type="hidden" name="__displayFormat" value="true" />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                  >
                    {isLoading ? "Submitting..." : "Submit Form"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DigitalBookPage() {
  return (
    <div className="font-roboto bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}
