import { Metadata } from "next";
import ReviewPage from "@/components/LandingPage/LandingReviewPage";

export const metadata: Metadata = {
  title: {
    absolute: "ResumeTweaker | AI Powered Resume Review",
  },
  description:
    "Boost your job prospects with ResumeTweaker’s AI-powered resume review. Get detailed feedback, ATS optimization tips, and a resume score to help you stand out.",
  alternates: {
    canonical: "https://resumetweaker.vercel.app/review",
  },
  keywords: [
    "resume review services",
    "professional resume review",
    "resume critique",
    "resume optimization",
    "CV review",
    "resume feedback",
    "resume editing service",
    "resume assessment",
    "resume improvement",
    "resume evaluation",
    "resume proofreading",
    "resume enhancement",
    "resume analysis",
    "resume audit",
    "resume consultation",
  ],
};

export default function Page() {
  return <ReviewPage />;
}
