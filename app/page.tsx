import { LandingNav } from "@/components/LandingNav";
import { Hero } from "@/components/Hero";
import type { Metadata } from "next";

export const metadata: Metadata = {
   icons: {
    icon : '/icon.ico'
  }
};

export default async function Home() {
  return (
    <main className="relative flex justify-center items-center flex-col overflow-hidden mx-auto">
        <div className="max-w-7xl w-full">
            <LandingNav />
        </div>
        <Hero />
    </main>
  );
}
