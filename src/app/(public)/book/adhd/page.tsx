"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { HeroSection } from "@/components/common/HeroSection";
import {
  FiArrowLeft,
  FiCalendar,
  FiCheck,
  FiMail,
  FiMessageSquare,
  FiPhone,
  FiUser,
} from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const bookingSchema = z.object({
  // Agreement and Consent
  dataProtectionAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to our data protection policy",
  }),

  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.date().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  location: z.string().optional(),

  // Understanding You
  adhdStatus: z.enum(["yes", "no", "exploring"]).optional(),
  coachingReason: z.string().optional(),
  challenges: z.array(z.string()).optional(),
  otherChallenge: z.string().optional(),
  goals: z.string().optional(),
  previousCoaching: z.boolean().optional(),
  previousCoachingDetails: z.string().optional(),

  // Session Preferences
  sessionFormat: z
    .enum(["online", "phone", "in_person", "flexible"])
    .optional(),
  coachingFrequency: z
    .enum(["weekly", "biweekly", "monthly", "not_sure"])
    .optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDobDate, setSelectedDobDate] = useState<Date | null>(null);
  const [hasPreviousCoaching, setHasPreviousCoaching] = useState(false);
  const [otherChallengeSelected, setOtherChallengeSelected] = useState(false);

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
      challenges: [],
      dataProtectionAgreement: false,
      previousCoaching: false,
    },
  });

  // Watch various fields
  const challenges = watch("challenges") || [];
  const previousCoaching = watch("previousCoaching");

  // Update state when watched fields change
  useEffect(() => {
    setOtherChallengeSelected(challenges.includes("Other"));
    setHasPreviousCoaching(previousCoaching || false);
  }, [challenges, previousCoaching]);

  const challengeOptions = [
    "Focus or attention difficulties",
    "Time management / routines",
    "Emotional regulation",
    "Task initiation or completion",
    "Overwhelm / burnout",
    "Self-esteem / confidence",
    "Relationships or communication",
    "Executive function support",
    "Other",
  ];

  const sessionFormatOptions = [
    { value: "online", label: "Online (Zoom)" },
    { value: "phone", label: "Phone" },
    { value: "in_person", label: "In-person" },
    { value: "flexible", label: "Flexible" },
  ];

  // Set the date in the form when the date picker changes

  // Set the date of birth in the form when the date picker changes
  const handleDobChange = (date: Date | null) => {
    setSelectedDobDate(date);
    if (date) {
      setValue("dateOfBirth", date, { shouldValidate: true });
    }
  };

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // Add form type identifier
      const formData = {
        ...data,
        formType: "adhd-coaching",
        consultationTypeLabel: "ADHD Coaching",
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
      setSelectedDobDate(null);
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
      <HeroSection
        title="ADHD Coaching"
        backgroundImage="/images/services/IMG_7552.webp"
      />

      <div className="container-custom mx-auto">
        <div className="mb-16 mt-16 ml-10">
          <Link
            href="/our-services/thinking-different"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Different Thinking Services
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#0B4073] p-6 text-white">
            <h1 className="text-3xl font-bold">
              ADHD Coaching Consultation Form
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
                  <p className="mt-1">
                    We will contact you shortly to confirm your appointment.
                  </p>
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
                        htmlFor="dateOfBirth"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Date of birth
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiCalendar size={18} className="text-gray-400" />
                        </div>
                        <DatePicker
                          id="dateOfBirth"
                          selected={selectedDobDate}
                          onChange={handleDobChange}
                          className="input-field pl-10"
                          placeholderText="Select your date of birth"
                          disabled={isLoading}
                          showYearDropdown
                          dropdownMode="select"
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
                        htmlFor="location"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Location (City / Region)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="location"
                          type="text"
                          {...register("location")}
                          className="input-field pl-10"
                          placeholder="London / South East"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Understanding You Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    Understanding You
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <p className="block mb-2 text-sm font-medium text-gray-700">
                        Have you been diagnosed with ADHD?
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <input
                            id="adhd-yes"
                            type="radio"
                            value="yes"
                            {...register("adhdStatus")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="adhd-yes"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="adhd-no"
                            type="radio"
                            value="no"
                            {...register("adhdStatus")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="adhd-no"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            No
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="adhd-exploring"
                            type="radio"
                            value="exploring"
                            {...register("adhdStatus")}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="adhd-exploring"
                            className="ml-2 text-sm font-medium text-gray-700"
                          >
                            In process / exploring
                          </label>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="coachingReason"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        What prompted you to seek ADHD coaching?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="coachingReason"
                          {...register("coachingReason")}
                          rows={4}
                          className="input-field pl-10"
                          placeholder="Please share what brought you to seek coaching..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        What challenges are you currently facing (tick all that
                        apply)?
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
                        htmlFor="goals"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        What goals would you like to work on?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="goals"
                          {...register("goals")}
                          rows={3}
                          className="input-field pl-10"
                          placeholder="Please describe your goals..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-3">
                        <input
                          id="previousCoaching"
                          type="checkbox"
                          {...register("previousCoaching")}
                          className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="previousCoaching"
                          className="ml-2 block text-sm font-medium text-gray-700"
                        >
                          Have you previously had any coaching or therapy?
                        </label>
                      </div>

                      {hasPreviousCoaching && (
                        <div className="pl-6 border-l-2 border-gray-100">
                          <label
                            htmlFor="previousCoachingDetails"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            If yes, what kind and when?
                          </label>
                          <div className="relative">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                              <FiMessageSquare
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                            <textarea
                              id="previousCoachingDetails"
                              {...register("previousCoachingDetails")}
                              rows={3}
                              className="input-field pl-10"
                              placeholder="Please provide details of your previous coaching or therapy experience..."
                              disabled={isLoading}
                            ></textarea>
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="block mb-3 text-sm font-medium text-gray-700">
                        Preferred session format:
                      </p>
                      <div className="space-y-2">
                        {sessionFormatOptions.map((format) => (
                          <div key={format.value} className="flex items-center">
                            <input
                              id={`format-${format.value}`}
                              type="radio"
                              value={format.value}
                              {...register("sessionFormat")}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                              disabled={isLoading}
                            />
                            <label
                              htmlFor={`format-${format.value}`}
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              {format.label}
                            </label>
                          </div>
                        ))}
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

export default function ADHDCoachingBookPage() {
  return (
    <div className="font-roboto bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}
