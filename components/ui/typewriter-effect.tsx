"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterEffectProps {
  text: string;
  className?: string;
  onComplete?: () => void;
}

export function TypewriterEffect({ text, className, onComplete }: TypewriterEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayText((prev) => {
        if (index < text.length) {
          index++;
          return text.slice(0, index);
        } else {
          clearInterval(intervalId);
          setIsComplete(true);
          onComplete && onComplete();
          return prev;
        }
      });
    }, 80);

    return () => clearInterval(intervalId);
  }, [text, onComplete]);

  return (
    <div className={className}>
      {displayText}
      <AnimatePresence>
        {!isComplete && (
          <motion.span
            className="inline-block w-[0.05em] h-[1em] bg-white align-baseline"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

