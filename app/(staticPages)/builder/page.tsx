import { Metadata } from "next"
import EditorPage from "@/components/LandingPage/LandingEditorPage"

export const metadata: Metadata = {
  title: {
    absolute:"ResumeTweaker | AI Resume and Cover Letter Builder"},
  description:
    "Create a standout resume and cover letter with ResumeTweaker's AI tools. Build, optimize, and download ATS-friendly CVs as PDFs — free and mobile-friendly.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/builder",
  },
  keywords: [
    "AI resume builder",
    "cover letter builder",
    "resume maker",
    "professional resume writing",
    "resume customization tools",
    "cover letter writing service",
    "job application documents",
    "resume builder online",
    "cover letter templates",
    "AI resume writing",
    "resume builder software",
    "cover letter generator",
    "resume builder tool",
    "cover letter builder online",
    "resume builder for job seekers",
  ],
};
export default function Page(){
  return <EditorPage/>
}
