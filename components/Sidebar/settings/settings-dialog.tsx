"use client";

import { useState } from "react";
import {
  Settings,
  User,
  PaintbrushIcon as PaintBrushIcon,
  Download,
  Shield,
  MessageSquare,
  Languages,
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
import DataExport from "./DataExport";
import { Switch } from "@/components/ui/switch";
export function SettingsDialog({ isCollapsed }: { isCollapsed: boolean }) {
  const [activeSection, setActiveSection] = useState("account");
  const { data: session } = useSession();
  const { setTheme, theme } = useTheme();

  const settingsSections = [
    { title: "Account", icon: User, id: "account" },
    { title: "Appearance", icon: PaintBrushIcon, id: "appearance" },
    { title: "Data Export", icon: Download, id: "data-export" },
    { title: "Notifications", icon: MessageSquare, id: "notifications" },
    { title: "Privacy", icon: Shield, id: "privacy" },
    { title: "Language", icon: Languages, id: "language" },
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
                  <DataExport />
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Export your data to keep a backup of your information or
                      transfer it to other platforms. You can download your
                      complete history of resumes, interviews, and reviews.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The <strong>JSON format</strong> provides a comprehensive
                      backup suitable for data migration, while the{" "}
                      <strong>CSV format</strong> offers a human-readable
                      version of your documents. All exports are encrypted and
                      include only your personal data.
                    </p>
                  </div>
                </div>
              )}
              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Notification Preferences</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about new AI features and
                            improvements
                          </p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Usage Reports</Label>
                          <p className="text-sm text-muted-foreground">
                            Get weekly summaries of your AI interactions and
                            document creations
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "privacy" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Privacy Settings</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>AI Processing</Label>
                        <p className="text-sm text-muted-foreground">
                          All AI interactions are processed by Google's Gemini
                          API and are subject to Google's privacy policy and
                          data handling practices.
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Document Storage</Label>
                          <p className="text-sm text-muted-foreground">
                            Store history of generated resumes and cover letters
                            (Requires available credits. New documents won't be
                            stored if you've reached your credit limit)
                          </p>
                        </div>
                        <Switch disabled checked />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Note: Document storage is tied to your available
                        credits. Purchase additional credits to increase your
                        storage capacity and continue saving new documents.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {activeSection === "language" && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Language Settings</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Language</Label>
                          <p className="text-sm text-muted-foreground">
                            Currently only available in English
                          </p>
                        </div>
                        <Select defaultValue="en" disabled>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        We're working on adding support for more languages in
                        the future. Stay tuned for updates!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
