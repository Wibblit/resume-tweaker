import VortexDemo from "@/components/about-animation";
import { Metadata } from "next"
export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Resumetweaker. Create professional resumes and cover letters with ResumeTweaker's AI-powered tools. Build and customize your job application documents effortlessly.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/legal/privacy-policy",
  }
};
export default function AboutAnimation() {
    return <div className="mt-20">
        <VortexDemo/>
    </div>
}