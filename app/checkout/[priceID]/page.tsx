import { auth } from "@/auth";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Checkout from "@/components/checkout/checkout";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: { priceID: string };
}) {
  const { priceID } = params;
  console.log(priceID)
  const session = await auth();

  if (!session || !session?.user) {
    return redirect("/login");
  }

  const { email} = session?.user;

  console.log(session.user);

  return <Checkout priceID={priceID} email={email} />;
}
