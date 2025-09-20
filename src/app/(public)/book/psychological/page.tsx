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
import Image from "next/image";
import "react-datepicker/dist/react-datepicker.css";

const bookingSchema = z.object({
  // Agreement and Consent
  dataProtectionAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to our data protection policy",
  }),

  // Personal Details
  name: z.string().min(2, "Name must be at least 2 characters"),
  dateOfBirth: z.date().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  postcode: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),

  // GP Information
  gpInfo: z.string().optional(),

  // Current Wellbeing
  currentWellbeing: z.string().optional(),
  therapyReason: z.string().optional(),

  // Therapy History
  previousTherapy: z.boolean().optional(),
  previousTherapyDetails: z.string().optional(),
  previousTherapyExperience: z.string().optional(),

  // Therapy Type
  therapyType: z.enum(["psychological", "walking", "not_sure"]).optional(),

  // Presenting Issues
  presentingIssues: z.array(z.string()).optional(),
  otherIssue: z.string().optional(),

  // Additional Information
  currentServices: z.string().optional(),
  prescribedMedication: z.boolean().optional(),
  prescribedMedicationDetails: z.string().optional(),
  nonPrescribedMedication: z.boolean().optional(),
  nonPrescribedMedicationDetails: z.string().optional(),

  // Hidden fields for formatting
  __displayFormat: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

function BookPageContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedDobDate, setSelectedDobDate] = useState<Date | null>(null);
  const [hasPreviousTherapy, setHasPreviousTherapy] = useState(false);
  const [hasPrescribedMedication, setHasPrescribedMedication] = useState(false);
  const [hasNonPrescribedMedication, setHasNonPrescribedMedication] =
    useState(false);
  const [otherIssueSelected, setOtherIssueSelected] = useState(false);

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
      presentingIssues: [],
      dataProtectionAgreement: false,
      previousTherapy: false,
      prescribedMedication: false,
      nonPrescribedMedication: false,
    },
  });

  // Watch various fields
  const previousTherapy = watch("previousTherapy");
  const presentingIssues = watch("presentingIssues") || [];
  const prescribedMedication = watch("prescribedMedication");
  const nonPrescribedMedication = watch("nonPrescribedMedication");

  // Update state when watched fields change
  useEffect(() => {
    setHasPreviousTherapy(previousTherapy || false);
    setHasPrescribedMedication(prescribedMedication || false);
    setHasNonPrescribedMedication(nonPrescribedMedication || false);
    setOtherIssueSelected(presentingIssues.includes("Other"));
  }, [
    previousTherapy,
    prescribedMedication,
    nonPrescribedMedication,
    presentingIssues,
  ]);

  const handleDobChange = (date: Date | null) => {
    setSelectedDobDate(date);
    if (date) {
      setValue("dateOfBirth", date, { shouldValidate: true });
    }
  };

  const therapyTypes = [
    { value: "psychological", label: "Psychological Therapy" },
    { value: "not_sure", label: "Not Sure Yet" },
  ];

  const presentingIssueOptions = [
    "Depression",
    "Work-Related Issues",
    "Anxiety",
    "Stress",
    "Phobia",
    "Relationship Difficulties",
    "Anger/Distress",
    "Bereavement/Loss",
    "Self-esteem and Confidence Issues",
    "Difficulty in Managing Overwhelming Thoughts and Feelings",
    "Adult Abuse",
    "Unhealthy Coping Mechanisms",
    "Trauma Issues",
    "Other",
  ];

  // Handle form submission
  const onSubmit = async (data: BookingFormValues) => {
    setIsLoading(true);
    setError("");

    try {
      // Determine therapy type for email subject and content
      const therapyTypeLabel = "Psychological Therapy";

      // Add form type identifier
      const formData = {
        ...data,
        // Format date to ISO string if it exists
        // Format date of birth if it exists
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.toISOString().split("T")[0]
          : "",
        formType: "psychological-therapy",
        consultationTypeLabel: therapyTypeLabel,
      };

      // Log form data for debugging
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
      setSuccess(
        "Thanks for submitting the booking form. We will be in touch ASAP to arrange your free consultation"
      );
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
      
      /* DatePicker Custom Styles */
      .react-datepicker {
        font-family: 'Roboto', sans-serif;
        border-radius: 0.5rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      .react-datepicker__header {
        background-color: #EFF6FB;
        border-bottom: 1px solid #e2e8f0;
      }
      .react-datepicker__navigation {
        top: 12px;
      }
      .react-datepicker__day--selected {
        background-color: #0B4073;
        border-radius: 0.25rem;
      }
      .react-datepicker__day:hover {
        background-color: #D6E2EA;
      }
      .react-datepicker__day--keyboard-selected {
        background-color: #7094B7;
      }
      .react-datepicker__month-select, 
      .react-datepicker__year-select {
        padding: 0.25rem;
        border-radius: 0.25rem;
        border: 1px solid #e2e8f0;
      }
      .calendar-icon-wrapper {
        position: absolute;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        color: #7094B7;
        pointer-events: none;
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
        title="Psychological Therapy "
        subtitle="Our psychological therapy services provide a safe, confidential space for individuals to explore challenges and develop strategies for positive change."
        backgroundImage="/images/backgrounds/Psychological-Therapy-Page.JPG"
        height="medium"
        textPosition="left"
      />
      <div className="container-custom mx-auto">
        <div className="mb-16 mt-16 ml-10">
          <Link
            href="/our-services/psychological-therapy"
            className="text-[#0B4073] hover:text-[#072e53] inline-flex items-center transition-colors duration-200"
          >
            <FiArrowLeft className="mr-2" />
            Back to Psychological Therapies
          </Link>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-[#0B4073] p-6 text-white">
            <h1 className="text-3xl font-bold">
              Psychological Therapies Consultation Form
            </h1>
            <p className="mt-2 opacity-90">
              For Psychological Therapy & Walking Therapy
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
                {/* 1. Agreement and Consent Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    1. Agreement and Consent
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
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
                        Are you happy to adhere to the data protection policy?
                      </label>
                    </div>
                    {errors.dataProtectionAgreement && (
                      <p
                        className="mt-1 text-sm text-red-600"
                        id="dataProtectionAgreementHelp"
                      >
                        {errors.dataProtectionAgreement.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* 2. Personal Details Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    2. Personal Details
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Full Name
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
                        Date of Birth
                      </label>
                      <div className="relative">
                        <div className="calendar-icon-wrapper">
                          <FiCalendar size={18} className="text-[#0B4073]" />
                        </div>
                        <DatePicker
                          id="dateOfBirth"
                          selected={selectedDobDate}
                          onChange={handleDobChange}
                          className="input-field pl-10 cursor-pointer"
                          placeholderText="Select your date of birth"
                          disabled={isLoading}
                          dateFormat="dd/MM/yyyy"
                          maxDate={new Date()}
                          showMonthDropdown
                          showYearDropdown
                          yearDropdownItemNumber={100}
                          scrollableYearDropdown
                          dateFormatCalendar="MMMM yyyy"
                          dropdownMode="select"
                          minDate={new Date(1900, 0, 1)}
                          popperClassName="date-picker-popper"
                        />
                      </div>
                      {errors.dateOfBirth && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="address"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        1st Line of Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="address"
                          type="text"
                          {...register("address")}
                          className="input-field pl-10"
                          placeholder="123 Example Street"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Town/City
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="city"
                          type="text"
                          {...register("city")}
                          className="input-field pl-10"
                          placeholder="Cityname"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="postcode"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Postcode
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiUser size={18} className="text-gray-400" />
                        </div>
                        <input
                          id="postcode"
                          type="text"
                          {...register("postcode")}
                          className="input-field pl-10"
                          placeholder="AB12 3CD"
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
                  </div>
                </div>

                {/* 3. GP Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    3. GP Information
                  </h3>
                  <div>
                    <label
                      htmlFor="gpInfo"
                      className="block mb-2 text-sm font-medium text-gray-700"
                    >
                      Name and Address of GP
                    </label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                        <FiUser size={18} className="text-gray-400" />
                      </div>
                      <textarea
                        id="gpInfo"
                        {...register("gpInfo")}
                        rows={3}
                        className="input-field pl-10"
                        placeholder="Dr. Name, Medical Practice, Address"
                        disabled={isLoading}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* 4. Current Wellbeing */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    4. Current Wellbeing
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="currentWellbeing"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Can you please say how things are for you at the moment?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="currentWellbeing"
                          {...register("currentWellbeing")}
                          rows={4}
                          className="input-field pl-10"
                          placeholder="Please describe your current situation..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="therapyReason"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        What prompted you to come for therapy?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="therapyReason"
                          {...register("therapyReason")}
                          rows={4}
                          className="input-field pl-10"
                          placeholder="Please explain your reasons for seeking therapy..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Therapy History */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    5. Therapy History
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="previousTherapy"
                        type="checkbox"
                        {...register("previousTherapy")}
                        className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                        disabled={isLoading}
                        aria-label="Previous therapy"
                      />
                      <label
                        htmlFor="previousTherapy"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Have you previously had therapy?
                      </label>
                    </div>

                    {hasPreviousTherapy && (
                      <div className="pl-6 space-y-4 border-l-2 border-gray-100">
                        <div>
                          <label
                            htmlFor="previousTherapyDetails"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            If yes, can you state where and when?
                          </label>
                          <div className="relative">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                              <FiMessageSquare
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                            <textarea
                              id="previousTherapyDetails"
                              {...register("previousTherapyDetails")}
                              rows={2}
                              className="input-field pl-10"
                              placeholder="Location and dates of previous therapy..."
                              disabled={isLoading}
                            ></textarea>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="previousTherapyExperience"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            Can you say if you found the therapy helpful or
                            unhelpful? Please give any reasons why.
                          </label>
                          <div className="relative">
                            <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                              <FiMessageSquare
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                            <textarea
                              id="previousTherapyExperience"
                              {...register("previousTherapyExperience")}
                              rows={3}
                              className="input-field pl-10"
                              placeholder="Your experience with previous therapy..."
                              disabled={isLoading}
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 6. Presenting Issues */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    6. Presenting Issues
                  </h3>
                  <p className="mb-4 text-sm text-gray-700">
                    This is a list of issues people may come to therapy to help
                    resolve. Please tick any that you are concerned about:
                  </p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {presentingIssueOptions.map((issue) => (
                      <div key={issue} className="flex items-center">
                        <input
                          id={`issue-${issue}`}
                          type="checkbox"
                          value={issue}
                          {...register("presentingIssues")}
                          className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                          disabled={isLoading}
                          aria-label={`Issue: ${issue}`}
                        />
                        <label
                          htmlFor={`issue-${issue}`}
                          className="ml-2 block text-sm text-gray-700"
                        >
                          {issue}
                        </label>
                      </div>
                    ))}
                  </div>

                  {otherIssueSelected && (
                    <div className="mt-4">
                      <label
                        htmlFor="otherIssue"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Please specify:
                      </label>
                      <input
                        id="otherIssue"
                        type="text"
                        {...register("otherIssue")}
                        className="input-field"
                        placeholder="Please specify other issues"
                        disabled={isLoading}
                      />
                    </div>
                  )}
                </div>

                {/* 7. Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                    7. Additional Information
                  </h3>
                  <div className="space-y-6">
                    <div>
                      <label
                        htmlFor="currentServices"
                        className="block mb-2 text-sm font-medium text-gray-700"
                      >
                        Are you currently working with any service or agency
                        (e.g. NHS, Police, Alternative Health Practitioner)?
                      </label>
                      <div className="relative">
                        <div className="absolute top-3 left-3 flex items-start pointer-events-none">
                          <FiMessageSquare
                            size={18}
                            className="text-gray-400"
                          />
                        </div>
                        <textarea
                          id="currentServices"
                          {...register("currentServices")}
                          rows={2}
                          className="input-field pl-10"
                          placeholder="Please list any services or agencies..."
                          disabled={isLoading}
                        ></textarea>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <input
                          id="prescribedMedication"
                          type="checkbox"
                          {...register("prescribedMedication")}
                          className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                          disabled={isLoading}
                          aria-label="Currently taking prescribed medication"
                        />
                        <label
                          htmlFor="prescribedMedication"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Are you currently taking any prescribed medication?
                        </label>
                      </div>

                      {hasPrescribedMedication && (
                        <div className="pl-6 border-l-2 border-gray-100">
                          <label
                            htmlFor="prescribedMedicationDetails"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            If yes, please state what:
                          </label>
                          <div className="relative">
                            <input
                              id="prescribedMedicationDetails"
                              type="text"
                              {...register("prescribedMedicationDetails")}
                              className="input-field"
                              placeholder="Please list your prescribed medications"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center mb-2">
                        <input
                          id="nonPrescribedMedication"
                          type="checkbox"
                          {...register("nonPrescribedMedication")}
                          className="h-4 w-4 text-[#0B4073] focus:ring-[#0B4073] border-gray-300 rounded"
                          disabled={isLoading}
                          aria-label="Currently taking non-prescribed medication"
                        />
                        <label
                          htmlFor="nonPrescribedMedication"
                          className="ml-2 block text-sm text-gray-700"
                        >
                          Are you currently taking any non-prescribed
                          medication?
                        </label>
                      </div>

                      {hasNonPrescribedMedication && (
                        <div className="pl-6 border-l-2 border-gray-100">
                          <label
                            htmlFor="nonPrescribedMedicationDetails"
                            className="block mb-2 text-sm font-medium text-gray-700"
                          >
                            If yes, please state what:
                          </label>
                          <div className="relative">
                            <input
                              id="nonPrescribedMedicationDetails"
                              type="text"
                              {...register("nonPrescribedMedicationDetails")}
                              className="input-field"
                              placeholder="Please list your non-prescribed medications"
                              disabled={isLoading}
                            />
                          </div>
                        </div>
                      )}
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

export default function PsychologicalBookPage() {
  return (
    <div className="font-roboto bg-gray-50">
      <Suspense fallback={<div>Loading...</div>}>
        <BookPageContent />
      </Suspense>
    </div>
  );
}
