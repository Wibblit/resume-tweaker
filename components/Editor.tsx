"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/hooks";
import { Settings } from "lucide-react";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";
import { useMediaQuery } from "react-responsive";
import { usePathname } from "next/navigation";

export default function Editor() {
  const [activeSection, setActiveSection] = useState<string>("basics");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);

  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const currentRoute = usePathname();

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-grow overflow-hidden">
        <div className="">
          <LeftSideBar
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
            />
          </div>
        </div>

        {!isPhoneView && <RightSideBar printFrameRef={printFrameRef} currentRoute={currentRoute} />}
      </div>

      {isPhoneView && <RightSideBar printFrameRef={printFrameRef} currentRoute={currentRoute} />}
    </div>
  );
}
