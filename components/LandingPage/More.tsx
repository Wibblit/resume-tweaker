"use client";

import React from "react";
import { StickyScroll } from "../ui/sticky-scroll-reveal";
import Image from "next/image";

const content = [
  {
    title: "AI-Powered Resume Editing",
    description:
      "Collaborate with our AI to craft the perfect resume. Get real-time suggestions and improvements as you write, ensuring your resume stands out to potential employers.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-zinc-800 dark:text-zinc-200">
        AI Resume Editing
      </div>
    ),
  },
  {
    title: "Real-time Updates",
    description:
      "See changes instantly as you edit. Our platform provides immediate feedback, allowing you to fine-tune your resume in real-time for maximum impact.",
    content: (
      <div className="h-full w-full flex items-center justify-center">
        <Image
          src="/editor.png"
          width={300}
          height={300}
          className="h-full w-full object-cover"
          alt="Real-time updates demo"
        />
      </div>
    ),
  },
  {
    title: "Multiple Resume Versions",
    description:
      "Easily create and manage multiple versions of your resume. Tailor each version for different job applications while keeping all your information organized in one place.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-zinc-800 dark:text-zinc-200">
        Version Control
      </div>
    ),
  },
  {
    title: "AI Interview Preparation",
    description:
      "Practice interviews with our AI, tailored to your resume and target job descriptions. Improve your interview skills and confidence before meeting with potential employers.",
    content: (
      <div className="h-full w-full flex items-center justify-center text-zinc-800 dark:text-zinc-200">
        AI Interview Prep
      </div>
    ),
  },
];

export function StickyScrollReveal() {
  return (
    <div className="min-h-screen mt-40">
      <StickyScroll content={content} />
    </div>
  );
}