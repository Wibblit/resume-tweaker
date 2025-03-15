"use client";

import { usePathname } from "next/navigation";
import { MobileSideBar } from "@/components/Sidebar/MobileSideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { cookies } from "next/headers";

export default function InnerLayout({
  children,
  session,
  defaultOpen,
}: {
  children: React.ReactNode;
  session: any;
  defaultOpen: boolean;
}) {
  const pathName = usePathname();
  const noSidebarPaths = ["/home/editor", "/home/covereditor"];
  const hideSidebar = noSidebarPaths.some((route) =>
    pathName.startsWith(route)
  );

  return hideSidebar ? (
    <main>{children}</main>
  ) : (
    <div className="w-full">
      <MobileSideBar session={session!} />
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar session={session!} />
        <SidebarInset className="overflow-x-auto">
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
