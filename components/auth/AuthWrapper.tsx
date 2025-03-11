"use client";
import React from "react";
import useSessionMessaging from "./useSessionMessaging";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  useSessionMessaging(); // Handles login and logout messaging

  return <>{children}</>;
};

export default AuthWrapper;
