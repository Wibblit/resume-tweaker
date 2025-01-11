import React from "react";
import { auth } from "@/auth";
import Onboarding from "@/components/onboard";
import { redirect } from "next/navigation";

const OnBoarding = async () => {
  const session = await auth();
  if (!session?.isNewUser) redirect("/home");
  return <Onboarding />;
};

export default OnBoarding;
