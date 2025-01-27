"use client";

import React from "react";
import { StickyScroll } from "../sticky-scroll-reveal";

const content = [
  {
    title: "A Powerful, Feature Rich Editor",
    description:
      "Use the feature packed editor with AI assist baked into it, tweak anything you like, colors, fonts, templates, order, whatever you want.",
    image: "/screenshots/editor_dark.png",
  },
  {
    title: "Review your resume",
    description:
      "Get detailed, job specific reviews for each resume and each job, craft the perfect resume.",
    image: "/screenshots/review_dark.png",
  },
  {
    title: "Multiple Resume Versions",
    description:
      "Easily create and manage multiple versions of your resume. Tailor each version for different job applications while keeping all your information organized in one place.",
    image: "/screenshots/home_dark.png",
  },
  {
    title: "AI Interview Preparation",
    description:
      "Practice interviews with our AI, tailored to your resume and target job descriptions. Improve your interview skills and confidence before meeting with potential employers.",
    image: "/screenshots/interview_dark.png",
  },
];

export function StickyScrollReveal() {
  return (
    <div className="min-h-screen md:mt-40">
      <StickyScroll content={content} />
    </div>
  );
}
