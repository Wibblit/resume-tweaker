"use client";
import { ThemeProvider } from "@/components/theme-provider";
import { ReactNode } from "react";
export function ThemeProviderWrapper({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
