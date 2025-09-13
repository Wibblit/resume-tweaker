import React from "react";
import LegalPoliciesGrid from "@/components/legal-policies-grid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "ResumeTweaker Legal | Terms of Service and Privacy Policy",
  },
  description:
    "Review ResumeTweaker's Terms of Service and Privacy Policy to understand our commitment to your data security and service usage.",
  alternates: {
    canonical: "https://resumetweaker.vercel.app/legal",
  },
  keywords: [
    "terms of service",
    "privacy policy",
    "user agreement",
    "data protection policy",
    "website terms",
    "service agreement",
    "privacy statement",
    "data privacy policy",
    "terms and conditions",
    "user privacy policy",
    "website privacy policy",
    "data security policy",
    "legal disclaimer",
    "cookie policy",
    "user privacy statement",
  ],
};

export default function legalPage() {
  return (
    <div className="min-h-screen bg-background py-28 px-4 sm:p-6 lg:p-28">
      <LegalPoliciesGrid />
    </div>
  );
}
