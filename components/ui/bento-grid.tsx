import { cn } from "@/lib/utils"
import Link from "next/link"
import type React from "react"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4 max-w-7xl mx-auto", className)}>{children}</div>
}

export const BentoGridItem = ({
  className,
  title,
  description,
  icon,
  link,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  icon?: React.ReactNode
  link: string
}) => {
  return (
    <Link href={link}>
    <div
      className={cn(
          "rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 sm:p-6 border flex flex-col space-y-4",
        className,
    )}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">{icon}</div>
        <h3 className="font-semibold text-base sm:text-lg text-gray-800 dark:text-gray-200">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
    </Link>
  )
}

