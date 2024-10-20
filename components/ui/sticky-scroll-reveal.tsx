"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardBody } from "./3d-card";
import Image from "next/image";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    image: string;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.scrollHeight);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"], // Updated to center tracking
  });

  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const threshold = 1 / cardLength;
    const activeIndex = Math.floor(latest / threshold);
    setActiveCard(Math.min(activeIndex, cardLength - 1));
  });

  const backgroundColors = [
    "var(--foreground)",
    // "var(--black)",
    // "var(--muted-foreground)",
  ];
  const linearGradients = [
    "rgba(0, 0, 0, 0)", // Fully transparent (no gradient)
    "rgba(0, 0, 0, 0)", // Fully transparent (no gradient)
    "rgba(0, 0, 0, 0)",
    "rgba(0, 0, 0, 0)", // Fully transparent (no gradient)
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(linearGradients[0]);

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      ref={ref}
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="flex justify-center relative md:space-x-14 rounded-md md:p-14"
      style={{ height: containerHeight }}
    >
      <div className="relative flex items-start px-8" ref={containerRef}>
        <div className="md:max-w-4xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-28">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-lg text-slate-300 max-w-md mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="md:h-60" />
        </div>
      </div>
      <CardBody
        className={cn(
          "hidden lg:block h-[50vh] lg:h-[60vh] w-full lg:w-1/2 rounded-lg p-6 sticky top-1/2 -translate-y-1/2 overflow-hidden shadow-lg bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent",
          contentClassName
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full relative"
          >
            <Image
              src={content[activeCard].image}
              alt={content[activeCard].title}
              fill
              className="object-cover object-center rounded-md"
            />
          </motion.div>
        </AnimatePresence>
      </CardBody>
    </motion.div>
  );
};
