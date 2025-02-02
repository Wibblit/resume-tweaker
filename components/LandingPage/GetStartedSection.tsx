"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function GetStartedSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="container relative mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Content Card */}
          <div className="relative bg-card backdrop-blur-sm border rounded-2xl p-8 md:p-12">
            {/* Main content */}
            <div className="relative space-y-8">
              <div className="space-y-4 text-center md:text-left">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
                >
                  Transform Your Career with AI-Powered Resumes
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0"
                >
                </motion.p>
              </div>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
              >
                <Link href="/#join">
                  {" "}
                  <Button
                    size="lg"
                    variant={"silver"}
                    // className="group text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>

                <span className="text-muted-foreground">
                  No credit card required
                </span>
              </motion.div>

              {/* Social proof section */}
              
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
