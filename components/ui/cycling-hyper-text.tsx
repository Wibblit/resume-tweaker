"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { HyperText } from "./hyper-text";

const words = ["DREAMERS", "BUILDERS", "LEARNERS", "WIBBLIT."];

export function CyclingHyperText({ startDelay = 0 }) {
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const visibilityTimer = setTimeout(() => setIsVisible(true), startDelay);
    return () => clearTimeout(visibilityTimer);
  }, [startDelay]);

  useEffect(() => {
    if (!isVisible) return;

    const cycleWords = () => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    };

    const initialDelay = setTimeout(() => {
      cycleWords();
      intervalRef.current = setInterval(cycleWords, 3000);
    }, 2000);

    return () => {
      clearTimeout(initialDelay);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isVisible]);

  return (
    <div className="h-full flex items-center">
      <AnimatePresence mode="wait">
        {isVisible && (
          <HyperText
            key={words[currentWord]}
            className="text-5xl sm:text-5xl md:text-7xl font-bold text-white"
            duration={1000}
          >
            {words[currentWord]}
          </HyperText>
        )}
      </AnimatePresence>
    </div>
  );
}

