"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";
import {
  FiArrowLeft,
  FiCheck,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";

const bookingSchema = z.object({
  // Agreement
  dataProtectionAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to our data protection policy",
  }),

  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  boardName: z.string().optional(),
  boardRole: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  sector: z.string().optional(),

  // Understanding Your Board
  currentIssue: z.string().optional(),
  supportTypes: z.array(z.string()).optional(),
  otherSupportType: z.string().optional(),
  previousFacilitators: z.enum(["Yes", "No"]).optional(),
  previousFacilitatorDetails: z.string().optional(),
  explorationGoals: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [otherSupportTypeSelected, setOtherSupportTypeSelected] =
    useState(false);
  const [hasPreviousFacilitators, setHasPreviousFacilitators] = useState(false);

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
      supportTypes: [],
      dataProtectionAgreement: false,
      previousFacilitators: "No",
    },
  });

  // Watch various fields
  const supportTypes = watch("supportTypes") || [];
  const previousFacilitators = watch("previousFacilitators");

  // Update state when watched fields change
  useEffect(() => {
    setOtherSupportTypeSelected(supportTypes.includes("Other"));
    setHasPreviousFacilitators(previousFacilitators === "Yes");
  }, [supportTypes, previousFacilitators]);

  const supportTypeOptions = [
    "Boardroom culture / cohesion",
    "Navigating change / restructuring",
    "Strategic alignment & clarity",
    "Executive development",
    "External facilitation or insight",
    "Innovation or inclusion advisory",
    "Other",
  ];

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // Add form type identifier
      const formData = {
        ...data,
        formType: "boardroom-advisory",
        consultationTypeLabel: "Boardroom Advisory",
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
    <div className="min-h-screen pb-16">
      <HeroSection
        title="Boardroom Advisory"
        backgroundImage="/images/services/executive-mentoring.webp"
      />

      <div className="container-custom mx-auto">
        <div className="mb-16 mt-16 ml-10">
          <Link
            href="/our-services/executive-mentoring"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Boardroom Advisory Services
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#0B4073] p-6 text-white">
            <h1 className="text-3xl font-bold">
              Boardroom Advisory Consultation Form
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
                      />
                    </div>
                    <label
                      htmlFor="dataProtectionAgreement"
                      className="ml-2 text-sm font-medium text-gray-700"
                    >
                      I agree
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
                    {/* name */}
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
                    {/* Organisation */}
                    <div>
                      <label
                        htmlFor="boardName"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Board / Organisation Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiBriefcase size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="boardName"
                          type="text"
                          {...register("boardName")}
                          className="input-field pl-10"
                          placeholder="Organisation Name"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {/* Role */}
                    <div>
                      <label
                        htmlFor="boardRole"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Your Role on the Board
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="boardRole"
                          type="text"
                          {...register("boardRole")}
                          className="input-field pl-10"
                          placeholder="e.g. Chair, Non-Executive Director"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    {/* email */}
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
                    {/* phone */}
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
                    {/* Sector focus */}
                    <div>
                      <label
                        htmlFor="sector"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Sector focus
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiBriefcase size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="sector"
                          type="text"
                          {...register("sector")}
                          className="input-field pl-10"
                          placeholder="e.g. health, education, private"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Understanding Your Board Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Understanding Your Board
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentIssue"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        What is the current opportunity or issue the board is
                        facing?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="currentIssue"
                          {...register("currentIssue")}
                          rows={4}
                          className="input-field pl-10"
                          placeholder="Please describe the situation..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        What type of support are you seeking?
                      </p>
                      <div className="grid md:grid-cols-2 gap-2">
                        {supportTypeOptions.map((support) => (
                          <div key={support} className="flex items-center">
                            <input
                              id={`support-${support}`}
                              type="checkbox"
                              value={support}
                              {...register("supportTypes")}
                              className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                              disabled={isLoading}
                            />
                            <label
                              htmlFor={`support-${support}`}
                              className="ml-2 block text-sm text-gray-700"
                            >
                              {support}
                            </label>
                          </div>
                        ))}
                      </div>

                      {otherSupportTypeSelected && (
                        <div className="mt-3">
                          <input
                            type="text"
                            {...register("otherSupportType")}
                            className="input-field"
                            placeholder="Please specify other type of support"
                            disabled={isLoading}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="block mb-2 text-sm font-medium text-gray-700">
                        Have you previously worked with external facilitators,
                        consultants or coaches?
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="facilitators-yes"
                            type="radio"
                            value="Yes"
                            {...register("previousFacilitators")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="facilitators-yes"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="facilitators-no"
                            type="radio"
                            value="No"
                            {...register("previousFacilitators")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="facilitators-no"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            No
                          </label>
                        </div>
                      </div>

                      {hasPreviousFacilitators && (
                        <div className="mt-3">
                          <label
                            htmlFor="previousFacilitatorDetails"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            If yes, in what capacity?
                          </label>
                          <div className="relative">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                              <FiMessageSquare
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                            <textarea
                              id="previousFacilitatorDetails"
                              {...register("previousFacilitatorDetails")}
                              rows={3}
                              className="input-field pl-10"
                              placeholder="Please describe your previous experience..."
                              disabled={isLoading}
                            ></textarea>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="explorationGoals"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        What dynamics or goals would you like to explore
                        further?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="explorationGoals"
                          {...register("explorationGoals")}
                          rows={3}
                          className="input-field pl-10"
                          placeholder="Please describe your goals or dynamics to explore..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
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

export default function BoardroomAdvisoryBookPage() {
  return (
    <div className="font-roboto bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}
