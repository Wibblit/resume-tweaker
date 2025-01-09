import React from "react";
import { auth } from "@/auth";
import Onboarding from "@/components/onboard";

const OnBoarding = async () => {
  const session = await auth();
  return <Onboarding />;
};

export default OnBoarding;
