import { MobileSideBar } from "@/components/Sidebar/MobileSideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";
import InnerLayout from "./HomePageInnerLayout"; // Import the new client component
import { Metadata } from "next";
export const metadata : Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  title: {
    default: "Home",
    template: "%s | ResumeTweaker",
  },
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // Runs on the server

  return <InnerLayout session={session}>{children}</InnerLayout>;
}
