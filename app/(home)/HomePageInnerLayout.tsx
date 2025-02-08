"use client";

import { usePathname } from "next/navigation";
import { MobileSideBar } from "@/components/Sidebar/MobileSideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function InnerLayout({ children, session }: { children: React.ReactNode; session: any }) {
  const pathName = usePathname();
  const noSidebarPaths = ["/home/editor", "/home/covereditor"];
  const hideSidebar = noSidebarPaths.some((route) => pathName.startsWith(route));

  return hideSidebar ? (
    <main>{children}</main>
  ) : (
    <>
      <MobileSideBar session={session!} />
      <SidebarProvider>
        <AppSidebar session={session!} />
        <SidebarInset>
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
