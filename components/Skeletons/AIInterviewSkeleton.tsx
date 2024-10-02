"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Send } from "lucide-react"

export default function AIInterviewSkeleton() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <main className="flex flex-1 flex-col overflow-hidden p-4 md:p-6">
        <h1 className="mb-6 text-3xl font-bold">AI Interview Simulation</h1>

        <motion.div
          className="flex flex-col items-center justify-center flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-full max-w-3xl">
            <Label htmlFor="jd" className="text-lg font-semibold mb-2 block">
              Job Description
            </Label>
            <Skeleton className="w-full h-[200px] mb-4" />
            <Skeleton className="w-full h-12" />
          </div>
        </motion.div>

        <motion.div
          className="flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-muted mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex-1 overflow-y-auto p-4">
            <Skeleton className="w-3/4 h-16 mb-4" />
            <Skeleton className="w-2/3 h-16 mb-4 ml-auto" />
            <Skeleton className="w-3/4 h-16 mb-4" />
            <Skeleton className="w-2/3 h-16 mb-4 ml-auto" />
          </div>
          <motion.div
            className="border-t border-border bg-background p-4"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2">
              <Skeleton className="flex-1 h-10" />
              <Skeleton className="h-10 w-10" />
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-primary-foreground shadow-lg"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-3 w-3 rounded-full bg-primary-foreground"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          />
          <span>Loading...</span>
        </motion.div>
      </main>
    </div>
  )
}