'use client'

import React from "react"
import { motion } from "framer-motion"
import { BackgroundBeams } from "../ui/background-beams"
import { Button } from "../ui/button"
import { ArrowRight, FileText } from "lucide-react"

export function Hero() {
  const scrollToTemplates = () => {
    const ele = document.getElementById("templates");
    console.log("lj")
    if (ele) {
      ele.scrollIntoView({behavior: "smooth"})
    }
  }
  return (
    <div className="min-h-screen w-full rounded-md relative flex flex-col items-center justify-center antialiased overflow-hidden bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center z-[1000]">
        <motion.div 
          className="max-w-3xl space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl md:max-w-2xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground">
            Elevate Your Resume with AI
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Craft a standout resume with ease using the power of AI. Receive tailored suggestions, optimize your content, and land your dream job faster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="w-full sm:w-auto group bg-primary text-primary-foreground hover:bg-primary/90 hover:cursor-pointer">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button onClick={scrollToTemplates} variant="outline" className="w-full sm:w-auto group border-input hover:bg-accent hover:text-accent-foreground hover:cursor-pointer">
              View Templates
              <FileText className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
          <div className="flex sm:flex-row gap-8 justify-center mt-14 sm:mt-12">
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl  font-bold text-foreground">38%</h3>
              <p className="text-muted-foreground">more interviews</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl sm:text-4xl  font-bold text-foreground">23%</h3>
              <p className="text-muted-foreground">more likely to get a job offer</p>
            </div>
          </div>
        </motion.div>
      </div>
      <BackgroundBeams />
    </div>
  )
}