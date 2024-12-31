"use client";

import React from "react";
import { useTransition } from "react";
import { createOrder } from "@/actions/razorpay";
import { verifyPayment } from "@/actions/razorpay";
import { useToast } from "@/hooks/use-toast";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CreditCard,
  Shield,
  CheckCircle2,
  ArrowLeft,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { pricingPlans } from "@/data/payments";
import Image from "next/image";
import Paymentsofferings from "../paymentsofferings";

export default function PricingTierPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<"other" | "wallet">(
    "other"
  );

  const plan = pricingPlans.find(
    (tier) => tier.name === decodeURIComponent(params.tier as string)
  );

  if (!plan) {
    return <div>Plan not found</div>;
  }
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();

  const razorpayBuy: any = async () => {
    startTransition(async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = async () => {
        //create order;
        const result = await createOrder({
          tier: params.tier,
          paymentMethod: selectedPayment,
        });
        console.log("OrderId", result);
        const { orderId } = result.response;

        if (!result.success) {
          alert("Error creating orders");
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: 1,
          currency: "USD",
          name: plan.name + " pack",
          // image: `${process.env.NEXT_PUBLIC_BASE_URL} `,
          order_id: orderId,
          handler: async function (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) {
            const result = await verifyPayment(response);
            if (!result.success) {
              toast({
                title: "Error",
                description: "Payment failed please try again!",
                variant: "destructive",
              });
              return;
            }
            router.push("/home");
          },
          prefill: {
            name: "Payment Gateways Demo",
            email: "vanamuthuvana22@gmail.com",
            contact: "9741817837",
          },
          method: {
            wallet: ["paypal"],
          },
          theme: {
            color: "#000000",
          },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    });
  };

  const handlePayment = () => {
    // Implement payment logic here
    console.log(
      `Processing ${selectedPayment} payment for ${params.tier} plan`
    );

    razorpayBuy();
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 mt-8 md:mt-0 flex items-center justify-center flex-col">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-8" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Plans
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
              <CardDescription>
                {plan.credits} Credits -{" "}
                {decodeURIComponent(params.tier as string)} Plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Effective Price</span>
                  <span>₹{plan.effectivePrice}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Gateway Fee</span>
                  <span>₹{plan.gatewayFee}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax (18%)</span>
                  <span>₹{plan.tax}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <div className="text-right">
                    <div>₹{plan.price}</div>
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{plan.originalPrice}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Choose Payment Method</h2>

            <Card
              className={`cursor-pointer transition-all ${
                selectedPayment === "other"
                  ? "border-primary shadow-md"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedPayment("other")}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CreditCard className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">
                    Pay with Card, UPI, Netbanking and paylater
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Secure payment via Razorpay
                  </p>
                </div>
                {selectedPayment === "other" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </CardContent>
            </Card>

            <Card
              className={`cursor-pointer transition-all ${
                selectedPayment === "wallet"
                  ? "border-primary shadow-md"
                  : "hover:border-primary/50"
              }`}
              onClick={() => setSelectedPayment("wallet")}
            >
              <CardContent className="flex items-center gap-4 p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium">
                    Pay with Wallet {"(e.g, PayPal)"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fast and secure payment
                  </p>
                </div>
                {selectedPayment === "wallet" && (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                )}
              </CardContent>
            </Card>

            <Button className="w-full h-12 mt-6" onClick={handlePayment}>
              <Shield className="w-4 h-4 mr-2" />
              Pay Securely
            </Button>

            <p className="text-sm text-muted-foreground text-center mt-4">
              Your payment is secured with industry-standard encryption
            </p>
          </div>
        </div>
      </div>
     <Paymentsofferings />
    </div>
  );
}
