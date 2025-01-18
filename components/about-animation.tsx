'use client'
import React, { useState, useEffect } from "react";
import { Vortex } from "@/components/ui/vortex";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { CyclingHyperText } from "@/components/ui/cycling-hyper-text";
import SocialMediaIcons from "@/components/ui/social-media-icons";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutAnimation() {
  const [showContent, setShowContent] = useState(false);
  const [showCyclingText, setShowCyclingText] = useState(false);
  const [showSocialIcons, setShowSocialIcons] = useState(false);
  const [weAreComplete, setWeAreComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleWeAreComplete = () => {
    setWeAreComplete(true);
    const cyclingTextTimer = setTimeout(() => {
      setShowCyclingText(true);
      clearTimeout(cyclingTextTimer);
    }, 1500);
    setTimeout(() => setShowSocialIcons(true), 10000);
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden">
      <Vortex
        backgroundColor="rgba(0, 0, 0, 0.1)"
        className="w-full h-screen"
        particleCount={1000}
        baseSpeed={0.5}
        rangeSpeed={2}
        baseRadius={1.5}
        rangeRadius={3}
      >
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/30 to-black/70" />
        <div className="relative z-20 w-full h-screen flex flex-col justify-end items-center p-4 md:px-2 pb-20">
          <div className="w-full max-w-7xl md:pb-10 mx-auto md:m-8 flex flex-col md:flex-row items-end justify-between">
            <div className="mb-4 md:mb-0 md:mr-8 self-end md:self-start order-first md:order-last h-[52px] md:h-auto md:w-[52px]">
              {showSocialIcons && <SocialMediaIcons />}
            </div>
            <div className="relative w-full md:w-auto">
              <div className="absolute inset-0 bg-transparent rounded-3xl blur-xl transform scale-105" />
              <div className="relative bg-black/10 rounded-3xl p-6 md:p-8 backdrop-blur-md w-full md:w-[600px]">
                <AnimatePresence>
                  {showContent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-left"
                    >
                      {!weAreComplete ? (
                        <TypewriterEffect
                          text="WE ARE"
                          className="text-5xl sm:text-6xl md:text-7xl mb-2 md:mb-4 font-semibold text-white"
                          onComplete={handleWeAreComplete}
                        />
                      ) : (
                        <div className="text-5xl sm:text-6xl md:text-7xl mb-2 md:mb-4 font-semibold text-white">
                          WE ARE
                        </div>
                      )}
                      <div className="h-20 sm:h-24 md:h-28">
                        {showCyclingText && <CyclingHyperText startDelay={0} />}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </Vortex>
    </div>
  );
}

