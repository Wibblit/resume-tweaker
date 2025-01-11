'use client'

import { CheckoutGradients } from "@/components/gradients/checkout-gradients";
import "../../../styles/checkout.css";
import { CheckoutHeader } from "@/components/checkout/checkout-header";
import { CheckoutContents } from "@/components/checkout/checkout-contents";
import { auth } from "@/auth";
// import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

export default async function CheckoutPage() {
//   const session = await auth();
//   const router = useRouter();
//   if (!session) {
//     return router.push("/login");
//   }

//   console.log(session);

  //   const { email } = await session?.user;
  
  const { priceID } = useParams<{priceID : string}>()
  return (
    <div className={"w-full min-h-screen relative overflow-hidden"}>
      <CheckoutGradients />
      <div
        className={
          "mx-auto max-w-6xl relative px-[16px] md:px-[32px] py-[24px] flex flex-col gap-6 justify-between"
        }
      >
        <CheckoutHeader />
        <CheckoutContents priceId={priceID} userEmail={"vanamuthuvana22@gmail.com"} />
      </div>
    </div>
  );
}
