"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  MessageSquare,
  Star,
  User,
  Sun,
  Moon,
  Laptop,
  Coins,
  X,
  Chrome,
} from "lucide-react";
import { Session } from "next-auth";
import { SignOutButton } from "./SignOutButton";

const sidebarItems = [
  { name: "Resumes", icon: FileText, href: "/home" },
  { name: "AI Review", icon: Star, href: "/ai-review" },
  {
    name: "AI Interview",
    icon: MessageSquare,
    href: "/ai-interview",
  },
  { name: "Profile", icon: User, href: "/profile" },
];

interface SideBarProps {
  session: Session | null;
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Component({ session, setIsSidebarOpen }: SideBarProps) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const credits = {
    used: 750,
    total: 1000,
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="sm:block md:text-xl text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
            <span className="text-zinc-500 dark:text-zinc-400">resume</span>
            <span className="font-bold">tweaker</span>
          </span>
        </Link>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
              Features
            </h2>
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <Button
                  key={item.name}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4 space-y-4">
        {session?.user && (
          <span>
            <SignOutButton />
          </span>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {theme === "light" && <Sun className="mr-2 h-4 w-4" />}
              {theme === "dark" && <Moon className="mr-2 h-4 w-4" />}
              {theme === "system" && <Laptop className="mr-2 h-4 w-4" />}
              <span className="capitalize">{theme} Theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Coins className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Credits
              </span>
            </div>
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              {credits.used}/{credits.total}
            </span>
          </div>
          <Progress
            value={(credits.used / credits.total) * 100}
            className="h-2"
          />
        </div>
      </div>
    </div>
  );
}
