"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SidebarContent from "./MobileViewSidebarContent";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Session } from "next-auth";

interface MobileSideBarProps {
  session: Session | null;
}

export const MobileSideBar = ({ session }: MobileSideBarProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
      <SheetTrigger className="mt-4 ml-4 flex items-center justify-center" asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent setIsSidebarOpen={setIsSidebarOpen} session={session} />
      </SheetContent>
    </Sheet>
  );
};
