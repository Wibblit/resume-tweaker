"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <Button variant="outline" size="icon" onClick={toggleDropdown}>
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
      {isOpen && (
        //left-0 md:right-0 md:left-auto
        <div className="absolute right-0 md:right-0 md:left-auto mt-2 w-32 origin-top-right rounded-md bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-[#09090b]">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            <button
              onClick={() => changeTheme("light")}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
              role="menuitem"
            >
              Light
            </button>
            <button
              onClick={() => changeTheme("dark")}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
              role="menuitem"
            >
              Dark
            </button>
            <button
              onClick={() => changeTheme("system")}
              className="block w-full px-4 py-2 text-left text-sm hover:bg-accent"
              role="menuitem"
            >
              System
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
