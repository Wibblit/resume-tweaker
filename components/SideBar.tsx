"use client"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { useState } from "react";

const sidebarItems = [
  { name: "Resumes", icon: FileText, href: "/home" },
  { name: "AI Review", icon: Star, href: "/ai-review" },
  {
    name: "AI Interview",
    icon: MessageSquare,
    href: "/ai-interview",
    beta: true,
  },
  { name: "Profile", icon: User, href: "/profile" },
];

interface SideBarProps {
  session: Session | null;
  setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Component({ session, setIsSidebarOpen }: SideBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const credits = {
    used: 750,
    total: 1000,
  };

  const handleAIInterviewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleContinue = () => {
    setIsModalOpen(false);
    router.push("/ai-interview");
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
                  onClick={(e) => {
                    if (item.beta) {
                      handleAIInterviewClick(e);
                    } else {
                      setIsSidebarOpen && setIsSidebarOpen(false);
                    }
                  }}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                    {item.beta && (
                      <span className="ml-auto rounded-full bg-black px-2 py-1 text-xs font-medium text-white dark:bg-white dark:text-black">
                        Beta
                      </span>
                    )}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="border-t border-border p-4 space-y-4">
        {session?.user && <SignOutButton />}
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px] w-[90vw] p-6">
          <DialogHeader className="relative mb-4">
            <DialogTitle className="text-center text-2xl font-bold">
              AI Interview (Beta)
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center space-y-4">
            <p className="text-lg font-semibold">
              Welcome to the AI Interview (Beta)
            </p>
            <p>
              Optimized for <strong>Google Chrome</strong>
            </p>
            <Chrome className="mx-auto h-12 w-12 text-black dark:text-white" />
            <p>
              Experience a <strong>realistic, dynamic interview</strong>{" "}
              tailored to your specific job role. Our{" "}
              <strong>advanced AI</strong> generates questions in real-time and
              adapts based on your responses, helping you{" "}
              <strong>practice and improve</strong> with each interaction.
            </p>
            <p>
              For the <strong>best experience</strong>, we recommend using{" "}
              <strong>Google Chrome</strong>. We're actively working to expand
              support to other browsers soon.
            </p>
            <p className="font-semibold">
              Start preparing now and get one step closer to acing your
              interviews!
            </p>
          </DialogDescription>
          <DialogFooter className="flex justify-center">
            <Button onClick={handleContinue} className="w-full sm:w-auto">
              Continue to AI Interview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
