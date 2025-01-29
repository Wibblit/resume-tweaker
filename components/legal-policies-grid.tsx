import React from "react"
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid"
import { MdPrivacyTip, MdGavel, MdAssignmentReturn, MdCookie } from "react-icons/md"

export default function LegalPoliciesGrid() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Legal</h1>
      <BentoGrid>
        {items.map((item, i) => (
          <BentoGridItem key={i} title={item.title} description={item.description} icon={item.icon} className="bg-card" link={item.link} />
        ))}
      </BentoGrid>
    </div>
  )
}

const items = [
  {
    title: "Privacy Policy",
    description: "Learn how we collect, use, and protect your personal information.",
    icon: <MdPrivacyTip className="h-6 w-6 text-foreground" />,
    link: "/legal/privacy-policy"
  },
  {
    title: "Terms of Service",
    description: "Understand the rules and regulations governing the use of our services.",
    icon: <MdGavel className="h-6 w-6 text-foreground" />,
    link: "/legal/terms-of-service"
  },
  {
    title: "Refund Policy",
    description: "Find out about our refund process and eligible circumstances.",
    icon: <MdAssignmentReturn className="h-6 w-6 text-foreground" />,
    link: "/legal/refund-policy"
  },
  {
    title: "Cookie Policy",
    description: "Discover how we use cookies and similar technologies on our website.",
    icon: <MdCookie className="h-6 w-6 text-foregound" />,
    link: "/legal/cookie-policy"

  },
]

