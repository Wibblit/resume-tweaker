"use client";

import React from "react";
import { StickyScroll } from "../sticky-scroll-reveal";

const content = [
  {
    title: "A Powerful, Feature Rich Editor",
    description:
      "Use the feature packed editor with AI assist baked into it, tweak anything you like, colors, fonts, templates, order, whatever you want.",
    image_dark:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/editor_dark.webp",
    image_light:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/editor_light.webp",
  },
  {
    title: "Review your resume",
    description:
      "Get detailed, job specific reviews for each resume and each job, craft the perfect resume.",
    image_dark:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/review_dark.webp",
    image_light:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/review_light.webp",
  },
  {
    title: "Multiple Resume Versions",
    description:
      "Easily create and manage multiple versions of your resume. Tailor each version for different job applications while keeping all your information organized in one place.",
    image_dark:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/home_dark.webp",
    image_light:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/home_light.webp",
  },
  {
    title: "AI Interview Preparation",
    description:
      "Practice interviews with our AI, tailored to your resume and target job descriptions. Improve your interview skills and confidence before meeting with potential employers.",
    image_dark:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/interview_dark.webp",
    image_light:
      "https://cdnresumetweaker.contact-wibblit.workers.dev/static-images/interview_light.webp",
  },
];

export function StickyScrollReveal() {
  return (
    <div className="min-h-screen md:mt-40">
      <StickyScroll content={content} />
    </div>
  );
}
