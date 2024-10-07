"use client";

import { useState, useRef } from "react";
import { useAppSelector } from "@/hooks/hooks";
import RightSideBar from "@/components/EditorRightSideBar";
import { useMediaQuery } from "react-responsive";
import CoverLeftSideBar from "./CoverEditorLeftSideBar";
import CoverLetterPages from "./coverPage";
import { usePathname } from "next/navigation";

export default function CoverEditor() {
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const CoverLetterData = useAppSelector((state) => state.coverletter);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const currentRoute = usePathname();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex md:hidden items-center justify-center p-4 border-b">
        <h1 className="text-2xl font-bold">Resume Tweaker</h1>
      </div>

      <div className="flex flex-grow overflow-hidden">
        <div className="relative">
          <CoverLeftSideBar
            activeSection={activeSection}
            setActiveSection={setActiveSection}
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
            />
          </div>
        </div>

        {!isPhoneView && (
          <RightSideBar
            printFrameRef={printFrameRef}
            currentRoute={currentRoute}
          />
        )}
      </div>

      {isPhoneView && (
        <RightSideBar
          printFrameRef={printFrameRef}
          currentRoute={currentRoute}
        />
      )}
    </div>
  );
}
