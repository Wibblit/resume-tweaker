"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ThemeAwareLogo({ className }: { className?: string }) {
  const { theme, systemTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/rt-light.svg");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setLogoSrc(currentTheme === "dark" ? "/rt-dark.svg" : "/rt-light.svg");
  }, [theme, systemTheme]);

  return (
    <Image
      src={logoSrc}
      alt="Resume Tweaker Logo"
      width={16}
      height={16}
      className={`lg:w-6 lg:h-6 xl:w-7 xl:h-7 ${
        className ? className : "w-5 h-5 "
      }`}
      priority={true}
    />
  );
}

export const ThemeAwareWibblitLogo = ({
  className,
}: {
  className?: string;
}) => {
  const { theme, systemTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/wibblit_light.svg");

  useEffect(() => {
    const currentTheme = theme === "system" ? systemTheme : theme;
    setLogoSrc(
      currentTheme === "dark" ? "/wibblit_dark.svg" : "/wibblit_light.svg"
    );
  }, [theme, systemTheme]);

  return (
    <Image
      src={logoSrc}
      alt="Resume Tweaker Logo"
      width={16}
      height={16}
      className={`lg:w-6 lg:h-6 xl:w-7 xl:h-7 ${
        className ? className : "w-5 h-5 "
      }`}
      priority={true}
    />
  );
};
