"use client"

import React, { useEffect, useState, useRef } from "react"
import { AnimatePresence, useMotionValueEvent, useScroll } from "framer-motion"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface DeviceFrameProps {
  children: React.ReactNode
  className?: string
}

export function DeviceFrame({ children, className }: DeviceFrameProps) {
  return (
    <div className="relative w-full">
      <div className="relative rounded-2xl p-[2px] bg-gradient-to-b from-zinc-400/20 via-zinc-700/20 to-zinc-900/20 dark:from-zinc-50/20 dark:via-zinc-500/20 dark:to-zinc-800/20 shadow-2xl">
        <div className={cn(
          "relative rounded-2xl overflow-hidden bg-zinc-100/90 dark:bg-zinc-900/90 backdrop-blur-xl",
          className
        )}>
          <div className="absolute top-0 left-0 right-0 h-8 bg-zinc-200/50 dark:bg-zinc-800/50 flex items-center px-4 gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400/50 dark:bg-zinc-600/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400/50 dark:bg-zinc-600/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-400/50 dark:bg-zinc-600/50" />
          </div>
          <div className="pt-8">
            {children}
          </div>
        </div>
      </div>
      
      <div className="absolute -inset-x-20 -inset-y-20 bg-gradient-to-r from-primary/10 to-zinc-500/10 dark:from-primary/20 dark:to-zinc-500/20 opacity-10 dark:opacity-10 blur-3xl" />
      <div className="absolute -inset-x-20 -inset-y-20 bg-gradient-to-t from-primary/10 via-zinc-500/10 to-zinc-400/10 dark:from-primary/20 dark:via-zinc-500/20 dark:to-zinc-400/20 opacity-10 dark:opacity-10 blur-3xl" />
    </div>
  )
}

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string
    description: string
    image: string
  }[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerHeight, setContainerHeight] = useState(0)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (containerRef.current) {
      const totalHeight = containerRef.current.scrollHeight
      setContainerHeight(totalHeight + window.innerHeight)
    }
  }, [])

  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!containerRef.current) return

    const viewportHeight = window.innerHeight
    const viewportCenter = latest + viewportHeight / 2

    // Find which card's center is closest to viewport center
    let closestCard = 0
    let minDistance = Infinity

    cardRefs.current.forEach((cardRef, index) => {
      if (cardRef) {
        const rect = cardRef.getBoundingClientRect()
        const cardCenter = latest + rect.top + rect.height / 2
        const distance = Math.abs(viewportCenter - cardCenter)

        if (distance < minDistance) {
          minDistance = distance
          closestCard = index
        }
      }
    })

    setActiveCard(closestCard)
  })

  return (
    <motion.div
      ref={ref}
      className="flex justify-center relative space-x-14 p-8 md:p-14"
      style={{ height: containerHeight }}
    >
      <div className="relative flex items-start" ref={containerRef}>
        <div className="max-w-xl">
          {content.map((item, index) => (
            <motion.div
              key={item.title + index}
              //@ts-ignore
              ref={el => cardRefs.current[index] = el}
              className={cn(
                "min-h-[50vh] flex items-center",
                index === content.length - 1 ? "mb-[50vh]" : "mb-[25vh]"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: activeCard === index ? 1 : 0.3,
                y: 0 
              }}
              transition={{ duration: 0.5 }}
            >
              <div>
                <h2 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">
                  {item.title}
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md mt-4">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className={cn(
          "hidden lg:block h-[60vh] w-[640px] sticky top-1/2 -translate-y-1/2",
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
                ease: [0.23, 1, 0.32, 1]
              }}
              className="w-full h-full relative"
            >
              <Image
                src={content[activeCard].image}
                alt={content[activeCard].title}
                width={1200}
                height={800}
                className="object-cover object-center rounded-lg"
              />
            </motion.div>
          </AnimatePresence>
        </DeviceFrame>
      </motion.div>
    </motion.div>
  )
}