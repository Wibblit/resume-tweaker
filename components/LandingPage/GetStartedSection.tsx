"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GetStartedSection() {
  return (
    <section className="py-16 w-full">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto flex flex-col justify-center sm:justify-start sm:items-start items-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-pretty">
            Get started today with AI Resume Builder to kickstart your career
          </h2>
          <p className="text-lg mb-8 text-muted-foreground">
            AI Resume Builder offers cutting-edge AI tools to create
            professional resumes. Join 50,000+ other job seekers to boost your
            career prospects.
          </p>
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="mt-12 flex items-center flex-wrap gap-4 justify-center">
            <div className="flex -space-x-2 mr-4">
              {[...Array(6)].map((_, i) => (
                <motion.img
                  key={i}
                  src={`https://avatars.githubusercontent.com/u/107497296?v=4`}
                  alt={`User avatar ${i + 1}`}
                  className="w-12 h-12 rounded-full border-2 border-black"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                />
              ))}
            </div>
            <div className="flex items-center mr-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-8 h-8 text-yellow-400 fill-current"
                />
              ))}
            </div>
            <p className="text-md text-gray-400">
              Trusted by 50,000+ job seekers
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
