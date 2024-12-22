"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Home, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/LandingPage/LandingNav";

interface Orb {
  x: number;
  y: number;
  size: number;
  color: string;
}

const generateRandomPosition = (): { x: number; y: number } => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
});

const generateOrb = (): Orb => ({
  ...generateRandomPosition(),
  size: Math.random() * 200 + 100,
  color: ["#71717a", "#52525b", "#3f3f46", "#27272a", "#18181b"][
    Math.floor(Math.random() * 5)
  ],
});

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  useEffect(() => {
    setMounted(true);
    setOrbs(Array.from({ length: 5 }, generateOrb));
    console.error("Error details:", error);
  }, [error]);

  const status = 500;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-hidden">
      <LandingNav />
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="text-center">
          <h1 className="text-9xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r dark:from-zinc-500 dark:to-zinc-500 from-zinc-900 to-zinc-900 animate-pulse">
            Oops!
          </h1>
          <p className="text-2xl mb-8 animate-fade-in-up dark:text-zinc-400 text-zinc-900">
            Looks like something went wrong.
          </p>
          <p className="text-lg mb-8 max-w-md mx-auto dark:text-zinc-400 text-zinc-900">
            {" "}
            Don’t worry, it’s not you—it’s us. We’re working hard to fix it. Try
            refreshing the page or check back later. Thanks for your patience!
          </p>
          <div className="space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            <Button
              variant="default"
              onClick={() => reset()}
              className="transition-all duration-300 hover:scale-105"
            >
              <RefreshCcw className="mr-2 h-4 w-4" /> Try Again
            </Button>
            <Button
              variant="default"
              asChild
              className="transition-all duration-300 hover:scale-105"
            >
              <Link href="/">
                <Home className="mr-2 h-4 w-4" /> Home
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {mounted && (
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-grid-zinc/[0.05] bg-[length:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-radial from-zinc-500/20 to-background" />
        </div>
      )}

      <div className="fixed inset-0 z-0 overflow-hidden">
        {orbs.map((orb, i) => (
          <div
            key={i}
            className="absolute rounded-full mix-blend-soft-light filter blur-3xl animate-pulse"
            style={{
              width: `${orb.size}px`,
              height: `${orb.size}px`,
              backgroundColor: orb.color,
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              opacity: 0.7,
              boxShadow: `0 0 ${orb.size / 2}px ${orb.size / 4}px ${orb.color}`,
              animation: `pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
