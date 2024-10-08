// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   ChevronLeft,
//   ChevronRight,
//   UserPlus,
//   Calendar,
//   Mail,
//   FileText,
//   Briefcase,
//   Users,
//   ThumbsUp,
//   Send,
// } from "lucide-react";
// import { useMediaQuery } from "react-responsive";
// import { useAppDispatch } from "@/hooks/hooks";
// import { updateCoverLetter } from "@/slices/coverletterSlice";
// import { RichInput } from "./TextEditor";

// interface LeftSideBarProps {
//   activeSection: string;
//   setActiveSection: React.Dispatch<React.SetStateAction<string>>;
// }

// interface CoverLetterSection {
//   id: keyof CoverLetterData;
//   icon: JSX.Element;
//   title: string;
//   helperText: string;
// }

// interface CoverLetterData {
//   salutation: string;
//   date: string;
//   recipientInfo: string;
//   subject: string;
//   opening: string;
//   interestInPosition: string;
//   professionalSummary: string;
//   keyAchievements: string;
//   culturalFit: string;
//   closing: string;
//   signOff: string;
// }

// export default function CoverLeftSideBar({
//   activeSection,
//   setActiveSection,
// }: LeftSideBarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
//     salutation: "",
//     date: "",
//     recipientInfo: "",
//     subject: "",
//     opening: "",
//     interestInPosition: "",
//     professionalSummary: "",
//     keyAchievements: "",
//     culturalFit: "",
//     closing: "",
//     signOff: "",
//   });
//   const dispatch = useAppDispatch();
//   const isPhoneView = useMediaQuery({ maxWidth: 767 });

//   const coverLetterSections: CoverLetterSection[] = [
//     {
//       id: "salutation",
//       icon: <UserPlus className="w-4 h-4" />,
//       title: "Salutation",
//       helperText:
//         "Start with a professional greeting, e.g., 'Dear Hiring Manager,'",
//     },
//     {
//       id: "date",
//       icon: <Calendar className="w-4 h-4" />,
//       title: "Date",
//       helperText:
//         "Include the current date in a standard format, e.g., 'July 10, 2023'",
//     },
//     {
//       id: "recipientInfo",
//       icon: <Mail className="w-4 h-4" />,
//       title: "Recipient Information",
//       helperText:
//         "Add the recipient's name, title, company, and address if available",
//     },
//     {
//       id: "subject",
//       icon: <FileText className="w-4 h-4" />,
//       title: "Subject",
//       helperText:
//         "Clearly state the position you're applying for, e.g., 'Re: Application for Software Developer Position'",
//     },
//     {
//       id: "opening",
//       icon: <FileText className="w-4 h-4" />,
//       title: "Opening",
//       helperText:
//         "Start with a strong opening paragraph that grabs attention and states your purpose",
//     },
//     {
//       id: "interestInPosition",
//       icon: <Briefcase className="w-4 h-4" />,
//       title: "Interest in Position",
//       helperText:
//         "Explain why you're interested in this specific role and company",
//     },
//     {
//       id: "professionalSummary",
//       icon: <FileText className="w-4 h-4" />,
//       title: "Professional Summary",
//       helperText: "Briefly highlight your relevant skills and experiences",
//     },
//     {
//       id: "keyAchievements",
//       icon: <ThumbsUp className="w-4 h-4" />,
//       title: "Key Achievements",
//       helperText:
//         "Mention 1-2 specific accomplishments that demonstrate your value",
//     },
//     {
//       id: "culturalFit",
//       icon: <Users className="w-4 h-4" />,
//       title: "Cultural Fit",
//       helperText: "Show how your values align with the company's culture",
//     },
//     {
//       id: "closing",
//       icon: <FileText className="w-4 h-4" />,
//       title: "Closing",
//       helperText:
//         "Summarize your interest and request for an interview or next steps",
//     },
//     {
//       id: "signOff",
//       icon: <Send className="w-4 h-4" />,
//       title: "Sign-off",
//       helperText:
//         "End with a professional closing, e.g., 'Sincerely,' followed by your name",
//     },
//   ];

//   useEffect(() => {
//     if (isPhoneView) {
//       setIsCollapsed(true);
//     }
//   }, [isPhoneView]);

//   useEffect(() => {
//     dispatch(updateCoverLetter(coverLetterData));
//   }, [coverLetterData, dispatch]);

//   const updateCoverLetterData = (
//     section: keyof CoverLetterData,
//     value: string
//   ) => {
//     setCoverLetterData((prev) => ({
//       ...prev,
//       [section]: value,
//     }));
//   };

//   const renderSheetContent = (section: keyof CoverLetterData) => {
//     const sectionData = coverLetterSections.find((s) => s.id === section);

//     const richInputSections = [
//       "opening",
//       "interestInPosition",
//       "professionalSummary",
//       "keyAchievements",
//       "culturalFit",
//       "closing",
//     ];

//     return (
//       <div className="flex flex-col h-full">
//         <ScrollArea className="flex-grow pr-4 my-8">
//           <div className="space-y-4">
//             <Label htmlFor={section}>{sectionData?.title}</Label>
//             {section === "date" ? (
//               <Input
//                 id={section}
//                 type="date"
//                 value={coverLetterData[section]}
//                 onChange={(e) => updateCoverLetterData(section, e.target.value)}
//               />
//             ) : richInputSections.includes(section) ? (
//               <RichInput
//                 content={coverLetterData[section]}
//                 onContentChange={(value) =>
//                   updateCoverLetterData(section, value)
//                 }
//               />
//             ) : (
//               <Textarea
//                 id={section}
//                 value={coverLetterData[section]}
//                 onChange={(e) => updateCoverLetterData(section, e.target.value)}
//                 placeholder={sectionData?.helperText}
//                 className="min-h-[200px]"
//               />
//             )}
//           </div>
//         </ScrollArea>
//       </div>
//     );
//   };

//   return (
//     <div
//       className={`relative h-screen border-r transition-all duration-300 ease-in-out ${
//         isCollapsed ? "w-16" : "w-64"
//       }`}
//     >
//       <div className="flex flex-col h-full">
//         <div className="p-4 border-b flex justify-between items-center">
//           {!isCollapsed && (
//             <h2 className="text-lg font-semibold">Cover Letter Sections</h2>
//           )}
//           <Button
//             variant="ghost"
//             size="icon"
//             onClick={() => setIsCollapsed(!isCollapsed)}
//           >
//             {isCollapsed ? (
//               <ChevronRight className="h-4 w-4" />
//             ) : (
//               <ChevronLeft className="h-4 w-4" />
//             )}
//           </Button>
//         </div>
//         <ScrollArea className="flex-grow">
//           <div className="p-4 space-y-4">
//             {coverLetterSections.map((section) => (
//               <Sheet key={section.id}>
//                 <SheetTrigger asChild>
//                   <Button
//                     variant={activeSection === section.id ? "default" : "ghost"}
//                     className={`w-full justify-start ${
//                       isCollapsed ? "px-2" : ""
//                     }`}
//                     onClick={() => setActiveSection(section.id)}
//                   >
//                     {section.icon}
//                     {!isCollapsed && (
//                       <span className="ml-2">{section.title}</span>
//                     )}
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="w-[400px] sm:w-[540px]">
//                   <SheetHeader>
//                     <SheetTitle>Edit {section.title}</SheetTitle>
//                     <SheetDescription>{section.helperText}</SheetDescription>
//                   </SheetHeader>
//                   {renderSheetContent(section.id)}
//                 </SheetContent>
//               </Sheet>
//             ))}
//           </div>
//         </ScrollArea>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Calendar,
  Mail,
  FileText,
  Briefcase,
  Users,
  ThumbsUp,
  Send,
  Menu,
  Settings,
} from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useAppDispatch } from "@/hooks/hooks";
import { updateCoverLetter } from "@/slices/coverletterSlice";
import { RichInput } from "./TextEditor";
import LeftSidePanel from "./LeftSidePanel";
import { CoverLetterData } from "@/types/types";

interface CoverLeftSideBarProps {
  activeSection: keyof CoverLetterData | "";
  setActiveSection: React.Dispatch<
    React.SetStateAction<keyof CoverLetterData | "">
  >;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface CoverLetterSection {
  id: keyof CoverLetterData;
  icon: JSX.Element;
  title: string;
  helperText: string;
}


export default function CoverLeftSideBar({
  activeSection,
  setActiveSection,
  isPanelOpen,
  setIsPanelOpen,
}: CoverLeftSideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData>({
    salutation: "",
    date: "",
    recipientInfo: "",
    subject: "",
    opening: "",
    interestInPosition: "",
    professionalSummary: "",
    keyAchievements: "",
    culturalFit: "",
    closing: "",
    signOff: "",
  });
  const dispatch = useAppDispatch();
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const coverLetterSections: CoverLetterSection[] = [
    {
      id: "salutation",
      icon: <UserPlus className="w-4 h-4" />,
      title: "Salutation",
      helperText:
        "Start with a professional greeting, e.g., 'Dear Hiring Manager,'",
    },
    {
      id: "date",
      icon: <Calendar className="w-4 h-4" />,
      title: "Date",
      helperText:
        "Include the current date in a standard format, e.g., 'July 10, 2023'",
    },
    {
      id: "recipientInfo",
      icon: <Mail className="w-4 h-4" />,
      title: "Recipient Information",
      helperText:
        "Add the recipient's name, title, company, and address if available",
    },
    {
      id: "subject",
      icon: <FileText className="w-4 h-4" />,
      title: "Subject",
      helperText:
        "Clearly state the position you're applying for, e.g., 'Re: Application for Software Developer Position'",
    },
    {
      id: "opening",
      icon: <FileText className="w-4 h-4" />,
      title: "Opening",
      helperText:
        "Start with a strong opening paragraph that grabs attention and states your purpose",
    },
    {
      id: "interestInPosition",
      icon: <Briefcase className="w-4 h-4" />,
      title: "Interest in Position",
      helperText:
        "Explain why you're interested in this specific role and company",
    },
    {
      id: "professionalSummary",
      icon: <FileText className="w-4 h-4" />,
      title: "Professional Summary",
      helperText: "Briefly highlight your relevant skills and experiences",
    },
    {
      id: "keyAchievements",
      icon: <ThumbsUp className="w-4 h-4" />,
      title: "Key Achievements",
      helperText:
        "Mention 1-2 specific accomplishments that demonstrate your value",
    },
    {
      id: "culturalFit",
      icon: <Users className="w-4 h-4" />,
      title: "Cultural Fit",
      helperText: "Show how your values align with the company's culture",
    },
    {
      id: "closing",
      icon: <FileText className="w-4 h-4" />,
      title: "Closing",
      helperText:
        "Summarize your interest and request for an interview or next steps",
    },
    {
      id: "signOff",
      icon: <Send className="w-4 h-4" />,
      title: "Sign-off",
      helperText:
        "End with a professional closing, e.g., 'Sincerely,' followed by your name",
    },
  ];

  useEffect(() => {
    if (isPhoneView) {
      setIsCollapsed(true);
    }
  }, [isPhoneView]);

  useEffect(() => {
    dispatch(updateCoverLetter(coverLetterData));
  }, [coverLetterData, dispatch]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const updateCoverLetterData = (
    section: keyof CoverLetterData,
    value: string
  ) => {
    setCoverLetterData((prev) => ({
      ...prev,
      [section]: value,
    }));
  };

  const renderSheetContent = (section: keyof CoverLetterData) => {
    const sectionData = coverLetterSections.find((s) => s.id === section);

    const richInputSections = [
      "opening",
      "interestInPosition",
      "professionalSummary",
      "keyAchievements",
      "culturalFit",
      "closing",
    ];

    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow pr-4 my-8">
          <div className="space-y-4">
            <Label htmlFor={section}>{sectionData?.title}</Label>
            {section === "date" ? (
              <Input
                id={section}
                type="date"
                value={coverLetterData[section]}
                onChange={(e) => updateCoverLetterData(section, e.target.value)}
              />
            ) : richInputSections.includes(section) ? (
              <RichInput
                content={coverLetterData[section]}
                onContentChange={(value) =>
                  updateCoverLetterData(section, value)
                }
              />
            ) : (
              <Textarea
                id={section}
                value={coverLetterData[section]}
                onChange={(e) => updateCoverLetterData(section, e.target.value)}
                placeholder={sectionData?.helperText}
                className="min-h-[200px]"
              />
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <>
      {isPhoneView ? (
        <LeftSidePanel<CoverLetterData>
          sections={coverLetterSections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          renderSheetContent={renderSheetContent}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
      ) : (
        <div
          ref={sidebarRef}
          className={`relative h-screen border-r transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-16" : ""
          }`}
          style={{ width: isCollapsed ? "4rem" : `${sidebarWidth}px` }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              {!isCollapsed && (
                <h2 className="text-lg font-semibold">Cover Letter Sections</h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-4 space-y-4">
                {coverLetterSections.map((section) => (
                  <Sheet key={section.id}>
                    <SheetTrigger asChild>
                      <Button
                        variant={
                          activeSection === section.id ? "default" : "ghost"
                        }
                        className={`w-full justify-start ${
                          isCollapsed ? "px-2" : ""
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        {section.icon}
                        {!isCollapsed && (
                          <span className="ml-2">{section.title}</span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[400px] sm:w-[540px]"
                    >
                      <SheetHeader>
                        <SheetTitle>Edit {section.title}</SheetTitle>
                        <SheetDescription>
                          {section.helperText}
                        </SheetDescription>
                      </SheetHeader>
                      {renderSheetContent(section.id)}
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-border hover:bg-muted"
            onMouseDown={() => setIsDragging(true)}
          />
        </div>
      )}
    </>
  );
}