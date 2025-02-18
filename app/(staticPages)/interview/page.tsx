import { Metadata } from "next";
import InterviewPage from "@/components/LandingPage/LandingInterviewPage";

export const metadata: Metadata = {
  title: {
    absolute:"ResumeTweaker | AI Interview Preparation Tools"},
  description:
    "Prepare for your next interview with ResumeTweaker's AI-driven interview prep tools. Practice common questions and receive personalized feedback.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/interview",
  },
  keywords: [
    "interview preparation tools",
    "AI interview prep",
    "interview coaching",
    "mock interview service",
    "interview practice",
    "interview questions and answers",
    "interview training",
    "job interview preparation",
    "interview simulator",
    "interview skills training",
    "interview practice questions",
    "interview feedback",
    "interview techniques",
    "interview strategies",
    "interview readiness",
  ],
};
export default function Page(){
  return <InterviewPage/>
}
