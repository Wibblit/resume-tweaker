"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import ThemeAwareLogo from "@/components/ThemeAwareLogo";
import { ThemeAwareWibblitLogo } from "@/components/ThemeAwareLogo";
import { useParams } from "next/navigation";

export default function PaymentFailurePage() {
  console.log(useParams());

  const { priceID } = useParams();

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
          <div className="bg-red-100 dark:bg-red-900 p-8 flex flex-col items-center space-y-6">
            <ThemeAwareLogo className="w-48 h-auto" />
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.2,
              }}
              className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center"
            >
              <motion.div
                animate={{
                  rotate: [-10, 10, -10],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <X className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>
            </motion.div>
          </div>

          <div className="p-8 space-y-6">
            <motion.h1
              className="text-3xl font-bold text-center text-red-600 dark:text-red-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Payment Failed
            </motion.h1>

            <motion.p
              className="text-center text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              We're sorry, but there was an issue processing your payment.
              Please try again or contact support.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                asChild
                variant="outline"
                className="px-4 py-2 w-full sm:w-auto border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
              >
                <Link href="/support">
                  <span className="text-base">Contact Support</span>
                </Link>
              </Button>
              <Button
                asChild
                className="px-4 py-2 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white"
              >
                <Link href={`/checkout/${priceID}`}>
                  <span className="text-base">Try Again</span>
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
