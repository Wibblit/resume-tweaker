"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { Button } from "./ui/button";

export function LandingNav() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { href: "/editor", label: "Editor" },
    { href: "/review", label: "Review" },
    { href: "/interview", label: "Interview" },
    { href: "/pricing", label: "Pricing" },
    { href: "/blogs", label: "Blogs" },
  ];

  return (
    <nav className="w-full fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
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
          {/* {pathname === "/" && ( */}

          {/* )} */}
          <div className="md:flex items-center justify-between hidden">
            <div className="flex items-center space-x-10">
              <div className="flex space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="hover:underline hover:text-primary hover:scale-105 transition-all duration-200 px-3 py-2 rounded-md font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <div className="flex items-center">
                <ModeToggle />
              </div>
            </div>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-primary-foreground hover:text-primary hover:bg-primary-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-primary focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6 text-primary" aria-hidden="true" />
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
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <div className="w-full flex">
                <Link
                  key={item.label}
                  href={item.href}
                  className="hover:bg-primary-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-5/6"
                >
                  {item.label}
                </Link>
                {/* <div className="flex w-1/6 items-center justify-center">
                  <ModeToggle />
                </div> */}
              </div>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-primary">
            <div className="flex items-center px-5">
              <ModeToggle />

              <Button className="ml-auto" onClick={() => {
                router.push("/#join") 
                toggleMenu()
              }}>
                Join Waitlist
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
