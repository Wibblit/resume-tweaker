"use client";
import { useScroll, useTransform, motion, useSpring, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({
  images,
  className,
}: {
  images: string[];
  className?: string;
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [clientHeight, setClientHeight] = useState(0);
  const { scrollY } = useScroll();
  const inView = useInView(gridRef, { once: false, amount: 0.2 });

  useEffect(() => {
    const element = gridRef.current;
    const onResize = () => {
      if (element) {
        setElementTop(element.offsetTop);
        setClientHeight(window.innerHeight);
      }
    };
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const transformInitial = elementTop - clientHeight;
  const transformFinal = elementTop + (gridRef.current?.offsetHeight || 0);

  const scrollYProgress = useTransform(
    scrollY,
    [transformInitial, transformFinal],
    [0, 1]
  );

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 180, damping: 20 }); // Increased stiffness for faster animation

  const translateFirst = useTransform(smoothProgress, [0, 1], [0, -150]);
  const translateSecond = useTransform(smoothProgress, [0, 1], [0, 150]);
  const translateThird = useTransform(smoothProgress, [0, 1], [0, -150]);

  const opacityFirst = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const opacitySecond = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);
  const opacityThird = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3]);

  const scaleFirst = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const scaleSecond = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const scaleThird = useTransform(smoothProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);

  const third = Math.ceil(images.length / 3);
  const firstPart = images.slice(0, third);
  const secondPart = images.slice(third, 2 * third);
  const thirdPart = images.slice(2 * third);

  return (
    <div
      className={cn("w-full overflow-hidden", className)}
      ref={gridRef}
    >
      <motion.div
        className="grid grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-4 sm:gap-6 lg:gap-8 py-20 sm:py-30 lg:py-40 px-4 sm:px-6 lg:px-8"
        initial={{ opacity: 0, y: 100 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {firstPart.map((el, idx) => (
            <motion.div
              style={{ y: translateFirst, opacity: opacityFirst, scale: scaleFirst }}
              key={"grid-1" + idx}
              className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={el}
                className="h-full w-full object-cover object-top"
                height="600"
                width="600"
                // unoptimized={true}
                // priority
                loading="lazy"
                alt={`Resume template ${idx + 1}`}
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {secondPart.map((el, idx) => (
            <motion.div
              style={{ y: translateSecond, opacity: opacitySecond, scale: scaleSecond }}
              key={"grid-2" + idx}
              className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={el}
                className="h-full w-full object-cover object-top"
                height="600"
                width="450"
                alt={`Resume template ${idx + 1 + third}`}
              />
            </motion.div>
          ))}
        </div>
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          {thirdPart.map((el, idx) => (
            <motion.div
              style={{ y: translateThird, opacity: opacityThird, scale: scaleThird }}
              key={"grid-3" + idx}
              className="aspect-[3/4] overflow-hidden rounded-lg shadow-lg"
            >
              <Image
                src={el}
                className="h-full w-full object-cover object-top"
                height="600"
                width="450"
                alt={`Resume template ${idx + 1 + 2 * third}`}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};