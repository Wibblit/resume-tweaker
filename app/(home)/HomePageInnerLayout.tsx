"use client";

import type React from "react";

import { usePathname } from "next/navigation";
import { MobileSideBar } from "@/components/Sidebar/MobileSideBar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  updateLoadingTrue,
  updateCredits,
  updateResumeSlot,
  updateCoverSlot,
  updateLoadingFalse,
} from "@/slices/userAssets";
import { useToast } from "@/hooks/use-toast";

export default function InnerLayout({
  children,
  session,
  defaultOpen,
  creditsData,
}: {
  children: React.ReactNode;
  session: any;
  defaultOpen: boolean;
  creditsData: {
    id: string;
    userId: string;
    credits: number;
    resumeslot: number;
    coverslot: number;
    updatedAt: Date;
  } | null;
}) {
  const pathName = usePathname();
  const noSidebarPaths = ["/home/editor", "/home/covereditor"];
  const hideSidebar = noSidebarPaths.some((route) =>
    pathName.startsWith(route)
  );

  const dispatch = useAppDispatch();
  const { toast } = useToast();

  // Get current state from Redux to compare
  const currentCredits = useAppSelector((state) => state.assets.credits);
  const currentResumeSlot = useAppSelector(
    (state) => state.assets.resumeslot
  );
  const currentCoverSlot = useAppSelector(
    (state) => state.assets.coverslot
  );

  const initialized = useRef(false);

  // useEffect(() => {
  //   // Only update Redux if we haven't initialized yet or if the data has changed
  //   if (!initialized.current && creditsData) {
  //     dispatch(updateLoadingTrue());

  //     dispatch(updateCredits(creditsData.credits));
  //     dispatch(updateResumeSlot(creditsData.resumeslot));
  //     dispatch(updateCoverSlot(creditsData.coverslot));

  //     dispatch(updateLoadingFalse());

  //     initialized.current = true;
  //   } else if (
     
  //     creditsData &&
  //     (currentCredits !== creditsData.credits ||
  //       currentResumeSlot !== creditsData.resumeslot ||
  //       currentCoverSlot !== creditsData.coverslot)
  //   ) {
  //      console.log("redux cleared");
  //     // Only update if the data has actually changed
  //     dispatch(updateLoadingTrue());

  //     dispatch(updateCredits(creditsData.credits));
  //     dispatch(updateResumeSlot(creditsData.resumeslot));
  //     dispatch(updateCoverSlot(creditsData.coverslot));

  //     dispatch(updateLoadingFalse());
  //   } else if (!creditsData && !initialized.current) {
  //     toast({
  //       title: "Failed to Load Credits",
  //       description: "Unable to fetch your credits. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // }, [
  //   creditsData,
  //   dispatch,
  //   toast,
  //   currentCredits,
  //   currentResumeSlot,
  //   currentCoverSlot,
  // ]);

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
