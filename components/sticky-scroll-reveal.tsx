"use client";

import React, { useEffect, useState, useRef } from "react";
import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { GradientText } from "./gradient-text";
import { useTheme } from "next-themes";
interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
}

export function DeviceFrame({ children, className }: DeviceFrameProps) {
  return (
    <div className="relative w-full aspect-[17/10.5]">
      <div className="absolute inset-0">
        <div className="relative h-full rounded-2xl  bg-gradient-to-b from-zinc-400 via-zinc-200 to-zinc-200 dark:from-zinc-50/20 dark:via-zinc-500/20 dark:to-zinc-800/20 shadow-2xl">
          <div
            className={cn(
              "relative h-full rounded-2xl overflow-hidden bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-xl",
              className
            )}
          >
            <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-200/50 dark:bg-zinc-800/50 flex items-center px-4 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-400/50 dark:bg-zinc-600/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-400/50 dark:bg-zinc-600/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-400/50 dark:bg-zinc-600/50" />
            </div>
            <div className="absolute inset-1 top-8">{children}</div>
          </div>
        </div>
      </div>

      <div className="absolute bg-gradient-to-r from-primary/10 to-zinc-500/10 dark:from-primary/20 dark:to-zinc-500/20 opacity-10 dark:opacity-10 blur-3xl" />
      <div className="absolute bg-gradient-to-t from-primary/10 via-zinc-500/10 to-zinc-400/10 dark:from-primary/20 dark:via-zinc-500/20 dark:to-zinc-400/20 opacity-10 dark:opacity-10 blur-3xl" />
    </div>
  );
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    image_dark: string;
    image_light: string;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const {theme} = useTheme();
  const isdark = theme === 'dark'
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const isMobile = window.innerWidth < 768; // lg breakpoint
        const contentHeight = containerRef.current.scrollHeight;
        const viewportHeight = window.innerHeight;
        const offset = isMobile ? viewportHeight * 0.5 : viewportHeight * 0.3;
        setContainerHeight(contentHeight + offset);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!containerRef.current) return;

    const viewportHeight = window.innerHeight;
    const viewportCenter = latest + viewportHeight / 2;

    let closestCard = 0;
    let minDistance = Infinity;

    cardRefs.current.forEach((cardRef, index) => {
      if (cardRef) {
        const rect = cardRef.getBoundingClientRect();
        const cardCenter = latest + rect.top + rect.height / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestCard = index;
        }
      }
    });

    setActiveCard(closestCard);
  });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row justify-center relative lg:p-14 md:space-x-14"
      style={{ height: containerHeight }}
    >
      {/* Device Frame for mobile - shown at the top */}
      <motion.div
        className={cn(
          "md:hidden w-full mb-12 sticky top-32 z-10",
          contentClassName
        )}
      >
        <DeviceFrame>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="absolute inset-0"
            >
              <img
                src={isdark ? content[activeCard].image_dark : content[activeCard].image_light}
                alt={content[activeCard].title}
                className="w-full h-full object-fill object-top rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </DeviceFrame>
      </motion.div>

      {/* Content */}
      <div className="relative flex items-start" ref={containerRef}>
        <div className="max-w-xl">
          {content.map((item, index) => (
            <motion.div
              key={item.title + index}
              ref={(el: any) => (cardRefs.current[index] = el)}
              className="min-h-[40vh] flex items-center mb-8 md:mb-16"
              initial={{ opacity: 0, y: 5 }}
              animate={{
                opacity: activeCard === index ? 1 : 0,
                y: 0,
              }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">
                    <GradientText>
                    {item.title}
                    </GradientText>
                  
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mt-4">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Device Frame for desktop - shown on the right */}
      <motion.div
        className={cn(
          "hidden md:block h-[80vh] w-full lg:w-[800px] sticky top-[20vh]",
          contentClassName
        )}
      >
        <DeviceFrame>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{
                duration: 0.5,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="absolute inset-0"
            >
              <img
                src={isdark ? content[activeCard].image_dark : content[activeCard].image_light}
                alt={content[activeCard].title}
                className="w-full h-full object-fill object-top rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </DeviceFrame>
      </motion.div>
    </motion.div>
  );
};