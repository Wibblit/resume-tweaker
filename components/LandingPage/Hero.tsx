"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackgroundBeams } from "../ui/background-beams";
import { Button } from "../ui/button";
import { ArrowRight, FileText, Star, BarChart, Palette, Sparkles } from "lucide-react";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import { Suspense } from "react";

const resumeImages = [
  "/templates/template1.png",
  "/templates/template2.jpg",
  "/templates/template3.jpg",
];

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % resumeImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTemplates = () => {
    const ele = document.getElementById("templates");
    if (ele) {
      ele.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center antialiased overflow-hidden bg-gradient-to-br from-background via-background/90 to-background/80">
      <div className="container max-w-7xl mx-auto px-4 py-16 mt-10 flex flex-col lg:flex-row items-center justify-between z-10 gap-8">
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
        <motion.div
          className="mt-12 lg:mt-0 perspective-[2000px] relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="relative w-[300px] h-[400px] [transform-style:preserve-3d] animate-slow-spin">
            <AnimatePresence initial={false}>
              <motion.div
                key={currentImage}
                className="absolute inset-0 w-full h-full"
                initial={{ opacity: 0, rotateY: -90, rotateX: -15 }}
                animate={{ opacity: 1, rotateY: 0, rotateX: 0 }}
                exit={{ opacity: 0, rotateY: 90, rotateX: 15 }}
                transition={{ duration: 0.7 }}
                style={{
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 rounded-lg shadow-xl overflow-hidden flex flex-col">
                  <div className="h-20 bg-primary/20 flex items-center px-4">
                    <div className="w-12 h-12 rounded-full bg-primary/30 mr-3 overflow-hidden">
                      <Image
                        src="/placeholder-user.jpeg"
                        alt="Profile"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold">Jessica Lang</h3>
                      <p className="text-xs text-muted-foreground">
                        Registered Nurse
                      </p>
                    </div>
                  </div>
                  <div className="p-4 space-y-3 flex-grow overflow-auto">
                    <div>
                      <h4 className="text-xs font-semibold mb-1">Summary</h4>
                      <p className="text-[10px] text-muted-foreground line-clamp-1">
                        A Registered Nurse with 8 years of experience delivering
                        quality healthcare services to diverse patient
                        populations...
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold mb-1">Experience</h4>
                      <div className="space-y-1">
                        <div>
                          <p className="text-[10px] font-medium">
                            Senior Nurse - City Hospital
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            2018 - Present
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-medium">
                            Registered Nurse - Community Clinic
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            2015 - 2018
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold mb-1">Skills</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px]">Patient Care</span>
                          <div className="w-24 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: "90%" }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px]">
                            Team Collaboration
                          </span>
                          <div className="w-24 h-1.5 bg-primary/20 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-32 -left-8 md:-left-28 w-48 h-32 [transform:rotateX(10deg) rotateY(-10deg)] [transform-style:preserve-3d]">
              <div className="absolute inset-0 bg-zinc-100/30 dark:bg-zinc-700/30 backdrop-blur-md rounded-lg shadow-lg p-4">
                <BarChart className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-semibold mb-1">Skills Analysis</h4>
                <p className="text-xs text-muted-foreground">
                  AI-powered skill assessment and recommendations
                </p>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-48 h-36 [transform:rotateX(-10deg) rotateY(10deg)] [transform-style:preserve-3d]">
              <div className="absolute inset-0 bg-zinc-100/30 dark:bg-zinc-700/30 backdrop-blur-md rounded-lg shadow-lg p-4">
                <Palette className="w-6 h-6 text-primary mb-2" />
                <h4 className="text-sm font-semibold mb-1">Design Templates</h4>
                <p className="text-xs text-muted-foreground">
                  Choose from a variety of professional designs
                </p>
                <div className="flex mt-2 space-x-1">
                  {[
                    "bg-red-500",
                    "bg-blue-500",
                    "bg-green-500",
                    "bg-yellow-500",
                  ].map((color, index) => (
                    <div
                      key={index}
                      className={`w-4 h-4 rounded-full ${color}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="container max-w-7xl mx-auto px-4 mt-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col sm:flex-row gap-8 justify-center lg:justify-start">
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 h-6 w-6" />
            <div className="text-left">
              <h3 className="text-2xl font-bold">38%</h3>
              <p className="text-muted-foreground text-sm">more interviews</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-400 h-6 w-6" />
            <div className="text-left">
              <h3 className="text-2xl font-bold">23%</h3>
              <p className="text-muted-foreground text-sm">
                higher job offer rate
              </p>
            </div>
          </div>
        </div>
        <div className="hidden lg:block w-px h-16 bg-border"></div>
        <div className="text-center lg:text-left">
          <p className="mb-2">Loved by interviewers at</p>
          <div className="flex flex-wrap justify-center lg:justify-start gap-4">
            {[
              "github.com",
              "amazon.com",
              "google.com",
              "facebook.com",
              "tesla.com",
            ].map((url, indx) => (
              <SocialIcon
                key={indx}
                style={{ width: "36px", height: "36px" }}
                url={url}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
      {/* <Suspense fallback="">
        <BackgroundBeams />
      </Suspense> */}
    </div>
  );
}
