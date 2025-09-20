"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";
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

const bookingSchema = z.object({
  // Agreement and Consent
  dataProtectionAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to our data protection policy",
  }),

  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  organisation: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  linkedin: z.string().optional(),

  // Mentoring Information
  mentoringReason: z.string().optional(),
  challenges: z.array(z.string()).optional(),
  otherChallenge: z.string().optional(),
  previousMentoring: z.string().optional(),
  expectations: z.string().optional(),
  careerGoals: z.string().optional(),
  sessionFormat: z.string().optional(),

  // Hidden fields for formatting
  __displayFormat: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedChallenges, setSelectedChallenges] = useState<string[]>([]);
  const [otherChallengeSelected, setOtherChallengeSelected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      challenges: [],
    },
  });

  // Watch for changes in challenges array
  const challenges = watch("challenges") || [];
  const hasOtherChallenge = challenges.includes("Other");

  const challengeOptions = [
    "Role change or promotion",
    "Leadership under pressure",
    "Strategic growth or vision",
    "Team conflict or dynamics",
    "Burnout or decision fatigue",
    "Confidence or presence",
    "Navigating uncertainty",
    "Other",
  ];

  const sessionFormats = ["Online", "In-person", "Hybrid / Flexible"];

  // Set the date in the form when the date picker changes

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // Add form type identifier
      const formData = {
        ...data,
        formType: "executive-mentoring",
        consultationTypeLabel: "Executive Mentoring",
      };

      console.log("Form data submitted:", formData);

      // Send data to API
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit form");
      }

      // Show success message
      setSuccess(
        "Thanks for submitting the booking form. We will be in touch ASAP to arrange your free consultation"
      );
      reset();
    } catch (err) {
      console.error("Booking error:", err);
      setError(
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
        title="Executive Mentoring"
        subtitle="Specialized mentoring for executives to navigate complex leadership challenges"
        backgroundImage="/images/services/executive-mentoring.webp"
        height="medium"
        textPosition="left"
      />
      <div className="container-custom mx-auto">
        <div className="mb-16 mt-16 ml-10">
          <Link
            href="/our-services/executive-mentoring"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Executive Mentoring
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#0B4073] p-6 text-white">
            <h1 className="text-3xl font-bold">
              Executive Mentoring Consultation Form
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
                        aria-describedby="dataProtectionAgreementHelp"
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
                  <div
                    className="text-sm text-blue-600 hover:underline"
                    id="dataProtectionAgreementHelp"
                  >
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
                        Full Name (First & Last)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          {...register("name")}
                          className={`input-field pl-10 ${errors.name ? "border-red-500" : ""}`}
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
                        htmlFor="organisation"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Organisation
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiBriefcase size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="organisation"
                          type="text"
                          {...register("organisation")}
                          className="input-field pl-10"
                          placeholder="Your Organisation"
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
                          <FiBriefcase size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="jobTitle"
                          type="text"
                          {...register("jobTitle")}
                          className="input-field pl-10"
                          placeholder="Your Job Title"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="email"
                          type="email"
                          {...register("email")}
                          className={`input-field pl-10 ${errors.email ? "border-red-500" : ""}`}
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
                        Contact Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiPhone size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          {...register("phone")}
                          className={`input-field pl-10 ${errors.phone ? "border-red-500" : ""}`}
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
                        htmlFor="linkedin"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        LinkedIn (optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="linkedin"
                          type="text"
                          {...register("linkedin")}
                          className="input-field pl-10"
                          placeholder="Your LinkedIn URL"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* About You Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    About You
                  </h3>

                  <div className="mb-6">
                    <label
                      htmlFor="mentoringReason"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      What prompted you to seek mentoring?
                    </label>
                    <textarea
                      id="mentoringReason"
                      {...register("mentoringReason")}
                      rows={4}
                      className="input-field"
                      placeholder="Please describe your reasons for seeking mentoring..."
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      What are the current challenges or transitions you're
                      navigating?
                    </label>
                    <div className="space-y-2">
                      {challengeOptions.map((challenge) => (
                        <div key={challenge} className="flex items-center">
                          <input
                            id={`challenge-${challenge}`}
                            type="checkbox"
                            value={challenge}
                            {...register("challenges")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            disabled={isLoading}
                            aria-label={`Challenge: ${challenge}`}
                          />
                          <label
                            htmlFor={`challenge-${challenge}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {challenge}
                          </label>
                        </div>
                      ))}
                    </div>

                    {hasOtherChallenge && (
                      <div className="mt-3">
                        <input
                          type="text"
                          id="otherChallenge"
                          {...register("otherChallenge")}
                          className="input-field"
                          placeholder="Please describe other challenges"
                          disabled={isLoading}
                          aria-label="Describe other challenges"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Have you had coaching or mentoring before?
                    </label>
                    <div className="space-x-4">
                      {["Yes", "No"].map((option) => (
                        <label
                          key={option}
                          className="inline-flex items-center"
                        >
                          <input
                            type="radio"
                            id={`mentoring-${option}`}
                            value={option}
                            {...register("previousMentoring")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                            aria-label={`Previous mentoring: ${option}`}
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="expectations"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      What are your expectations or hopes for this work?
                    </label>
                    <textarea
                      id="expectations"
                      {...register("expectations")}
                      rows={4}
                      className="input-field"
                      placeholder="Please describe your expectations..."
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="careerGoals"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Where would you like to get to with your career / role?
                    </label>
                    <textarea
                      id="careerGoals"
                      {...register("careerGoals")}
                      rows={4}
                      className="input-field"
                      placeholder="Please describe your career goals..."
                      disabled={isLoading}
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      What's the best format for sessions?
                    </label>
                    <div className="space-y-2">
                      {sessionFormats.map((format) => (
                        <div key={format} className="flex items-center">
                          <input
                            id={`format-${format}`}
                            type="radio"
                            value={format}
                            {...register("sessionFormat")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                            aria-label={`Session format: ${format}`}
                          />
                          <label
                            htmlFor={`format-${format}`}
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            {format}
                          </label>
                        </div>
                      ))}
                    </div>
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
                <input
                  type="hidden"
                  {...register("__displayFormat")}
                  value="true"
                  aria-hidden="true"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary"
                    aria-live="polite"
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

export default function ExecutiveBookPage() {
  return (
    <div className="font-roboto bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}
