'use client'

import { motion } from 'framer-motion'

export function VoiceAnimation({ isActive = false }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center space-x-1 h-16">
      {[0, 1, 2, 3].map((index) => (
        <motion.div
          key={index}
          className="w-4 bg-primary rounded-full"
          animate={isActive ? {
            height: [20, 40, 20],
            width: [16, 20, 16],
          } : {
            height: 20,
            width: 16,
          }}
          transition={isActive ? {
            duration: 0.8,
            repeat: Infinity,
            repeatType: "reverse",
            delay: index * 0.1,
          } : {}}
        />
      ))}
    </div>
  )
}