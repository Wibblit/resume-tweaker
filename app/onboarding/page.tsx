import React from "react";
import { auth } from "@/auth";
import Onboarding from "@/components/onboard";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

const OnBoarding = async () => {
  const session = await auth();
  const status = await prisma.user.findUnique({
    where: { id: session?.user.id },
    select: { isOnboarded: true },
  });
  //console.log("onboarding status", status?.isOnboarded)
  if (status?.isOnboarded) {
    return redirect("/home");
  }
  return <Onboarding />;
};

export default OnBoarding;
