import Pricing from "@/components/LandingPage/Pricing";
import { auth } from "@/auth";
import GetStartedSection from "@/components/LandingPage/GetStartedSection";
import FAQAccordion from "@/components/faq-accordian";
import PresetVisualCard from "@/components/PresetVisualiserCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute:
      "ResumeTweaker Pricing | Affordable Resume and Interview Services",
  },
  description:
    "Discover ResumeTweaker's affordable pricing plans for resume building, cover letter writing, and interview preparation services.",
  alternates: {
    canonical: "https://resumetweaker.vercel.app/pricing",
  },
  keywords: [
    "resume building pricing",
    "cover letter writing cost",
    "interview preparation pricing",
    "affordable resume services",
    "resume writing packages",
    "resume builder subscription",
    "cover letter service cost",
    "interview coaching fees",
    "resume service pricing",
    "resume builder pricing",
    "resume writing rates",
    "cover letter builder pricing",
    "interview prep packages",
    "resume service plans",
    "resume writing deals",
  ],
};

export default async function PricingPage() {
  const session = await auth();
  const faqData = [
    {
      question: "1. How does ResumeTweaker's pricing work?",
      answer:
        "Our pricing is transparent and simple. Instead of monthly subscriptions, you purchase credits that can be used for any paid feature, such as resume reviews, AI-enhanced text, and interview prep. You only pay for what you need, giving you complete flexibility.",
    },
    {
      question: "2. What credit bundles are available?",
      answer:
        "You can choose from four credit bundles: 200, 500, 1000, and 2000 credits. This variety ensures you can find a bundle that fits your needs and budget.",
    },
    {
      question: "3. Can I use my credits however I want?",
      answer:
        "Yes! ResumeTweaker gives you the freedom to spend your credits on any feature. Whether you need a quick resume review or multiple interview prep sessions, you decide how to allocate your credits.",
    },
    {
      question: "4. Do I need to commit to a subscription?",
      answer:
        "No subscriptions are required. With ResumeTweaker, there’s no long-term commitment. You simply purchase credits as needed, making it a hassle-free and budget-friendly option.",
    },
  ];

  return (
    <div className="w-full my-10 items-center justify-center">
      <div
        className=" bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] 
        dark:bg-[linear-gradient(to_right,#1c1c1c_1px,transparent_1px),linear-gradient(to_bottom,#1c1c1c_1px,transparent_1px)] 
        bg-[size:6rem_4rem]
        [mask-image:linear-gradient(to_bottom,black_95%,transparent)]
        [-webkit-mask-image:linear-gradient(to_bottom,black_95%,transparent)]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_50%_200px,#fff,transparent)] dark:bg-[radial-gradient(circle_500px_at_50%_200px,#000,transparent)] -z-20"></div>
        <section>
          <Pricing />
        </section>
      </div>
      <section className="py-8 sm:pt-12 w-full" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PresetVisualCard />
        </div>
      </section>
      <section className="py-8 sm:pt-12 w-full" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <FAQAccordion faqData={faqData} />
        </div>
      </section>
      <section className="py-8 sm:py-24" id="getstarted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <GetStartedSection />
        </div>
      </section>
    </div>
  );
}
