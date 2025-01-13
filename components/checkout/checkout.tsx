"use client";

import { CheckoutGradients } from "@/components/gradients/checkout-gradients";
import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { CheckoutContents } from "@/components/checkout/checkout-contents";
import { auth } from "@/auth";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout({
  email,
  priceID,
}: {
  email: string;
  priceID: string;
}) {
  console.log(email);

  return (
    <div className={"w-full min-h-screen relative overflow-hidden"}>
      <CheckoutGradients />
      <div
        className={
          "mx-auto max-w-6xl relative px-[16px] md:px-[32px] py-[24px] flex flex-col gap-6 justify-between"
        }
      >
        <CheckoutHeader />
        <CheckoutContents  priceId={priceID} userEmail={email} />
      </div>
    </div>
  );
}
