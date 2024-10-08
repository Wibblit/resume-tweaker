"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { Settings } from "lucide-react";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";
import { useMediaQuery } from "react-responsive";
import { ResumeData } from "@/types/types";
import { usePathname } from "next/navigation";

export default function Editor() {
  const [activeSection, setActiveSection] = useState<keyof ResumeData | "">("basics");
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const ResumeAppearance = useAppSelector((state)=> state.rightsidebar)

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const currentRoute = usePathname();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-grow overflow-hidden">
        <div>
          <LeftSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            isPanelOpen={isPanelOpen}
            setIsPanelOpen={setIsPanelOpen}
          />
        </div>
        <div
          className={`flex-grow overflow-auto ${
            isPhoneView ? "flex justify-center items-start" : ""
          }`}
        >
          <div className={`${isPhoneView ? "w-full max-w-md" : ""}`}>
            <ResumePages
              baseColor={ResumeAppearance.baseColor}
              fontFamily={ResumeAppearance.font}
              lineHeight={ResumeAppearance.lineHeight}
              fontSize={ResumeAppearance.fontSize}
              margin={ResumeAppearance.margin}
              pageFormat={ResumeAppearance.paperFormat}
              printFrameRef={printFrameRef}
              resumeData={ResumeData}
              isPhoneView={isPhoneView}
              isPanelOpen={isPanelOpen}
              setIsPanelOpen={setIsPanelOpen}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
            />
          </div>
        </div>
        {!isPhoneView && (
          <RightSideBar
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            isMobileMenuOpen={isMobileMenuOpen}
            currentRoute={currentRoute}
            printFrameRef={printFrameRef}
          />
        )}
      </div>

      {isPhoneView && (
        <RightSideBar
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          isMobileMenuOpen={isMobileMenuOpen}
          currentRoute={currentRoute}
          printFrameRef={printFrameRef}
        />
      )}
    </div>
  );
}
