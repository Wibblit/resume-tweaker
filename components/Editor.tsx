"use client";

import { useState, useRef, MutableRefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { ChevronRight, ChevronLeft } from "lucide-react";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";

export default function Editor() {
  const [activeSection, setActiveSection] = useState<string>("basics");

  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <AnimatePresence>
        <LeftSideBar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      </AnimatePresence>

      <div className="flex-grow flex flex-col">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resume Tweaker</h1>
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
        <RightSideBar printFrameRef={printFrameRef} />
      </AnimatePresence>
    </div>
  );
}
