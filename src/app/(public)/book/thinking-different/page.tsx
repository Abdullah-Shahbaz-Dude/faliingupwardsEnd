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
import { homepageImages } from "@/lib/frontend/images";

const bookingSchema = z.object({
  // Agreement
  dataProtectionAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to our data protection policy",
  }),

  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  organisation: z.string().optional(),
  jobTitle: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  website: z.string().optional(),

  // Organisation Overview
  organisationSize: z
    .enum(["micro", "small", "medium", "large_sme", "enterprise"])
    .optional(),
  sector: z.string().optional(),
  otherSector: z.string().optional(),

  // Neurodiversity Context
  interestReason: z.string().optional(),
  approachToNeurodiversity: z
    .enum(["exploring", "awareness", "supporting", "strategic", "undefined"])
    .optional(),
  areasOfInterest: z.array(z.string()).optional(),
  otherAreaOfInterest: z.string().optional(),
  opportunities: z.string().optional(),

  // Challenges
  challenges: z.array(z.string()).optional(),
  otherChallenge: z.string().optional(),

  // Outcomes
  successOutcome: z.string().optional(),

  // Hidden fields
  __displayFormat: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otherSectorSelected, setOtherSectorSelected] = useState(false);
  const [otherAreaSelected, setOtherAreaSelected] = useState(false);
  const [otherChallengeSelected, setOtherChallengeSelected] = useState(false);
  const [otherNeuroSelected, setOtherNeuroSelected] = useState(false);
  const [otherBarrierSelected, setOtherBarrierSelected] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
    watch,
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      areasOfInterest: [],
      challenges: [],
      dataProtectionAgreement: false,
    },
  });

  // Watch various fields
  const sector = watch("sector");
  const areasOfInterest = watch("areasOfInterest") || [];
  const challenges = watch("challenges") || [];

  // Update state when watched fields change
  useEffect(() => {
    setOtherSectorSelected(sector === "Other");
    setOtherAreaSelected(areasOfInterest.includes("Other"));
    setOtherChallengeSelected(challenges.includes("Other"));
    setOtherNeuroSelected(areasOfInterest.includes("Neurodiversity"));
    setOtherBarrierSelected(challenges.includes("Neurodiversity"));
  }, [sector, areasOfInterest, challenges]);

  // Update page title based on selected service
  useEffect(() => {
    let title = "Different Thinking For Different Thinkers";
    let subtitle =
      "Innovation doesn't come from consensus; it comes from difference";

    // If we wanted to dynamically update the document title
    document.title = title;

    // We'll use these in our return statement
    return () => {
      // Cleanup if needed
    };
  }, []);

  const organisationSizeOptions = [
    { value: "micro", label: "Micro (1–9 employees)" },
    { value: "small", label: "Small (10–49 employees)" },
    { value: "medium", label: "Medium SME (50–249 employees)" },
    { value: "large_sme", label: "Large SME (250–499 employees)" },
    {
      value: "enterprise",
      label: "Large Organisation / Enterprise (500+ employees)",
    },
  ];

  const sectorOptions = [
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
  ];

  const approachOptions = [
    {
      value: "exploring",
      label: "We're exploring the concept for the first time",
    },
    {
      value: "awareness",
      label: "We've done some awareness work but want to go deeper",
    },
    {
      value: "supporting",
      label: "We are actively supporting neurodivergent employees",
    },
    {
      value: "strategic",
      label: "We want to move beyond inclusion into strategic application",
    },
    { value: "undefined", label: "Not sure / No defined approach yet" },
  ];

  const areasOfInterestOptions = [
    "Leadership awareness of neurodivergent strengths",
    "Embedding cognitive diversity into innovation strategy",
    "Creating psychologically safe environments for original thinking",
    'Using neurodiversity to disrupt "groupthink" and unlock new ideas',
    "Inclusive team design & culture building",
    "Identifying barriers to creativity in current processes",
    "Supporting and retaining neurodivergent talent",
    "Recruitment and onboarding practices",
    "Workshops or keynote delivery",
    "Other",
  ];

  const challengeOptions = [
    "Lack of understanding across leadership",
    "Concerns about making adjustments",
    "Recruitment or progression barriers",
    "Culture of conformity / risk aversion",
    "Limited psychological safety or openness",
    "Difficulty identifying neurodivergent talent",
    "Other",
  ];

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // Add form type identifier based on the selected service
      let formType = "thinking-different-consultation";
      let consultationTypeLabel =
        "Different Thinking For Different Thinkers Consultation";

      // Add form type identifier
      const formData = {
        ...data,
        formType,
        consultationTypeLabel,
        serviceType: "thinking-different", // Default if none selected
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

      // Show success message based on service type
      const successMessage =
        "Thanks for submitting the booking form. We will be in touch ASAP to arrange your free consultation";
      setSuccess(successMessage);
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
    <div className="min-h-screen pb-16">
      <HeroSection
        title="Different Thinking For Different Thinkers"
        backgroundImage={homepageImages.hero.heroImg2}
      />

      <div className="container-custom mx-auto">
        <div className="mb-16 mt-16  ml-10">
          <Link
            href="/our-services/neurodiversity"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Different Thinking Services
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#0B4073] p-6 text-white">
            <h1 className="text-3xl font-bold">
              Different Thinking For Different Thinkers Consultation Form
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
                {/* Agreement Section */}
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Please tick the box below to confirm you are happy to adhere
                    to our data protection policy.
                  </p>
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
                      I agree
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
                        Organisation Name
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
                          placeholder="Company Ltd"
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
                          placeholder="HR Manager"
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
                          className={`input-field pl-10 ${errors.phone ? "border-red-500" : ""}`}
                          placeholder="+44 7123 456789"
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
                        htmlFor="website"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Organisation website (if applicable)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiGlobe size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="website"
                          type="text"
                          {...register("website")}
                          className="input-field pl-10"
                          placeholder="www.example.com"
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
                  <div className="space-y-6">
                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        1. What size is your organisation?
                      </p>
                      <div className="space-y-2">
                        {organisationSizeOptions.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`size-${option.value}`}
                              type="radio"
                              value={option.value}
                              {...register("organisationSize")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              disabled={isLoading}
                              aria-label={`Organisation size: ${option.label}`}
                            />
                            <label
                              htmlFor={`size-${option.value}`}
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        2. What sector best describes your organisation's work?
                      </p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {sectorOptions.map((sector) => (
                          <div key={sector} className="flex items-center">
                            <input
                              id={`sector-${sector}`}
                              type="radio"
                              value={sector}
                              {...register("sector")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              disabled={isLoading}
                              aria-label={`Sector: ${sector}`}
                            />
                            <label
                              htmlFor={`sector-${sector}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {sector}
                            </label>
                          </div>
                        ))}
                      </div>

                      {otherSectorSelected && (
                        <div className="mt-3">
                          <input
                            type="text"
                            {...register("otherSector")}
                            className="input-field"
                            placeholder="Please specify other sector"
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Different Thinking Context */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Neurodiversity & Strategic Innovation Context
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="interestReason"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        3. What prompted your interest in exploring
                        neurodiversity as part of your innovation or business
                        strategy?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="interestReason"
                          {...register("interestReason")}
                          rows={4}
                          className="input-field pl-10"
                          placeholder="Please share what brought you to explore neurodiversity..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        4. How would you currently describe your organisation's
                        approach to neurodiversity?
                      </p>
                      <div className="space-y-2">
                        {approachOptions.map((option) => (
                          <div key={option.value} className="flex items-center">
                            <input
                              id={`approach-${option.value}`}
                              type="radio"
                              value={option.value}
                              {...register("approachToNeurodiversity")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              disabled={isLoading}
                              aria-label={`Approach to neurodiversity: ${option.label}`}
                            />
                            <label
                              htmlFor={`approach-${option.value}`}
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        5. Which areas are you most interested in exploring?
                      </p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {areasOfInterestOptions.map((area) => (
                          <div key={area} className="flex items-center">
                            <input
                              id={`area-${area}`}
                              type="checkbox"
                              value={area}
                              {...register("areasOfInterest")}
                              className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                              disabled={isLoading}
                              aria-label={`Area of interest: ${area}`}
                            />
                            <label
                              htmlFor={`area-${area}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {area}
                            </label>
                          </div>
                        ))}
                      </div>

                      {otherAreaSelected && (
                        <div className="mt-3">
                          <input
                            type="text"
                            {...register("otherAreaOfInterest")}
                            className="input-field"
                            placeholder="Please describe other areas of interest"
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="opportunities"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        6. Where in your organisation do you see the greatest
                        opportunity for neurodiverse thinking to drive
                        innovation or transformation?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="opportunities"
                          {...register("opportunities")}
                          rows={3}
                          className="input-field pl-10"
                          placeholder="Please describe where you see opportunities..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        7. What challenges (if any) are limiting your ability to
                        harness neurodiverse thinking?
                      </p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {challengeOptions.map((challenge) => (
                          <div key={challenge} className="flex items-center">
                            <input
                              id={`challenge-${challenge}`}
                              type="checkbox"
                              value={challenge}
                              {...register("challenges")}
                              className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                              disabled={isLoading}
                              aria-label={`Challenge: ${challenge}`}
                            />
                            <label
                              htmlFor={`challenge-${challenge}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {challenge}
                            </label>
                          </div>
                        ))}
                      </div>

                      {otherChallengeSelected && (
                        <div className="mt-3">
                          <input
                            type="text"
                            {...register("otherChallenge")}
                            className="input-field"
                            placeholder="Please specify other challenges"
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="successOutcome"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        8. What would a successful outcome look like for your
                        team or organisation?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="successOutcome"
                          {...register("successOutcome")}
                          rows={3}
                          className="input-field pl-10"
                          placeholder="e.g., More original thinking, stronger innovation culture, inclusive team performance, etc."
                          disabled={isLoading}
                        ></textarea>
                      </div>
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

export default BookPageContent;
