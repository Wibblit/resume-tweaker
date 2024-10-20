"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const tiers = [
  {
    name: "Hobby",
    price: "$0",
    description: "For individuals trying out the product",
    features: [
      "Access to all tools for 14 days",
      "No credit card required",
      "Community Support",
      "Access to Aceternity UI",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$20",
    description: "For serious founders",
    features: [
      "Everything in Hobby +",
      "Access to Proactiv AI",
      "Priority tools access",
      "Support for Slack and Twitter",
      "Priority support",
      "99.67% Uptime SLA",
      "Access to Aceternity UI Templates",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$30",
    description: "For small to large businesses",
    features: [
      "Everything in Starter +",
      "Access to our dev team",
      "Coffee with the CEO",
      "Access to Aceternity UI",
      "Request tools",
      "Advanced analytics",
      "Customizable dashboards",
      "24/7 customer support",
      "Unlimited data storage",
      "Enhanced security features",
    ],
    cta: "Get Started",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "Custom",
    description: "For large scale businesses",
    features: [
      "Everything in Pro +",
      "HIPAA and SOC2 compliance",
      "Bulk email support",
      "Customizable dashboards",
      "24/7 customer support",
    ],
    cta: "Book a demo",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <div className="md:pt-12 w-full">
      <div className="w-full text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl bg-clip-text text-center text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
          Simple Pricing
        </h2>
        <p className="mt-4 text-xl text-muted-foreground">
          Choose the perfect plan for your needs. No hidden fees, just straightforward value.
        </p>
      </div>
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`h-full flex flex-col rounded-none ${
                  tier.highlighted
                    ? "bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent"
                    : "bg-background sm:border-0"
                } min-h-[600px] sm:min-h-0`}
              >
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {tier.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-4xl font-bold mb-2">
                    {tier.price}
                    <span className="text-lg font-normal"> / month</span>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {tier.description}
                  </p>
                  <ul className="space-y-2">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-primary mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      tier.highlighted
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }`}
                    variant={tier.highlighted ? "default" : "outline"}
                  >
                    {tier.cta}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}