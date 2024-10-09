"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector } from "@/hooks/hooks";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";
import { useMediaQuery } from "react-responsive";
import { ResumeData } from "@/types/types";
import { usePathname } from "next/navigation";
import { saveResumeData } from "@/actions/saveResumeData";
import { useAppDispatch } from "@/hooks/hooks";
import axios from "axios";
import { PageData } from "@/types/types";
import { UpdateBaseColor, UpdateFont, UpdateFontSize, UpdateIcons, UpdateId, UpdateLineHeight, UpdateMargin, UpdatePaperFormat, updateSectionOrder, UpdateSectionOrderLayout, UpdateSeparator } from "@/slices/rightsidebarSlice";
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { UpdateLeftBarData } from "@/slices/leftsidebarSlice";


export default function Editor() {
  const [activeSection, setActiveSection] = useState<keyof ResumeData | "">("basics");
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);
  const { currResumeId } = useAppSelector((state) => state.currentResume);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const dispatch = useAppDispatch()

  const currentRoute = usePathname();

  useEffect(() => {
    async function getResumeData() {
      const resumeId = localStorage.getItem("currResumeId")
      const response = await axios.get<{ resumeData: PageData, message: string }>(`/api/getResumeData/${resumeId}`);
      const resumeData = response.data.resumeData;
      console.log(resumeData)
      const { id, styles, resumeName, userId, ...leftSidebBarContent } = resumeData;
      dispatch(setCurrentResume({
        currResumeId: resumeData.id,
        currResumeName: resumeData.resumeName,
      }))
      dispatch(UpdateId(styles.id))
      dispatch(UpdateLeftBarData(leftSidebBarContent))
      dispatch(UpdateBaseColor(styles.baseColor))
      dispatch(UpdateFont(styles.font))
      dispatch(UpdateFontSize(styles.fontSize))
      dispatch(UpdateLineHeight(styles.lineHeight))
      dispatch(UpdateMargin(styles.margin))
      dispatch(UpdateIcons(styles.icons))
      dispatch(UpdateSeparator(styles.separator))
      dispatch(UpdatePaperFormat(styles.paperFormat))
      dispatch(UpdateSectionOrderLayout(styles.sectionOrder))
    }
    getResumeData()
  }, [])

  const saveData = async () => {
    try {
      await saveResumeData(ResumeData, ResumeAppearance, currResumeId);
      console.log("Resume data saved successfully");
    } catch (error) {
      console.error("Error saving resume data:", error);
    }
  };

  useEffect(() => {
    const handleRouteChange = async () => {
      await saveData(); // Save resume data before navigating
    };

    const handlePopState = async () => {
      await handleRouteChange();
    };

    const handleBeforeUnload = async () => {
      await saveData(); // Save resume data before reload/close
    };

    // Override pushState to trigger save before navigating programmatically
    const originalPushState = window.history.pushState;
    window.history.pushState = async function (state, title, url) {
      await handleRouteChange(); // Save data before pushState
      originalPushState.apply(window.history, [state, title, url]); // Proceed with the original action
    };

    // Override replaceState similarly, if needed
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = async function (state, title, url) {
      await handleRouteChange(); // Save data before replaceState
      originalReplaceState.apply(window.history, [state, title, url]); // Proceed with the original action
    };

    // Listen for popstate events (back/forward navigation)
    window.addEventListener("popstate", handlePopState);

    // Listen for beforeunload events (reload/close browser window)
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.history.pushState = originalPushState; // Restore original pushState
      window.history.replaceState = originalReplaceState; // Restore original replaceState
    };
  }, [ResumeData, ResumeAppearance, currResumeId]);

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
