"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { IMAGE_PATHS } from "@/config/images";

export default function SubmissionComplete() {
  return (
    <div className="min-h-screen bg-slate-50 font-roboto">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 ">
              <Image 
                src={IMAGE_PATHS.favicon} 
                alt="Falling Upward Logo" 
                width={200} 
                height={200}
                className="rounded-full"
              />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-green-600 mb-4">
              Submission Complete!
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Thank you for completing your workbooks. Your responses have been successfully submitted and are now under review.
            </p>
          </motion.div>
          {/* Final Message */}
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-sm border border-slate-300 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h3 className="text-xl font-semibold text-slate-900 mb-3">
              Dashboard Access Closed
            </h3>
           
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <a
                href="/"
                className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary/80 text-white font-semibold rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              >
                Return to Home Page
              </a>
           
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
