"use client";

import { useState, useRef, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import RightSideBar from "@/components/EditorRightSideBar";
import { useMediaQuery } from "react-responsive";
import CoverLeftSideBar from "./CoverEditorLeftSideBar";
import CoverLetterPages from "./coverPage";
import { usePathname } from "next/navigation";
import { CoverLetterState } from "@/types/types";
import { savecoverData } from "@/actions/saveCoverLetterData";
import { setCurrentCover } from "@/slices/currentCoverSlice";
import axios from "axios";
import { CPageData } from "@/types/types";
import { updateCoverLetter } from "@/slices/coverletterSlice";
import {
  UpdateBaseColor,
  UpdateFont,
  UpdateFontSize,
  UpdateIcons,
  UpdateId,
  UpdateLineHeight,
  UpdateMargin,
  UpdatePaperFormat,
  UpdateSeparator,
} from "@/slices/rightsidebarSlice";

export default function CoverEditor() {
  const [activeSection, setActiveSection] = useState<
    keyof CoverLetterState | ""
  >("salutation");
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const CoverLetterData = useAppSelector((state) => state.coverletter);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);
  const { currCoverId } = useAppSelector((state) => state.currentCoverLetter);

  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const dispatch = useAppDispatch();

  const currentRoute = usePathname();

  const saveData = async () => {
    try {
      await savecoverData(CoverLetterData, ResumeAppearance, currCoverId);
      console.log("Cover letter data saved successfully");
    } catch (error) {
      console.error("Error saving cover letter data:", error);
    }
  };

  useEffect(() => {
    async function getCoverData() {
      try {
        setIsLoading(true);
        const coverId = currCoverId
          ? currCoverId
          : localStorage.getItem("currCoverId");
        const response = await axios.get<{
          coverData: CPageData;
          message: string;
        }>(`/api/get-cover-letter-data/${coverId}`);
        console.log(response);
        const coverData = response.data.coverData;
        console.log(coverData);
        console.log("Hello This is to show that the response has recived.")
        const {
          id,
          styles,
          coverName,
          userId,
          salutation,
          date,
          recipientInfo,
          subject,
          opening,
          interestInPosition,
          professionalSummary,
          keyAchievements,
          culturalFit,
          closing,
          signOff,
        } = coverData;
        dispatch(
          setCurrentCover({
            currCoverId: coverData.id,
            currCoverName: coverData.coverName,
          })
        );
        dispatch(
          updateCoverLetter({
            salutation,
            date,
            recipientInfo,
            subject,
            opening,
            interestInPosition,
            professionalSummary,
            keyAchievements,
            culturalFit,
            closing,
            signOff,
          })
        );
        dispatch(UpdateId(styles.id));
        dispatch(UpdateBaseColor(styles.baseColor));
        dispatch(UpdateFont(styles.font));
        dispatch(UpdateFontSize(styles.fontSize));
        dispatch(UpdateLineHeight(styles.lineHeight));
        dispatch(UpdateMargin(styles.margin));
        dispatch(UpdateIcons(styles.icons));
        dispatch(UpdateSeparator(styles.separator));
        dispatch(UpdatePaperFormat(styles.paperFormat));
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getCoverData();
  }, [dispatch]);

  useEffect(() => {
    const handleRouteChange = async () => {
      await saveData();
    };

    const handlePopState = async () => {
      await handleRouteChange();
    };

    const handleBeforeUnload = async () => {
      console.log("Calling");
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
  }, [CoverLetterData, ResumeAppearance, currCoverId]);

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
