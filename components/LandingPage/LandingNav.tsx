"use client";

import { useState, useRef, useEffect } from "react"; // Import useRef and useEffect
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "../ModeToggle";
import { useRouter } from "next/navigation";
import Logo from "../Logo";
import { Button } from "../ui/button";
import { NavItems } from "./NavItems";


export function LandingNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null); // Explicitly type the ref as HTMLDivElement
  const router = useRouter();

  // Toggle the menu visibility
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Effect to close the menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false); // Close the menu when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navItems = [
    { href: "/editor", label: "Editor" },
    { href: "/review", label: "Review" },
    { href: "/interview", label: "Interview" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
      <div className="absolute inset-0 bg-background/30 -z-40" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 group justify-center"
            >
              <Logo />
            </Link>
          </div>

          <div className="md:flex items-center justify-between hidden">
            <div className="flex items-center space-x-10">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className=" hover:text-primary hover:scale-105 transition-all duration-200 px-3 py-2 rounded-md font-medium"
                    onClick={() => setIsMenuOpen(false)} // Close menu on option click
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center">
                <ModeToggle />
                <Link href={"/login"} className="px-3">
                <Button variant={"silver"}>
                Login
                </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-foreground hover:text-primary hover:bg-primary-foreground`"
              aria-controls="mobile-menu"
              aria-expanded={isMenuOpen ? "true" : "false"} // Adjust aria-expanded for accessibility
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6 text-primary " aria-hidden="true" />
              ) : (
                <Menu
                  className="block h-6 w-6 text-primary"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="inset-0 bg-background/20 md:hidden z-40">

        <div ref={menuRef} className="md:hidden animate-fade-in-top-to-bottom" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div className="w-full flex" key={item.label}>
                <Link
                  href={item.href}
                  className=" block px-3 py-2 rounded-md text-base font-medium w-5/6"
                  onClick={() => setIsMenuOpen(false)} // Close menu on option click
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-primary">
            <div className="flex items-center px-5">
              <ModeToggle  />

              <Button
                className="ml-auto"
                onClick={() => {
                  router.push("/login");
                  setIsMenuOpen(false); // Close menu when 'Join Waitlist' is clicked
                }}
                >
                Login
              </Button>
            </div>
          </div>
          </div>
        </div>
      )}
    </nav>
  );
}
