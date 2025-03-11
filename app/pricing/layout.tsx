import Footer from "@/components/LandingPage/Footer";
import { LandingNav } from "@/components/LandingPage/LandingNav";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full items-center justify-center">
      <LandingNav />
      {children}
      <Footer />
    </div>
  );
};

export default layout;
