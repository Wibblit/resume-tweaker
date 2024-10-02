"use client";
import { LandingNav } from "@/components/LandingNav";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingNav />
      <main className="mt-16 flex-grow pt-[62px] md:pt-0 ">{children}</main>
    </div>
  );
}
