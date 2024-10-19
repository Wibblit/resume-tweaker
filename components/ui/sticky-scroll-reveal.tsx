"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { CardContainer, CardBody } from "./3d-card";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "var(--foreground)",
    // "var(--black)",
    // "var(--muted-foreground)",
  ];
  const linearGradients = [
    "rgba(0, 0, 0, 0)",  // Fully transparent (no gradient)
    "rgba(0, 0, 0, 0)",  // Fully transparent (no gradient)
    "rgba(0, 0, 0, 0)",
    "rgba(0, 0, 0, 0)", // Fully transparent (no gradient)
  ];
  

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="h-[100vh] overflow-y-auto flex justify-center relative space-x-14 rounded-md p-14"
      ref={ref}
    >
      <div className="div relative flex items-start px-8">
        <div className="max-w-4xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-28">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-4xl font-bold text-slate-100"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-lg text-slate-300 max-w-md mt-10"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-60" />
        </div>
      </div>
      <CardBody
        // style={{ background: backgroundGradient }}
        className={cn(
          "hidden lg:block h-96 w-[40rem] bg-transparent rounded-lg bg-gray-50 group/card  dark:shadow-2xl dark:shadow-muted-foreground/[0.1] dark:bg-transparent dark:border-white/[0.2] border-black/[0.1] p-6 sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </CardBody>
    </motion.div>
  );
};
