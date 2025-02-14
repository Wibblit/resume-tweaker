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
import { updateDateType } from "@/slices/rightsidebarSlice";
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
import { useToast } from "@/hooks/use-toast";
import { updateCoverLetterIsSave } from "@/slices/currentCoverSlice";

export default function CoverEditor() {
  const [activeSection, setActiveSection] = useState<
    keyof CoverLetterState | string
  >("salutation");
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const CoverLetterData = useAppSelector((state) => state.coverletter);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar) as any;
  const { currCoverId } = useAppSelector((state) => state.currentCoverLetter);
  const { toast } = useToast();
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const dispatch = useAppDispatch();

  const isSave = useAppSelector((state) => state?.currentCoverLetter?.isSave);

  const currentRoute = usePathname();

  const saveData = async () => {
    if (!isSave) return;

    try {
      const response = await savecoverData(
        CoverLetterData,
        ResumeAppearance,
        currCoverId
      );
      if (response.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "The cover letter has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the cover letter.",
        variant: "destructive",
      });
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
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        //console.log(response);
        const coverData = response.data.coverData;
        //console.log(coverData);
        //console.log("Hello This is to show that the response has received.");
        const {
          id,
          styles,
          coverName,
          userId,
          salutation,
          date,
          senderInfo,
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
        localStorage.setItem("currCoverId", id);
        document.title = coverName
          ? `${coverName}-CoverLetter-ResumeTweaker`
          : "ResumeTweaker";

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
            senderInfo,
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
        if (styles.id) dispatch(UpdateId(styles.id));
        if (styles.font) dispatch(UpdateFont(styles.font));
        if (styles.fontSize) dispatch(UpdateFontSize(styles.fontSize));
        if (styles.lineHeight) dispatch(UpdateLineHeight(styles.lineHeight));
        if (styles.margin) dispatch(UpdateMargin(styles.margin));
        if (styles.icons) dispatch(UpdateIcons(styles.icons));
        if (styles.separator) dispatch(UpdateSeparator(styles.separator));
        if (styles.paperFormat) dispatch(UpdatePaperFormat(styles.paperFormat));
        if (styles.baseColor) dispatch(UpdateBaseColor(styles.baseColor));
        if (styles.datetype) dispatch(updateDateType(styles.datetype));
      } catch (error) {
        console.error("Error fetching cover letter data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getCoverData();
  }, [dispatch]);

  useEffect(() => {
    const handleRouteChange = async () => {
      dispatch(updateCoverLetterIsSave(true));
      if (!isSave) return; // Skip saving if isSave is false
      await saveData();
    };

    const handlePopState = async () => {
      dispatch(updateCoverLetterIsSave(true));
      if (!isSave) return; // Skip saving if isSave is false
      await handleRouteChange();
    };

    const handleBeforeUnload = async (event: BeforeUnloadEvent) => {
      dispatch(updateCoverLetterIsSave(true));
      if (!isSave) return; // Skip saving if isSave is false
      await saveData();
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = async function (state, title, url) {
      if (isSave) handleRouteChange();
      originalPushState.apply(window.history, [state, title, url]);
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = async function (state, title, url) {
      if (isSave) handleRouteChange();
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
  }, [CoverLetterData, ResumeAppearance, currCoverId, isSave]);

  return (
    <div className="flex flex-col h-screen bg-background">
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
              isLoading={isLoading}
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
