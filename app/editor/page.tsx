"use client";

import { useState, useRef, MutableRefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ResumeBuilder() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("basics");
  const session = useSession(); 

  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);
  


  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

  if (session.status === "unauthenticated") {
    return redirect("/login")
  } 

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AnimatePresence>
        {leftSidebarOpen && (
          <LeftSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
          />
        )}
      </AnimatePresence>

      <div className="flex-grow flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => setLeftSidebarOpen(true)}
            className="md:hidden"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Resume Tweaker</h1>
          <Button
            variant="ghost"
            onClick={() => setRightSidebarOpen(true)}
            className="md:hidden"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
        <ResumePages
          baseColor={ResumeAppearance.baseColor}
          fontFamily={ResumeAppearance.font}
          lineHeight={ResumeAppearance.lineHeight}
          fontSize={ResumeAppearance.fontSize}
          margin={ResumeAppearance.margin}
          pageFormat={ResumeAppearance.paperFormat}
          printFrameRef={printFrameRef}
          resumeData={ResumeData}
        />
      </div>

      <AnimatePresence>
        {rightSidebarOpen && <RightSideBar printFrameRef={printFrameRef} />}
      </AnimatePresence>
    </div>
  );
}
