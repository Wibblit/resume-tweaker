"use client";

import { useState, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks";
import RightSideBar from "@/components/EditorRightSideBar";
import { useMediaQuery } from "react-responsive";
import CoverLeftSideBar from "./CoverEditorLeftSideBar";
import CoverLetterPages from "./coverPage";
import { usePathname } from "next/navigation";
import { CoverLetterState } from "@/types/types";

export default function CoverEditor() {
  const [activeSection, setActiveSection] = useState<
    keyof CoverLetterState | ""
  >("salutation");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const CoverLetterData = useAppSelector((state) => state.coverletter);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const currentRoute = usePathname();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-grow overflow-hidden">
        <div className="relative">
          <CoverLeftSideBar
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
            <CoverLetterPages
              baseColor={ResumeAppearance.baseColor}
              fontFamily={ResumeAppearance.font}
              lineHeight={ResumeAppearance.lineHeight}
              fontSize={ResumeAppearance.fontSize}
              margin={ResumeAppearance.margin}
              pageFormat={ResumeAppearance.paperFormat}
              printFrameRef={printFrameRef}
              coverLetterData={CoverLetterData}
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
            printFrameRef={printFrameRef}
            currentRoute={currentRoute}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />
        )}
      </div>

      {isPhoneView && (
        <RightSideBar
          printFrameRef={printFrameRef}
          currentRoute={currentRoute}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
      )}
    </div>
  );
}
