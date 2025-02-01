import { MobileSideBar } from "@/components/MobileSideBar";
// import SidebarContent from "@/components/SideBar";
// import { auth } from "@/auth";

// export default async function HomeLayout({ children }: { children: React.ReactNode }) {
//   const session = await auth();
//   return (
//     <div className="flex flex-col h-screen bg-background text-foreground">
//       <header className="fixed z-50 flex items-center justify-between px-4 bg-background border-b w-full py-3 lg:hidden">
//         <div className="flex items-center space-x-4 w-full justify-between">
//           <MobileSideBar session={session} />
//           <span className="text-xl text-zinc-800 dark:text-zinc-200">
//             <span className="text-zinc-500 dark:text-zinc-400">resume</span>
//             <span className="font-bold">tweaker</span>
//           </span>
//         </div>
//       </header>
//       <div className="flex flex-grow overflow-hidden pt-[62px] lg:pt-0">
//         <aside className="hidden w-64 border-r border-border lg:block overflow-y-auto">
//           <SidebarContent session={session} />
//         </aside>
//         <main className="flex-grow overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }

import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { FileText, Star, MessageSquare, User } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
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
