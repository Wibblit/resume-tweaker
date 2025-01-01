import Pricing from "@/components/LandingPage/Pricing";
import { auth } from "@/auth";
import GetStartedSection from "@/components/LandingPage/GetStartedSection";
import FAQAccordion from "@/components/faq-accordian";
import { PricingBreakdown } from "@/components/credit-bundle-breakdown";

export default async function PricingPage() {
  const session = await auth();
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
