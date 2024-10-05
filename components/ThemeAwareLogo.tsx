"use client"

import { useTheme } from "next-themes"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ThemeAwareLogo() {
  const { theme, systemTheme } = useTheme()
  const [logoSrc, setLogoSrc] = useState("/rt-light.svg")

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme
    setLogoSrc(currentTheme === "dark" ? "/rt-dark.svg" : "/rt-light.svg")
  }, [theme, systemTheme])

  return (
    <Image
      src={logoSrc}
      alt="Resume Tweaker Logo"
      width={16}
      height={16}
      className="w-10 h-10 lg:w-14 lg:h-14 xl:w-16 xl:h-16"
      priority={true}
    />
  )
}