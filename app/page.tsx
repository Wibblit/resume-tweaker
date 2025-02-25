import { Hero } from "@/components/LandingPage/Hero";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { FeaturesSection } from "@/components/LandingPage/Features";
import { StickyScrollReveal } from "@/components/LandingPage/More";
import Pricing from "@/components/LandingPage/Pricing";
import GetStartedSection from "@/components/LandingPage/GetStartedSection";
import { Button } from "@/components/ui/button";
import FAQAccordion from "@/components/faq-accordian";
import Link from "next/link";
import { ImageMarquee } from "@/components/ui/marquee";
import Footer from "@/components/LandingPage/Footer";
import { LandingNav } from "@/components/LandingPage/LandingNav";
import { redirect } from "next/navigation";


export const metadata: Metadata = {
  title: "ResumeTweaker | AI Resume, Cover Letter, Review & Interview Prep",
  description:
    "Optimize your job search with AI-powered resume building and reviews, cover letter building, and interview prep. Get professional tools for every step of your application process with ResumeTweaker",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com",
  },
  keywords: [
    "AI resume builder",
    "resume maker",
    "AI resume review",
    "AI resume analysis",
    "AI Interviw",
    "resume optimizer",
    "resumetweaker",
    "job search tools",
    "resume templates",
    "resume tweaking",
    "AI resume writing",
    "career tools",
    "wibblit",
    "resumetweaker",
    "resume tweaker",
    "ai interview prep",
    "interview preparation"
  ],
};

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    return redirect("/home");
  }

  const faqData = [
    {
      question: "What is the best AI tool for interview preparation?",
      answer: "ResumeTweaker's AI-powered interview tool helps you prepare with voice-based mock interviews, real-time feedback, and adaptive question flows tailored to your target job role."
    },
    {
      question: "Can AI help me review my interview performance?",
      answer: "Yes! ResumeTweaker analyzes your interview responses, evaluates clarity, tone, and key content, and offers personalized tips to improve your chances of success."
    },
    {
      question: "How does ResumeTweaker's credit-based pricing work?",
      answer: "ResumeTweaker uses a transparent credit-based system. You only pay for what you use — whether that’s resume building, cover letter generation, or interview practice. No hidden fees!"
    },
    {
      question: "Is my data safe with ResumeTweaker?",
      answer: "Absolutely. ResumeTweaker uses secure encryption and never stores your personal data without consent. Your documents are yours, and privacy is our priority."
    },
    {
      question: "Can AI help me write a strong resume?",
      answer: "Definitely! ResumeTweaker’s AI crafts resumes tailored to your skills and job goals, optimizes for ATS scans, and suggests improvements to maximize impact."
    },
    {
      question: "How do I write a cover letter that stands out?",
      answer: "ResumeTweaker helps you write compelling cover letters by highlighting your achievements, aligning with the job description, and structuring everything professionally."
    }
  ];
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <>
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <LandingNav/>
    <main className="relative flex justify-center items-center flex-col mx-auto">
      <div className="w-full">
        <div className="bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] 
        bg-[size:6rem_4rem]
        [mask-image:linear-gradient(to_bottom,black_80%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_500px,#fff,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_500px,#000,transparent)]"></div>
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 ">
          
          <Hero />
        </section>
        <section className="py-20 sm:py-24" id="templates">
          <div className=" mx-auto px-0 sm:px-0 lg:px-8">
            <ImageMarquee />
          </div>
        </section>
        </div>
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
       {/* <JoinHero /> */}
      </div>
    </main>
    <Footer/>
    </>
  );
}