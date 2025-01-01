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
    return redirect("/home");
  }

  const faqData = [
    {
      question: "What is Proactic?",
      answer:
        "Proactic is a social media marketing automation tool designed to help businesses streamline their social media efforts.",
    },
    {
      question: "How does Proactic work?",
      answer:
        "Proactic helps you manage and automate your social media presence by providing tools for content scheduling, analytics, and engagement tracking across multiple platforms.",
    },
    {
      question: "Which social media platforms does Proactic support?",
      answer:
        "Proactic supports major social media platforms including Twitter, Facebook, Instagram, LinkedIn, and Pinterest, allowing you to manage all your social media accounts from one dashboard.",
    },
    {
      question: "Can I schedule posts in advance with Proactic?",
      answer:
        "Yes, you can schedule posts in advance across multiple social media platforms. This allows you to plan and organize your content calendar efficiently while maintaining a consistent posting schedule.",
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
