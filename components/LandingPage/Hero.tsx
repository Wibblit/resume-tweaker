"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { ArrowRight, FileText, Sparkles } from "lucide-react";
import ResumeAnimation from "./resume-animation";

export function Hero() {
 
  const scrollToTemplates = () => {
    const ele = document.getElementById("templates");
    if (ele) {
      ele.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center antialiased overflow-hidden bg-gradient-to-br from-background via-background/90 to-background/80">
      <div className="container max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row items-center justify-between z-10 gap-8">
        <motion.div
          className="max-w-2xl space-y-8 text-center lg:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center rounded-full border bg-background/50 px-4 py-1.5 text-sm backdrop-blur">
            <Sparkles className="mr-2 h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              AI-Powered Resume Builder
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-[3.3rem] font-bold">
            Elevate Your Career with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              AI-Powered Resumes
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Craft a standout resume with ease using the power of AI. Receive
            tailored suggestions, optimize your content, and land your dream job
            faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button className="group bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              onClick={scrollToTemplates}
              variant="outline"
              className="group"
            >
              View Templates
              <FileText className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </motion.div>
        <ResumeAnimation />
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      {/* <Suspense fallback="">
        <BackgroundBeams />
      </Suspense> */}
    </div>
  );
}
