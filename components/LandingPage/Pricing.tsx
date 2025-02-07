"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { QuantityDialog } from "@/app/(staticPages)/pricing/QuantityDialog";
import { useSession } from "next-auth/react";
import { GradientText } from "../gradient-text";

const features = [
  "AI Resume Editor",
  "AI Cover Letter Editor",
  "AI Resume Review",
  "JD-Tailored Review",
  "Comprehensive AI Interview",
  "Adaptive Interview Practice",
];

interface Plan {
  name: string;
  baseCredits: number;
  price: string;
  popular: boolean;
  productId: string;
}

export default function Pricing() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();

  const plans: Plan[] = [
    {
      name: "Starter",
      baseCredits: 200,
      price: "299",
      popular: false,
      productId: "pdt_DyYl9HeGUDa1yPqwLnx4Q",
    },
    {
      name: "Essential",
      baseCredits: 400,
      price: "458",
      popular: true,
      productId: "pdt_xDPkyF0HvKOsJ0TsWVQ90",
    },
    {
      name: "Power",
      baseCredits: 1000,
      price: " ",
      popular: false,
      productId: "",
    },
    {
      name: "Super Saver",
      baseCredits: 2000,
      price: " ",
      popular: false,
      productId: "",
    },
  ];

  const handleGetStarted = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleConfirmQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (selectedPlan) {
      router.push(
        `https://test.checkout.dodopayments.com/buy/${selectedPlan.productId}?quantity=${newQuantity}&redirect_url=https://resume-tweaker-development.vercel.app/profile&email=${session?.user.email}&metadata_user_id=${session?.user.id}&metadata_packname=${selectedPlan.name}&metadata_credits=${selectedPlan.baseCredits}&disableEmail=true`
      );
    }
  };

  const calculateTotalCredits = (plan: Plan) => {
    return plan.baseCredits;
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            <GradientText>
              Simple, Transparent Pricing
            </GradientText>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your career growth. All plans include
            {" "}
            <span className="text-primary font-semibold">
              full access
            </span> to our AI-powered tools. We accept {" "}
            <span className="text-primary font-semibold">
              100+
            </span> currencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col pb-4 ${plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium md:px-3 px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-background" /> <span className="text-nowrap">Most Popular</span>
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
                    <span className="text-3xl font-bold">{plan.price}</span>
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
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!session) {
                      return router.push("/login")
                    }
                    handleGetStarted(plan)
                  }}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <QuantityDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmQuantity}
            title={`Purchase ${selectedPlan.name} Credits`}
            description={`Each ${selectedPlan.name
              } pack contains ${selectedPlan.baseCredits.toLocaleString()} credits.`}
            initialQuantity={1}
            maxQuantity={10}
            baseCredits={selectedPlan.baseCredits}
          />
        )}
      </div>
    </div>
  );
}
