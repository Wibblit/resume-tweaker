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
import { Check, Sparkles, Star , Sparkle} from "lucide-react";
import { useRouter } from "next/navigation";
import { QuantityDialog } from "@/app/(staticPages)/pricing/QuantityDialog";
import { useSession } from "next-auth/react";
import { GradientText } from "../gradient-text";

const features = [
  "Everything in the free plan",
  "AI to generate & Tweak content",
  "Resume Review",
  "AI Interview"
];
const freePlanFeatures = [
  "Resume editor",
  "Cover letter editor",
  "1 Free resume slot",
  "1 Free cover letter slot",
  "All Resume templates free",
  "All Cover Letter templates free",
  "Unlimited downloads"
]
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
      price: "$1.8",
      popular: false,
      productId: "pdt_gsNpgeKNizV1AeiZrGsaX",
    },
    {
      name: "Essential",
      baseCredits: 400,
      price: "$4.8",
      popular: true,
      productId: "pdt_L8BbmP4uUpQZgzVmYO2aU",
    },
    {
      name: "Power",
      baseCredits: 1000,
      price: "$9.6",
      popular: false,
      productId: "pdt_XNk13NQTdOsnpO3PyirKL",
    },
    {
      name: "Super Saver",
      baseCredits: 2000,
      price: "$18",
      popular: false,
      productId: "pdt_Ei4A7ub9Ng6238xLpi33h",
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
        `https://checkout.dodopayments.com/buy/${selectedPlan.productId}?quantity=${newQuantity}&redirect_url=https://resumetweaker.wibblit.com/profile&email=${session?.user.email}&metadata_user_id=${session?.user.id}&metadata_packname=${selectedPlan.name}&metadata_credits=${selectedPlan.baseCredits}&disableEmail=true`
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
            <GradientText>Simple, Transparent Pricing, No Subscriptions</GradientText>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            There are <span className="text-primary font-semibold"> no recurring payments</span>. Pay once, use forever <span className="text-primary font-semibold">(credits never expire)</span>. All plans include{" "}
            <span className="text-primary font-semibold">full access</span> to
            our AI-powered tools. We accept{" "}
            <span className="text-primary font-semibold">100+</span> currencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="md:hidden">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free Plan</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              <div className="mb-6">
                <div className="text-left">
                  <span className="text-3xl font-bold">$0</span>
                </div>
              </div>

              <div className="space-y-3">
                {freePlanFeatures.map((feature) => (
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
                    return router.push("/login");
                  }
                }}
                variant={"silver"}
              >
                Get Started
              </Button>
            </CardFooter>
          </Card>
          <Card className="md:col-span-2 flex-col justify-between hidden md:flex">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-2xl">
                <span>Free Plan</span>
                <Sparkles className="w-5 h-5 text-primary" />
              </CardTitle>
            </CardHeader>
            <CardContent className="mb-2 lg:mb-4">
              <div className="flex justify-between ">
                <div className="flex flex-col gap-3">
                  {freePlanFeatures.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-baseline ">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="h-full w-1 bg-border"></div>
                <div className="flex flex-col justify-between items-center">
                  <span className="text-9xl font-bold">$0</span>
                  <Button variant="silver" className=" md:px-16 py-2" 
                  onClick={() => {
                  if (!session) {
                    return router.push("/login");
                  }
                }}>Get Started</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col pb-4 ${plan.popular ? "border-primary shadow-lg scale-105" : ""
                }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className=" text-sm font-medium md:px-3 px-2 py-1 rounded-full flex items-center gap-1 bg-gradient-to-br text-primary-foreground from-zinc-800/80 via-zinc-500/80 to-zinc-800/80 dark:from-zinc-400/80 dark:via-zinc-200 dark:to-zinc-400/80 transition-all duration-500 easeInOut shadow-lg hover:shadow-xl">
                    <Star className="w-4 h-4 fill-background" />{" "}
                    <span className="text-nowrap">Most Popular</span>
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
                  <div className="flex items-baseline md:items-start lg:items-baseline justify-between gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span>{plan.baseCredits} credits</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                      <Sparkle className="w-4 h-4 text-primary fill-primary" />
                      <span className="text-sm">{plan.baseCredits} Credits that never expire</span>
                    </div>
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    if (!session) {
                      return router.push("/login");
                    }
                    handleGetStarted(plan);
                  }}
                  variant={plan.popular ? "silver" : "outline"}
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
