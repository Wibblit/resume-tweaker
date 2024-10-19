import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import ThemeAwareLogo from "../ThemeAwareLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-white py-32 border-t-2">
      <div className=" mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-14  flex justify-between">
        <div className="flex justify-between w-full">
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center mb-4 gap-2">
              <ThemeAwareLogo />
              <span className="sm:block md:text-xl text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
                <span className="text-zinc-500 dark:text-zinc-400">resume</span>
                <span className="font-bold">tweaker</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              Copyright © {currentYear} Wibblit INC
            </p>
            <p className="text-sm text-gray-400">All rights reserved</p>
          </div>
          <div className="flex gap-x-8">
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
                  <Link
                    href="https://twitter.com"
                    className="flex items-center hover:text-gray-300"
                  >
                    <Twitter className="w-5 h-5 mr-2" />
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://linkedin.com"
                    className="flex items-center hover:text-gray-300"
                  >
                    <Linkedin className="w-5 h-5 mr-2" />
                    LinkedIn
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com"
                    className="flex items-center hover:text-gray-300"
                  >
                    <Github className="w-5 h-5 mr-2" />
                    GitHub
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
