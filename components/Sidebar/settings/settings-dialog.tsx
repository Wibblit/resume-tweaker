"use client";

import { useState } from "react";
import {
  Settings,
  User,
  PaintbrushIcon as PaintBrushIcon,
  Download,
  FileText,
  MessageSquare,
  Star,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSession } from "next-auth/react";
import { Separator } from "../../ui/separator";
import { Session } from "next-auth";
import Account from "./Account";
import { useTheme } from "next-themes";

export function SettingsDialog({ isCollapsed }: { isCollapsed: boolean }) {
  const [activeSection, setActiveSection] = useState("account");
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  const settingsSections = [
    { title: "Account", icon: User, id: "account" },
    { title: "Appearance", icon: PaintBrushIcon, id: "appearance" },
    { title: "Data Export", icon: Download, id: "data-export" },
    { title: "Resume Settings", icon: FileText, id: "resume-settings" },
    {
      title: "Interview Settings",
      icon: MessageSquare,
      id: "interview-settings",
    },
    { title: "Review Settings", icon: Star, id: "review-settings" },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`w-full ${isCollapsed && "py-1 px-2"} ${
            !isCollapsed && "justify-start"
          }`}
        >
          <Settings className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Settings</span>}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[800px] p-0 h-[90vh] max-h-[600px] overflow-hidden">
        <SidebarProvider
          style={{
            //@ts-ignore
            "--sidebar-width": "200px",
            "--sidebar-width-mobile": "200px",
          }}
        >
          <div className="flex h-full">
            <Sidebar
              variant="sidebar"
              className="w-[200px] border-r flex-shrink-0"
            >
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {settingsSections.map((section) => (
                        <SidebarMenuItem key={section.id}>
                          <SidebarMenuButton
                            onClick={() => setActiveSection(section.id)}
                            isActive={activeSection === section.id}
                          >
                            <section.icon className="mr-2 h-4 w-4" />
                            <span>{section.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </div>
          <ScrollArea className="w-full max-h-[600px]">
            <div className="p-6 space-y-6 w-full">
              {activeSection === "account" && <Account session={session!} />}
              {activeSection === "appearance" && (
                <div className="space-y-6 w-full">
                  <div className="space-y-2 w-full flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      defaultValue="system"
                      onValueChange={setTheme}
                      value={theme}
                    >
                      <SelectTrigger id="theme" className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Customize the appearance of the application. Choose
                      between light, dark, or system themes to match your
                      preferences.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The <strong>Light</strong> theme is ideal for bright
                      environments, while the <strong>Dark</strong> theme
                      reduces eye strain in low-light conditions. The{" "}
                      <strong>System</strong> theme automatically adjusts based
                      on your device's settings.
                    </p>
                  </div>
                </div>
              )}
              {activeSection === "data-export" && (
                <div className="space-y-6">
                  <p>Export your data in various formats.</p>
                </div>
              )}
              {activeSection === "resume-settings" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">
                    Resume Generation Settings
                  </h3>
                  <div className="space-y-2"></div>
                </div>
              )}
              {activeSection === "interview-settings" && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">AI Interview Settings</h3>
                </div>
              )}
              {activeSection === "review-settings" && (
                <div className="space-y-6"></div>
              )}
            </div>
          </ScrollArea>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
