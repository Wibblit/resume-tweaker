import Link from "next/link";
import { Twitter, Linkedin, Github } from "lucide-react";
import ThemeAwareLogo from "../ThemeAwareLogo";
import { SocialIcon } from "react-social-icons";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-32">
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

// "use client";

// import Link from "next/link";
// import {
//   Twitter,
//   Linkedin,
//   Github,
//   ChevronDown,
//   Sun,
//   Moon,
// } from "lucide-react";
// import ThemeAwareLogo from "../ThemeAwareLogo";
// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { useTheme } from "next-themes";

// export default function Footer() {
//   const { theme, setTheme } = useTheme();
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="border-t border-zinc-200 dark:border-zinc-800 py-6">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/* First Row */}
//         <div className="flex flex-col sm:flex-row items-center justify-between pb-2  ">
//           <div className="flex items-center gap-4">
//             <ThemeAwareLogo />
//             <span className="text-sm text-zinc-500 dark:text-zinc-400">
//               <span className="text-zinc-500 dark:text-zinc-400">resume</span>
//               <span className="font-semibold">tweaker</span>
//             </span>
//             <span className="text-xs text-zinc-500 dark:text-zinc-400">
//               © {currentYear}
//             </span>
//           </div>

//           <div className="flex items-center gap-4 mt-4 sm:mt-0">
//             <div className="flex items-center gap-2">
//               <ThemeAwareLogo className="w-4 h-4" />
//               <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
//                 Wibblit
//               </span>
//             </div>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="h-8 w-8"
//               onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
//             >
//               <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
//               <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
//               <span className="sr-only">Toggle theme</span>
//             </Button>
//           </div>
//         </div>

//         {/* Second Row */}
//         <div className="flex flex-col sm:flex-row items-center justify-between pt-2">
//           <div className="flex items-center gap-4 mt-4 sm:mt-0">
//             <Link
//               href="https://twitter.com"
//               className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
//             >
//               <Twitter className="h-4 w-4" />
//               <span className="sr-only">Twitter</span>
//             </Link>
//             <Link
//               href="https://linkedin.com"
//               className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
//             >
//               <Linkedin className="h-4 w-4" />
//               <span className="sr-only">LinkedIn</span>
//             </Link>
//             <Link
//               href="https://github.com"
//               className="text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-100"
//             >
//               <Github className="h-4 w-4" />
//               <span className="sr-only">GitHub</span>
//             </Link>
//           </div>

//           <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-zinc-700 dark:text-zinc-300">
//             <Link
//               href="/pricing"
//               className="hover:text-zinc-900 dark:hover:text-zinc-100"
//             >
//               Pricing
//             </Link>
//             <Link
//               href="/blogs"
//               className="hover:text-zinc-900 dark:hover:text-zinc-100"
//             >
//               Blog
//             </Link>
//             <Link
//               href="/contact"
//               className="hover:text-zinc-900 dark:hover:text-zinc-100"
//             >
//               Contact
//             </Link>

//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="h-auto p-0 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
//                 >
//                   Legal
//                   <ChevronDown className="ml-1 h-3 w-3" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="start" className="w-48">
//                 <DropdownMenuItem asChild>
//                   <Link href="/privacy">Privacy Policy</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/terms">Terms of Service</Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem asChild>
//                   <Link href="/refund">Refund Policy</Link>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </nav>
//         </div>
//       </div>
//     </footer>
//   );
// }