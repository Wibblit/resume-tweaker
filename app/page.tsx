import { LandingNav } from "@/components/LandingNav";
import { Hero } from "@/components/LandingPage/Hero";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { TemplatesSection } from "@/components/LandingPage/Templates";
import { FeaturesSection } from "@/components/LandingPage/Features";
import { StickyScrollReveal } from "@/components/LandingPage/More";
import Pricing from "@/components/LandingPage/Pricing";
import GetStartedSection from "@/components/LandingPage/GetStartedSection";
import Footer from "@/components/LandingPage/Footer";

export const metadata: Metadata = {
  title: "Wibblit Resume Tweaker",
  description:
    "Craft a standout resume with ease using the power of AI. Receive tailored suggestions, optimize your content for specific job roles, and ensure your resume perfectly aligns with job descriptions—designed to accelerate your path to landing your dream job.",
  icons: {
    icon: "/icon.ico",
  },
};

export default async function Home() {
  const session = await auth();
  return (
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto">
      <div className="w-full">
        <LandingNav />
        <Hero />
        <div className="py-24" id="templates">
          <TemplatesSection />
        </div>
        <div className="py-24" id="features">
          <FeaturesSection />
        </div>
        <div id="moreFeatures">
          <StickyScrollReveal />
        </div>
        <div className="py-24 w-full" id="pricing">
          <Pricing />
        </div>
        <div className="py-24">
          <GetStartedSection />
        </div>
        <div className="w-full">
          <Footer />
        </div>
      </div>
    </main>
  );
}