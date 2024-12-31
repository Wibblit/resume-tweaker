"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, Star } from "lucide-react";

const features = [
  "AI Resume Editor",
  "AI Cover Letter Editor",
  "AI Resume Review",
  "JD-Tailored Review",
  "Comprehensive AI Interview",
  "Adaptive Interview Practice",
];

const pricingPlans = [
  {
    name: "Starter",
    credits: 200,
    price: 229,
    originalPrice: 299,
    gatewayFee: 7.58,
    tax: 41.22,
    effectivePrice: 180.2,
    popular: false,
  },
  {
    name: "Essentail",
    credits: 400,
    price: 458,
    originalPrice: 599,
    gatewayFee: 12.16,
    tax: 82.44,
    effectivePrice: 363.4,
    popular: true,
  },
  {
    name: "Power",
    credits: 1000,
    price: 1145,
    originalPrice: 1499,
    gatewayFee: 25.9,
    tax: 206.1,
    effectivePrice: 913,
    popular: false,
  },
  {
    name: "Super saver",
    credits: 2000,
    price: 2290,
    originalPrice: 2999,
    gatewayFee: 48.8,
    tax: 412.2,
    effectivePrice: 1829,
    popular: false,
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your career growth. All plans include
            full access to our AI-powered tools and are <span className="text-primary font-semibold">inclusive of all taxes</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <Sparkles className="w-5 h-5 text-primary" />
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground line-through text-sm">
                      ₹{plan.originalPrice}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.credits} Credits
                  </div>
                </div>

                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Gateway Fee:</span>
                    <span>₹{plan.gatewayFee}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Tax (18%):</span>
                    <span>₹{plan.tax}</span>
                  </div>
                  <div className="flex justify-between mt-2 font-medium text-foreground">
                    <span>Effective Price:</span>
                    <span>₹{plan.effectivePrice}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground">
            Need a custom plan?{" "}
            <Button variant="link" className="text-primary">
              Contact us
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
}
