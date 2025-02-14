"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { GradientText } from "../gradient-text";

const images = [
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample1-resume.webp",
    name: "Template 1",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample2-resume.webp",
    name: "Template 2",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample3-resume.webp",
    name: "Template 3",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample4-resume.webp",
    name: "Template 4",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample5-resume.webp",
    name: "Template 5",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample6-resume.webp",
    name: "Template 6",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample7-resume.webp",
    name: "Template 7",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample8-resume.webp",
    name: "Template 8",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample9-resume.webp",
    name: "Template 9",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample1-coverletter.webp",
    name: "Creative Template 1",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample2-coverletter.webp",
    name: "Creative Template 2",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample3-coverletter.webp",
    name: "Creative Template 3",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample4-coverletter.webp",
    name: "Creative Template 4",
  },
  {
    image: "https://cdnresumetweaker.wibblit.com/static-images/sample5-coverletter.webp",
    name: "Creative Template 5",
  },
];

const shuffledimages1 = [...images].sort(() => Math.random() - 0.5);
const shuffledimages2 = [...images].sort(() => Math.random() - 0.2);
const shuffledimages3 = [...images].sort(() => Math.random() - 0.1);
const shuffledimages4 = [...images].sort(() => Math.random() - 0.4);


const ImageCard = ({ image, name }: { image: string; name: string }) => (
  <figure className="relative h-72 lg:h-full flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border p-1 border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05] dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]">
    <img
      src={image || "/placeholder.svg"}
      alt={name}
      className="w-full h-full object-cover rounded-lg"
    />
  </figure>
)

const Marquee = ({
  className,
  reverse = false,
  vertical = false,
  children,
}: { className?: string; reverse?: boolean; vertical?: boolean; children: React.ReactNode }) => (
  <div className={cn("flex overflow-hidden [--gap:1rem]", vertical ? "flex-col -my-2" : "flex-row -mx-2", className)}>
    {[...Array(2)].map((_, i) => (
      <div
        key={i}
        className={cn(
          "flex shrink-0 justify-around items-center gap-[--gap]",
          vertical ? "flex-col my-2" : "flex-row mx-2",
          vertical
            ? reverse
              ? "animate-marquee-vertical-reverse"
              : "animate-marquee-vertical"
            : reverse
              ? "animate-marquee-reverse"
              : "animate-marquee",
        )}
        style={{
          animationDuration: "var(--duration)",
        }}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<any>, {
              style: {
                ...((child as React.ReactElement<any>).props.style || {}),
                minWidth: vertical ? undefined : "max-content",
                minHeight: vertical ? "max-content" : undefined,
              },
            })
            : child,
        )}
      </div>
    ))}
  </div>
)

export function ImageMarquee() {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      {
        threshold: 0.1,
      },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <div
      ref={ref}
      className={cn(
        "w-full min-h-screen text-foreground transition-opacity duration-1000 ease-in-out",
        isVisible ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="container mx-auto p-4 flex flex-col lg:flex-row items-start justify-between">
        <div className="w-full lg:w-1/4 mb-8 lg:mb-0 lg:sticky lg:top-20 px-4 sm:px-6 lg-px-8">
          <h2 className="text-4xl font-bold mb-4">
            <GradientText className="">ATS friendly templates</GradientText>
          </h2>
          <p className="text-base mb-4 text-muted-foreground">
            You don't have to stick to one boring template, even the fun ones can be ats friendly!
          </p>
        </div>
        <div className="w-full lg:w-3/4 h-[calc(100vh-2rem)] overflow-hidden">
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 h-full">
            {/* Small screens: horizontal scroll, 2 rows */}
            <div className="lg:hidden flex flex-col space-y-4">
              <Marquee className="h-1/2 [--duration:30s]">
                {shuffledimages1.map((image) => (
                  <ImageCard key={image.name} {...image} />
                ))}
              </Marquee>
              <Marquee reverse className="h-1/2 [--duration:35s]">
                {[...shuffledimages2].reverse().map((image) => (
                  <ImageCard key={image.name} {...image} />
                ))}
              </Marquee>
            </div>
            {/* Large screens: 3 vertical columns */}
            <Marquee vertical className="hidden lg:block [--duration:40s] h-full w-1/3">
              {shuffledimages3.map((image) => (
                <ImageCard key={image.name} {...image} />
              ))}
            </Marquee>
            <Marquee vertical reverse className="hidden lg:block [--duration:45s] h-full w-1/3">
              {[...shuffledimages4].reverse().map((image) => (
                <ImageCard key={image.name} {...image} />
              ))}
            </Marquee>
            <Marquee vertical className="hidden lg:block [--duration:50s] h-full w-1/3">
              {images
                .slice(2)
                .concat(images.slice(0, 2))
                .map((image) => (
                  <ImageCard key={image.name} {...image} />
                ))}
            </Marquee>
          </div>
        </div>
      </div>
    </div>
  )
}

