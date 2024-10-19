import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import ThemeAwareLogo from "../ThemeAwareLogo";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-32 border-t-2">
      <div className=" mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-14  flex justify-between">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between w-full">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4 gap-2">
              <ThemeAwareLogo />
              <span className="sm:block md:text-xl text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
                <span className="text-zinc-500 dark:text-zinc-400">resume</span>
                <span className="font-bold">tweaker</span>
              </span>
            </div>
            <p className="text-sm text-foreground">
              Copyright © {currentYear} Wibblit INC
            </p>
            <p className="text-sm text-foreground">All rights reserved</p>
          </div>
          <div className="flex gap-x-8 text-foreground">
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/pricing" className="hover:text-gray-300">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-gray-300">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-gray-300">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/privacy" className="hover:text-gray-300">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gray-300">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/refund" className="hover:text-gray-300">
                    Refund Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Social</h3>
              <ul className="space-y-2">
                <li>
                  <SocialIcon
                    bgColor="#ffffff00"
                    style={{ width: "38px", height: "28px" }}
                    network="x"
                  />
                  Twitter
                </li>
                <li>
                  <SocialIcon
                    bgColor="#ffffff00"
                    style={{ width: "38px", height: "28px" }}
                    network="linkedin"
                  />
                  Linkedin
                </li>
                <li>
                  <SocialIcon
                    bgColor="#ffffff00"
                    style={{ width: "38px", height: "28px" }}
                    network="github"
                  />
                  Github
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
