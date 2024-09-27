"use client";

import { useState } from "react";
import { MobileSideBar } from "@/components/MobileSideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed z-50 flex items-center justify-between px-4  bg-background border-b w-full py-3 lg:hidden">
        <div className="flex items-center space-x-4 w-full justify-between">
          <MobileSideBar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <span className="text-xl text-zinc-800 dark:text-zinc-200">
            <span className="text-zinc-500 dark:text-zinc-400">resume</span>
            <span className="font-bold">tweaker</span>
          </span>
        </div>
      </header>

      <main className="flex-grow pt-[62px] md:pt-0 ">{children}</main>
    </div>
  );
}
