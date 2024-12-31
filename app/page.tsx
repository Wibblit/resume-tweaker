import { LandingNav } from "@/components/LandingPage/LandingNav";
import { Hero } from "@/components/LandingPage/Hero";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { TemplatesSection } from "@/components/LandingPage/Templates";
import { FeaturesSection } from "@/components/LandingPage/Features";
import { StickyScrollReveal } from "@/components/LandingPage/More";
import Pricing from "@/components/LandingPage/Pricing";
import GetStartedSection from "@/components/LandingPage/GetStartedSection";
import Footer from "@/components/LandingPage/Footer";
import {redirect} from "next/navigation"

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

  if (session?.user) {
    return redirect("/home")
  }

  return (
    <main className="relative flex justify-center items-center flex-col mx-auto">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LandingNav />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
        </div>
        <div className="py-20 sm:py-24" id="templates">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TemplatesSection />
          </div>
        </div>
        <div className="py-8 sm:py-24" id="features">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturesSection />
          </div>
        </div>
        <div className="h-60"></div>
        <div id="moreFeatures">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <StickyScrollReveal />
          </div>
        </div>
        <div className="py-8 sm:py-24 w-full" id="pricing">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Pricing />
          </div>
        </div>
        <div className="py-8 sm:py-24" id="getstarted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <GetStartedSection />
          </div>
        </div>
        <div className="w-full" id="footer">
          <hr />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Footer />
          </div>
        </div>
      </div>
    </main>
  );
}