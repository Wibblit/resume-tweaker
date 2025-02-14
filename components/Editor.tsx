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
  UpdateSeparator,
  UpdateSections,
  updateDateType,
} from "@/slices/rightsidebarSlice";
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { UpdateLeftBarData } from "@/slices/leftsidebarSlice";
import { setFullProfileData } from "@/slices/profileSlice";
import { useToast } from "@/hooks/use-toast";
import { initialState } from "@/slices/leftsidebarSlice";
import { updateResumeIsSave } from "@/slices/currentResumeSlices";

export default function Editor() {
  const [activeSection, setActiveSection] = useState<keyof ResumeData | "">(
    "basics"
  );
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const ResumeData = useAppSelector((state) => state.leftsidebar);
  const resumeStyles = useAppSelector((state) => state.rightsidebar);
  const { currResumeId } = useAppSelector((state) => state.currentResume);
  const printFrameRef = useRef<HTMLIFrameElement | null>(null);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const dispatch = useAppDispatch();

  const isSave = useAppSelector((state) => state?.currentResume?.isSave);

  console.log(isSave);

  const currentRoute = usePathname();

  useEffect(() => {
    async function getResumeData() {
      try {
        setIsLoading(true);
        const resumeId = currResumeId
          ? currResumeId
          : localStorage.getItem("currResumeId");
        const response = await axios.get<{
          resumeData: PageData;
          message: string;
        }>(`/api/get-resume-data/${resumeId}`);
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        const resumeData = response.data.resumeData;
        console.log(resumeData);
        const { id, styles, resumeName, userId, ...leftSidebBarContent } =
          resumeData;
        document.title = resumeName
          ? `${resumeName}-Resume-ResumeTweaker`
          : "ResumeTweaker";
        const updatedLeftsidebardata = { ...leftSidebBarContent };
        if (
          //@ts-ignore
          updatedLeftsidebardata.custom &&
          //@ts-ignore
          typeof updatedLeftsidebardata.custom === "object"
        ) {
          //@ts-ignore
          Object.keys(updatedLeftsidebardata.custom).forEach((key) => {
            //@ts-ignore
            if (!updatedLeftsidebardata[key]) {
              //@ts-ignore
              updatedLeftsidebardata[key] = updatedLeftsidebardata.custom[key];
            }
          });
          //@ts-ignore
          delete updatedLeftsidebardata.custom;
        }

        console.log("Updated Left Sidebar Data:", updatedLeftsidebardata);

        dispatch(
          setCurrentResume({
            currResumeId: resumeData.id,
            currResumeName: resumeData.resumeName,
          })
        );
        console.log(styles.baseColor);

        if (styles.id) {
          dispatch(UpdateId(styles.id));
        }

        if (leftSidebBarContent.basics?.length !== 0) {
          console.log(leftSidebBarContent);
          dispatch(UpdateLeftBarData(updatedLeftsidebardata));
        } else {
          dispatch(UpdateLeftBarData(initialState));
        }
        if (styles.font) {
          dispatch(UpdateFont(styles.font));
        }
        if (styles.fontSize) {
          dispatch(UpdateFontSize(styles.fontSize));
        }
        if (styles.lineHeight) {
          dispatch(UpdateLineHeight(styles.lineHeight));
        }
        if (styles.margin) {
          dispatch(UpdateMargin(styles.margin));
        }
        if (styles.icons) {
          dispatch(UpdateIcons(styles.icons));
        }
        if (styles.separator) {
          dispatch(UpdateSeparator(styles.separator));
        }
        if (styles.paperFormat) {
          dispatch(UpdatePaperFormat(styles.paperFormat));
        }
        if (styles.sectionOrder) {
          dispatch(UpdateSectionOrderLayout(styles.sectionOrder));
        }
        if (styles.sections) {
          dispatch(UpdateSections(styles.sections));
        }
        if (styles.baseColor) {
          dispatch(UpdateBaseColor(styles.baseColor));
        }
        if (styles.datetype) {
          dispatch(updateDateType(styles.datetype));
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getResumeData();
  }, [dispatch]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get("/api/get-profile");
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }

        const { profileData } = response.data;
        console.log(profileData);

        if (profileData) {
          const parsedData = {
            basics: profileData.basics,
            summary: profileData.summary,
            profiles: profileData.profiles,
            skills: profileData.skills,
            projects: profileData.projects,
            education: profileData.education,
            experience: profileData.experience,
            languages: profileData.languages,
            volunteer: profileData.volunteer,
            awards: profileData.awards,
            publications: profileData.publications,
            certifications: profileData.certifications,
            references: profileData.references,
          };

          dispatch(setFullProfileData(parsedData));
        }
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchProfileData();
  }, [dispatch]);

  const saveData = async () => {
    if (!isSave) return;

    try {
      console.log(resumeStyles);
      const res = await saveResumeData(ResumeData, resumeStyles, currResumeId);
      if (res.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }
      console.log("Reusme Update suceess");
      toast({
        title: "Success",
        description: "The resume has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the resume.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleRouteChange = async () => {
      dispatch(updateResumeIsSave(true));
      if (!isSave) return; // Skip saving if isSave is false
      await saveData();
    };

    const handlePopState = async () => {
      dispatch(updateResumeIsSave(true));
      if (!isSave) return;
      await handleRouteChange();
    };

    const handleBeforeUnload = async (event: any) => {
      dispatch(updateResumeIsSave(true));
      if (!isSave) return;
      await saveData();
    };

    const originalPushState = window.history.pushState;
    window.history.pushState = function (state, title, url) {
      if (isSave) handleRouteChange();
      originalPushState.apply(window.history, [state, title, url]);
    };

    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function (state, title, url) {
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
  }, [ResumeData, resumeStyles, currResumeId, isSave]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <div className="flex flex-grow overflow-hidden">
        <div>
          <LeftSideBar
            activeSection={activeSection}
            //@ts-ignore
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
