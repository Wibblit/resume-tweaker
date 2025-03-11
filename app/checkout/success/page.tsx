"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import ThemeAwareLogo from "@/components/ThemeAwareLogo";
import { ThemeAwareWibblitLogo } from "@/components/ThemeAwareLogo";

export default function PaymentSuccessPage() {
  return (
    <main className="bg-background text-foreground min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md mx-auto"
      >
        <motion.div
          className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className="bg-green-100 dark:bg-green-900 p-8 flex flex-col items-center space-y-6">
            <ThemeAwareLogo className="w-48 h-auto" />
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360, 360],
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeInOut",
                  times: [0, 0.2, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Check className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </div>

          <div className="p-8 space-y-6">
            <motion.h1
              className="text-3xl font-bold text-center text-green-600 dark:text-green-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Successful
            </motion.h1>

            <motion.p
              className="text-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Great news! Your payment is complete, and your resume is ready for
              a makeover.
            </motion.p>

            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                asChild
                className="px-6 py-2 w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white"
              >
                <Link href="/profile">
                  <span className="text-base">View Your Profile</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col items-center justify-center text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <p className="text-sm text-muted-foreground mb-2">Powered by</p>
          <ThemeAwareWibblitLogo className="w-24 h-auto" />
        </motion.div>
      </motion.div>
    </main>
  );
}
