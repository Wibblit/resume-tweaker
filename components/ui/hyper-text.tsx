"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type CharacterSet = string[] | readonly string[];

interface HyperTextProps {
  children: string;
  className?: string;
  duration?: number;
  characterSet?: CharacterSet;
  onComplete?: () => void;
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ.#@$%&/".split(""),
) as readonly string[];

const getRandomChar = (characterSet: CharacterSet): string =>
  characterSet[Math.floor(Math.random() * characterSet.length)];

export function HyperText({
  children,
  className,
  duration = 1500,
  characterSet = DEFAULT_CHARACTER_SET,
  onComplete,
}: HyperTextProps) {
  const [displayText, setDisplayText] = useState(children);

  useEffect(() => {
    const targetText = children.toUpperCase();
    const startTime = Date.now();

    const animateText = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const newText = targetText
        .split('')
        .map((char, index) => {
          if (progress >= index / targetText.length) {
            return char;
          }
          return getRandomChar(characterSet);
        })
        .join('');

      setDisplayText(newText);

      if (progress < 1) {
        requestAnimationFrame(animateText);
      } else {
        onComplete && onComplete();
      }
    };

    animateText();
  }, [children, duration, characterSet, onComplete]);

  return (
    <motion.div
      className={cn("overflow-hidden ", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {displayText}
    </motion.div>
  );
}

