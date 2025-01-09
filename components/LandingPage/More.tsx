"use client";

import React from "react";
import { StickyScroll } from "../sticky-scroll-reveal";

const content = [
  {
    title: "AI-Powered Resume Editing",
    description:
      "Collaborate with our AI to craft the perfect resume. Get real-time suggestions and improvements as you write, ensuring your resume stands out to potential employers.",
    image: "/editor.png",
  },
  {
    title: "Real-time Updates",
    description:
      "See changes instantly as you edit. Our platform provides immediate feedback, allowing you to fine-tune your resume in real-time for maximum impact.",
    image: "/analysis.png",
  },
  {
    title: "Multiple Resume Versions",
    description:
      "Easily create and manage multiple versions of your resume. Tailor each version for different job applications while keeping all your information organized in one place.",
    image: "/home.png",
  },
  {
    title: "AI Interview Preparation",
    description:
      "Practice interviews with our AI, tailored to your resume and target job descriptions. Improve your interview skills and confidence before meeting with potential employers.",
    image: "/interview.png",
  },
];

export function StickyScrollReveal() {
  return (
    <div className="min-h-screen md:mt-40">
      <StickyScroll content={content} />
    </div>
  );
}
