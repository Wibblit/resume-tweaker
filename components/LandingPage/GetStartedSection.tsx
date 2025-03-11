"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
          <div className="relative bg-card/50 backdrop-blur-sm border rounded-2xl p-8 md:p-12">
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
                  Join over 50,000 professionals who've elevated their job search with our cutting-edge AI resume builder. Stand out from the crowd with perfectly crafted resumes.
                </motion.p>
              </div>

              {/* CTA Button */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4"
              >
                <Button size="lg" className="group text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <span className="text-muted-foreground">No credit card required</span>
              </motion.div>

              {/* Social proof section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="pt-8 border-t space-y-6"
              >
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
                  {/* User avatars */}
                  <div className="flex items-center">
                    <div className="flex -space-x-3">
                      {[...Array(5)].map((_, i) => (
                        <motion.img
                          key={i}
                          src={`https://i.pravatar.cc/100?img=${i + 1}`}
                          alt={`User ${i + 1}`}
                          className="w-10 h-10 rounded-full border-2 border-background"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        />
                      ))}
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <span className="text-muted-foreground">50k+ users</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "w-5 h-5",
                            i < 5 ? "text-yellow-400 fill-yellow-400" : "text-muted"
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-muted-foreground">4.9/5 rating</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}