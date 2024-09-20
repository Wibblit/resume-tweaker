"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks"; 
import {
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";

export default function ResumeBuilder() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [pageFormat, setPageFormat] = useState<"A4" | "LETTER">("A4");

  const ResumeData = useAppSelector((state) => state.leftsidebar)
  
  console.log(ResumeData.summary);

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
          baseColor="#333333"
          fontFamily="'Calibri', 'Arial', sans-serif"
          lineHeight={1.5}
          fontSize={12}
          margin={15}
          pageFormat={pageFormat}
        />
      </div>

      <AnimatePresence>{rightSidebarOpen && <RightSideBar />}</AnimatePresence>
    </div>
  );
}