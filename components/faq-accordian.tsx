"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQAccordion({
  faqData,
}: {
  faqData: { question: string; answer: string }[];
}) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <h2 className="text-4xl font-bold text-center mb-8 text-foreground">
        Frequently asked questions
      </h2>
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqData.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border rounded-lg bg-card px-6"
          >
            <AccordionTrigger className="text-lg font-medium text-card-foreground hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
