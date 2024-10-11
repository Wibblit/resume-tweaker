"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import LeftSideBar from "@/components/EditorLeftSideBar";
import RightSideBar from "@/components/EditorRightSideBar";
import ResumePages from "@/components/ResumePages";
import { useMediaQuery } from "react-responsive";
import { ResumeData } from "@/types/types";
import { usePathname } from "next/navigation";
import { saveResumeData } from "@/actions/saveResumeData";
import axios from "axios";
import { PageData } from "@/types/types";
import { 
  UpdateBaseColor, 
  UpdateFont, 
  UpdateFontSize, 
  UpdateIcons, 
  UpdateId, 
  UpdateLineHeight, 
  UpdateMargin, 
  UpdatePaperFormat, 
  updateSectionOrder, 
  UpdateSectionOrderLayout, 
  UpdateSeparator 
} from "@/slices/rightsidebarSlice";
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { UpdateLeftBarData } from "@/slices/leftsidebarSlice";

export default function Editor() {
  const [activeSection, setActiveSection] = useState<keyof ResumeData | "">("basics");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const resumeStyles = useAppSelector((state) => state.rightsidebar);
  const { currResumeId } = useAppSelector((state) => state.currentResume);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const dispatch = useAppDispatch();

  const currentRoute = usePathname();

  useEffect(() => {
    async function getResumeData() {
      try {
        setIsLoading(true);
        const resumeId = currResumeId ? currResumeId : localStorage.getItem("currResumeId");
        const response = await axios.get<{ resumeData: PageData; message: string }>(`/api/get-resume-data/${resumeId}`);
        const resumeData = response.data.resumeData;
        console.log(resumeData);
        const { id, styles, resumeName, userId, ...leftSidebBarContent } = resumeData;
        dispatch(setCurrentResume({
          currResumeId: resumeData.id,
          currResumeName: resumeData.resumeName,
        }));
        console.log(styles.baseColor)
        dispatch(UpdateId(styles.id));
        dispatch(UpdateLeftBarData(leftSidebBarContent));
        dispatch(UpdateFont(styles.font));
        dispatch(UpdateFontSize(styles.fontSize));
        dispatch(UpdateLineHeight(styles.lineHeight));
        dispatch(UpdateMargin(styles.margin));
        dispatch(UpdateIcons(styles.icons));
        dispatch(UpdateSeparator(styles.separator));
        dispatch(UpdatePaperFormat(styles.paperFormat));
        dispatch(UpdateSectionOrderLayout(styles.sectionOrder));
        dispatch(UpdateBaseColor(styles.baseColor));
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getResumeData();
  }, [dispatch]);

  const saveData = async () => {
    try {
      console.log(resumeStyles);
      await saveResumeData(ResumeData, resumeStyles, currResumeId);
      console.log("Resume data saved successfully");
    } catch (error) {
      console.error("Error saving resume data:", error);
    }
  };

  useEffect(() => {
    const handleRouteChange = async () => {
      await saveData();
    };

    const handlePopState = async () => {
      await handleRouteChange();
    };

    const handleBeforeUnload = async () => {
      await saveData();
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = async function (state, title, url) {
      await handleRouteChange();
      originalPushState.apply(window.history, [state, title, url]);
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = async function (state, title, url) {
      await handleRouteChange();
      originalReplaceState.apply(window.history, [state, title, url]);
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, [ResumeData, resumeStyles, currResumeId]);

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
              baseColor={resumeStyles.baseColor}
              fontFamily={resumeStyles.font}
              lineHeight={resumeStyles.lineHeight}
              fontSize={resumeStyles.fontSize}
              margin={resumeStyles.margin}
              pageFormat={resumeStyles.paperFormat}
              printFrameRef={printFrameRef}
              resumeData={ResumeData}
              isPhoneView={isPhoneView}
              isPanelOpen={isPanelOpen}
              setIsPanelOpen={setIsPanelOpen}
              isMobileMenuOpen={isMobileMenuOpen}
              setIsMobileMenuOpen={setIsMobileMenuOpen}
              isLoading={isLoading}
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