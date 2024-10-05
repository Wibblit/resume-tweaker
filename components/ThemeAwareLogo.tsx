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
      className="w-5 h-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7"
      priority={true}
    />
  )
}