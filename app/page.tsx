import { LandingNav } from "@/components/LandingNav";
import { Hero } from "@/components/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wibblit Resume Tweaker",
  description:
    "Craft a standout resume with ease using the power of AI. Receive tailored suggestions, optimize your content for specific job roles, and ensure your resume perfectly aligns with job descriptions—designed to accelerate your path to landing your dream job.",
  icons: {
    icon : '/icon.ico'
  }
};

export default async function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto">
        <div className="max-w-7xl w-full">
            <LandingNav />
        </div>
        <Hero />
    </main>
  );
}
