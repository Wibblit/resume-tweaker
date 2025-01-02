import Pricing from "@/components/LandingPage/Pricing";
import { auth } from "@/auth";
import GetStartedSection from "@/components/LandingPage/GetStartedSection";
import FAQAccordion from "@/components/faq-accordian";
import { PricingBreakdown } from "@/components/credit-bundle-breakdown";

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
    <div className="w-full items-center justify-center">
      <section>
        <Pricing />
      </section>
      <section className="py-8 sm:pt-12 w-full" id="pricing">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <PricingBreakdown />
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
