"use client"

import { FileText, Star, MessageSquare, User, Loader, Coins, Sun, Moon, Laptop } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar"
import type { Session } from "next-auth"
import { useTheme } from "next-themes"
import { useAppDispatch, useAppSelector } from "@/hooks/hooks"
import axios from "axios"
import { useToast } from "@/hooks/use-toast"
import {
  updateCredits,
  updateLoadingFalse,
  updateLoadingTrue,
  updateCoverSlot,
  updateResumeSlot,
} from "@/slices/userAssets"
import { useEffect } from "react"
import { SignOutButton } from "./SignOutButton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "./ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Separator } from "./ui/separator"
import Link from "next/link"
import { SettingsDialog } from "./settings/settings-dialog"
import { usePathname } from "next/navigation"


// Menu items.
const items = [
  { title: "Resumes", icon: FileText, url: "/home" },
  { title: "AI Review", icon: Star, url: "/ai-review" },
  { title: "AI Interview", icon: MessageSquare, url: "/ai-interview" },
  { title: "Profile", icon: User, url: "/profile" },
]

export function AppSidebar({ session }: { session: Session }) {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const credit = useAppSelector((state) => state?.assets?.credits)
  const loading = useAppSelector((state) => state?.assets?.loading)
  const { toast } = useToast()
  const credits = {
    used: credit,
    total: 10000,
  }

  const { state: sidebarState } = useSidebar()
  const isCollapsed = sidebarState === "collapsed"

  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      try {
        dispatch(updateLoadingTrue())
        const response = await axios.get("/api/get-credits", {
          withCredentials: true,
        })
        console.log(response?.data?.Credits?.credits)
        dispatch(updateCredits(response?.data?.Credits?.credits))
        dispatch(updateResumeSlot(response?.data?.Credits?.resumeslot))
        dispatch(updateCoverSlot(response?.data?.Credits?.coverslot))
      } catch (error) {
        console.log(error)
        toast({
          title: "Failed to Load Credits",
          description: "Unable to fetch your credits. Please try again.",
          variant: "destructive",
        })
      } finally {
        dispatch(updateLoadingFalse())
      }
    })()
  }, [dispatch, toast])

  return (
    <TooltipProvider>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader>
          <div className="flex justify-between w-full">
            {!isCollapsed && (
              <Link href="/" className="flex items-center gap-2 font-semibold">
                <span className="sm:block text-zinc-800 dark:text-zinc-200 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors duration-200">
                  <span className="text-zinc-500 dark:text-zinc-400">resume</span>
                  <span className="font-bold">tweaker</span>
                </span>
              </Link>
            )}
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton isActive={item.url === pathname} tooltip={item.title} asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter
          className={`p-3 bg-background/80 rounded-md ${isCollapsed && "flex items-center justify-center"}`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <div className={"flex items-center justify-center w-full"}>
                  <SettingsDialog isCollapsed={isCollapsed} />
                </div>
              </div>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>
          <Separator />
          {session?.user && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <SignOutButton isCollapsed={isCollapsed} />
                </div>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">Logout</TooltipContent>}
            </Tooltip>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className={`w-full ${!isCollapsed && "justify-start"}`}>
                    {theme === "light" && <Sun className="h-4 w-4" />}
                    {theme === "dark" && <Moon className="h-4 w-4" />}
                    {theme === "system" && <Laptop className="h-4 w-4" />}
                    {!isCollapsed && <span className="ml-2 capitalize">{theme} Theme</span>}
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
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Change Theme</TooltipContent>}
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader className="animate-spin h-4 w-4" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-2">
                        <Coins className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                        {!isCollapsed && (
                          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Credits Available
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{credits.used}</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right">Credits: {credits.used} avl</TooltipContent>}
          </Tooltip>
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  )
}

