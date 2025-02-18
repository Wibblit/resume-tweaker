import { Metadata } from "next";
import ReviewPage from "@/components/LandingPage/LandingReviewPage";

export const metadata: Metadata = {
  title: {
    absolute:"ResumeTweaker | AI Powered Resume Review"},
  description:
    "Enhance your resume with ResumeTweaker's AI powered review services. Receive detailed feedback and optimization tips to improve your job prospects.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/review",
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


export default function Page(){
  return <ReviewPage/>
}
