import { Metadata } from "next"
import EditorPage from "@/components/editor/editorPage"

export const metadata: Metadata = {
  title: "ResumeTweaker | AI Resume and Cover Letter Builder",
  description:
    "Create professional resumes and cover letters with ResumeTweaker's AI-powered tools. Build and customize your job application documents effortlessly.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/editor",
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
