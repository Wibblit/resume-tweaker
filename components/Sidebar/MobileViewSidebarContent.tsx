"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  Loader,
} from "lucide-react";
import { Session } from "next-auth";
import { SignOutButton } from "../SignOutButton";
import { useAppSelector } from "@/hooks/hooks";
import { useEffect, useState } from "react";
import {
  updateCredits,
  updateLoadingFalse,
  updateLoadingTrue,
  updateCoverSlot,
  updateResumeSlot,
} from "@/slices/userAssets";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/hooks";
import { Separator } from "../ui/separator";
import { SettingsDialog } from "./settings/settings-dialog";

const sidebarItems = [
  { name: "Resumes", icon: FileText, href: "/home" },
  { name: "AI Review", icon: Star, href: "/home/ai-review" },
  { name: "AI Interview", icon: MessageSquare, href: "/home/ai-interview" },
  { name: "Profile", icon: User, href: "/profile" },
];

interface SideBarProps {
  session: Session | null;
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Component({ session, setIsSidebarOpen }: SideBarProps) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  const credit = useAppSelector((state) => state?.assets?.credits);
  const loading = useAppSelector((state) => state?.assets?.loading);
  const { toast } = useToast();
  const credits = {
    used: credit,
    total: 10000,
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        dispatch(updateLoadingTrue());
        const response = await axios.get("/api/get-credits", {
          withCredentials: true,
        });
        //console.log(response?.data?.Credits?.credits);
        dispatch(updateCredits(response?.data?.Credits?.credits));
        dispatch(updateResumeSlot(response?.data?.Credits?.resumeslot));
        dispatch(updateCoverSlot(response?.data?.Credits?.coverslot));
      } catch (error) {
        //console.log(error);
        toast({
          title: "Failed to Load Credits",
          description: "Unable to fetch your credits. Please try again.",
          variant: "destructive",
        });
      } finally {
        dispatch(updateLoadingFalse());
      }
    })();
  }, []);

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
                  onClick={() => setIsSidebarOpen && setIsSidebarOpen(false)}
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
        <div>
          <div className={"flex items-center justify-center w-full"}>
            <SettingsDialog isCollapsed={false} />
          </div>
        </div>
        <Separator />
        {session?.user && (
          <div>
            <SignOutButton />
          </div>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {theme === "light" && <Sun className="h-4 w-4" />}
              {theme === "dark" && <Moon className="h-4 w-4" />}
              {theme === "system" && <Laptop className="h-4 w-4" />}
              <span className="ml-2 capitalize">{theme} Theme</span>
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
        <div>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader className="animate-spin h-4 w-4" />
            </div>
          ) : (
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Credits Available
                </span>
              </div>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {credits.used}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
