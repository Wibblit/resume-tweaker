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
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import FAQAccordion from "@/components/faq-accordian";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Wibblit ResumeTweaker",
  description:
    "Craft a standout resume with ease using the power of AI. Receive tailored suggestions, optimize your content for specific job roles, and ensure your resume perfectly aligns with job descriptions—designed to accelerate your path to landing your dream job.",
  icons: {
    icon: "/icon.ico",
  },
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    // return redirect("/home");
  }

  const faqData = [
    {
      question: "1. What is ResumeTweaker, and how does it work?",
      answer:"ResumeTweaker is an AI-powered tool designed to help you create, improve, and optimize your resumes and cover letters. Simply upload your existing resume or provide details about your skills and job history, and ResumeTweaker will generate professional, ATS-friendly documents tailored to your desired job. "
    },
    {
      question: "2. Can ResumeTweaker review my resume for specific job applications?",
      answer:
        "Yes! ResumeTweaker analyzes job descriptions and matches them to your resume, offering tailored suggestions to highlight relevant skills and experience. This ensures your resume aligns with the requirements of the specific job you're applying for.",
    },
    {
      question: "3. Is ResumeTweaker suitable for all career levels?",
      answer:
        "Absolutely. Whether you're a recent graduate, a mid-level professional, or an experienced executive, ResumeTweaker offers customizable templates and AI-driven insights to meet your unique career needs.",
    },
    {
      question: "4. How secure is my data with ResumeTweaker?",
      answer:
        "Your privacy is our priority. All uploaded resumes and data are encrypted and processed securely. We never share your information without your consent and delete your data after processing to ensure confidentiality.",
    },
  ];

  return (
    <main className="relative flex justify-center items-center flex-col mx-auto">
      <div className="w-full">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <LandingNav />
        </div>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Hero />
        </section>
        <section className="py-20 sm:py-24" id="templates">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <TemplatesSection />
          </div>
        </section>
        <section className="py-8 sm:py-24" id="features">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FeaturesSection />
          </div>
        </section>
        <div className="h-60"></div>
        <section id="moreFeatures">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <StickyScrollReveal />
          </div>
        </section>
        <section className="py-8 sm:py-24 w-full" id="pricing">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Pricing />
            <div className="text-center -mt-6">
              <p className="text-muted-foreground">
                Curious about how credits work?{" "}
                <Link className="p-0" href={"/pricing"}>
                  <Button variant="link" className="text-primary">
                    Learn more
                  </Button>
                </Link>
              </p>
            </div>
          </div>
        </section>
        <section className="py-8 sm:py-24" id="getstarted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <FAQAccordion faqData={faqData} />
          </div>
        </section>
        <section className="py-8 sm:py-24" id="getstarted">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <GetStartedSection />
          </div>
        </section>
        <section className="w-full" id="footer">
          <hr />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Footer />
          </div>
        </section>
      </div>
    </main>
  );
}