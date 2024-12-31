"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { createOrder } from "@/actions/razorpay";
import { verifyPayment } from "@/actions/razorpay";
import { useToast } from "@/hooks/use-toast";


const OrderSummaryPage = () => {
  const router = useRouter();
  const [loading, startTransition] = useTransition();
  const { toast } = useToast();
  const handleBuy = async ({ tier }: { tier: string }) => {
    startTransition(async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = async () => {
        //create order;
        const result = await createOrder({ tier: tier });
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
          name: "Payment Gateways Demo",
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
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    });
  };

  return <div>OrderSummaryPage</div>;
};

export default OrderSummaryPage;
