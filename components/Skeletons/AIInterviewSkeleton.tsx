"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Lightbulb, Loader2 } from "lucide-react";

interface AIInterviewSkeletonProps {
  interviewType?: "comprehensive" | "adaptive" | "interview";
}

export default function AIInterviewSkeleton({
  interviewType = "interview",
}: AIInterviewSkeletonProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  const tips = {
    comprehensive: [
      "Prepare examples for common interview questions",
      "Research the company thoroughly",
      "Practice your responses out loud",
      "Prepare questions for the interviewer",
    ],
    adaptive: [
      "Stay flexible in your responses",
      "Listen carefully to follow-up questions",
      "Be ready to think on your feet",
      "Demonstrate your problem-solving skills",
    ],
    interview: [
      "Prepare examples for common interview questions",
      "Research the company thoroughly",
      "Practice your responses out loud",
      "Prepare questions for the interviewer",
      "Stay flexible in your responses",
      "Listen carefully to follow-up questions",
      "Be ready to think on your feet",
      "Demonstrate your problem-solving skills",
    ],
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTipIndex(
        (prevIndex) => (prevIndex + 1) % tips[interviewType].length
      );
    }, 5000); // Change tip every 5 seconds

    return () => clearInterval(timer);
  }, [interviewType, tips]);

  return (
    <div className="h-screen  overflow-hidden bg-background text-foreground flex flex-col">
      <motion.h1
        className="h-[10%] flex items-center justify-center text-2xl sm:text-3xl md:text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {interviewType.charAt(0).toUpperCase() + interviewType.slice(1)}{" "}
        {interviewType !== "interview" && "Interview"} Simulation
      </motion.h1>

      <div className="h-[80%] flex flex-col justify-between px-4 sm:px-6 md:px-8">
        <motion.div
          className="h-[30.33%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Skeleton className="w-full h-full rounded-lg" />
        </motion.div>

        <motion.div
          className="h-[30.33%] flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Skeleton className="w-full h-full rounded-lg" />
        </motion.div>

        <motion.div
          className="h-[30.33%]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Skeleton className="w-full h-full rounded-lg" />
        </motion.div>
      </div>

      <motion.div
        className="h-[10%] bg-card flex items-center justify-center px-4 sm:px-6 md:px-8 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.p
            key={currentTipIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-sm sm:text-base mb-10 md:mb-0 md:text-md text-center max-w-2xl opacity-25 flex items-center justify-center"
          >
            <Lightbulb className="mr-2 text-yellow-500 " />
            {tips[interviewType][currentTipIndex]}
          </motion.p>
        </AnimatePresence>

        <motion.div
          className="absolute bottom-4 right-4 flex items-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-full shadow-lg"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.3 }}
        >
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm font-medium">Preparing your session...</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
