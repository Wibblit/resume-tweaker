"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Logo() {
  const { theme, systemTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/resumetweaker_light.svg");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setLogoSrc(
      currentTheme === "dark"
        ? "/resumetweaker_dark.svg"
        : "/resumetweaker_light.svg"
    );
  }, [theme, systemTheme]);

  return (
    <Image
      src={logoSrc}
      alt="Resume Tweaker Logo"
      width={185}
      height={185}
      priority={true}
    />
  );
}
