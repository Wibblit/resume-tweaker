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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  FileText,
  Award,
  Trophy,
  Settings,
  Heart,
  Star,
  Trash2,
  Book,
  Import,
  RotateCcw,
  Edit,
  Eraser,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LeftSidePanel from "./LeftSidePanel";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { Skill, URL, ResumeData, ResumeSection } from "@/types/types";
import { RichInput } from "./TextEditor";
import { useMediaQuery } from "react-responsive";
import { CustomDatePicker } from "@/components/DatePicker"
import {
  UpdateLeftBarData,
  Reset,
  AddCustomSection,
  DeleteCustomSection,
  RenameCustomSection,
} from "@/slices/leftsidebarSlice";
import Base64Image from "./base64toPhoto";
import { Trash } from "lucide-react";

interface LeftSideBarProps {
  activeSection: keyof ResumeData | string;
  setActiveSection: React.Dispatch<
    React.SetStateAction<keyof ResumeData | string>
  >;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftSideBar({
  activeSection,
  setActiveSection,
  isPanelOpen,
  setIsPanelOpen,
}: LeftSideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useAppDispatch();
  const resumeData = useAppSelector((state) => state.leftsidebar);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const [isAddSectionSheetOpen, setIsAddSectionSheetOpen] = useState(false);
  const [newSectionName, setNewSectionName] = useState("");
  const [renameSectionId, setRenameSectionId] = useState<string | null>(null);
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const sections = useAppSelector((state) => state.rightsidebar?.sections);
  const [isValid, setisValid] = useState<boolean>(true);
  const [isRenameValid, setisRenameValid] = useState<boolean>(true);

  const defaultSections: ResumeSection[] = [
    {
      id: "basics",
      icon: <UserPlus className="w-4 h-4" />,
      title: "Basics",
      fields: [
        "url",
        "name",
        "email",
        "phone",
        "location",
        "headLine",
        "picture",
      ],
    },
    {
      id: "summary",
      icon: <FileText className="w-4 h-4" />,
      title: "Summary",
      fields: ["content"],
    },
    {
      id: "profiles",
      icon: <Settings className="w-4 h-4" />,
      title: "Profiles",
      fields: ["url"],
    },
    {
      id: "skills",
      icon: <Code className="w-4 h-4" />,
      title: "Skills",
      fields: ["name", "skills"],
    },
    {
      id: "projects",
      icon: <FileText className="w-4 h-4" />,
      title: "Projects",
      fields: ["url", "name", "summary", "startDate", "endDate", "keywords"],
    },
    {
      id: "education",
      icon: <GraduationCap className="w-4 h-4" />,
      title: "Education",
      fields: [
        "institution",
        "degree",
        "field",
        "specialization",
        "startDate",
        "endDate",
        "score",
      ],
    },
    {
      id: "experience",
      icon: <Briefcase className="w-4 h-4" />,
      title: "Experience",
      fields: [
        "organization",
        "role",
        "startDate",
        "endDate",
        "location",
        "summary",
      ],
    },
    {
      id: "languages",
      icon: <Languages className="w-4 h-4" />,
      title: "Languages",
      fields: ["name", "level"],
    },
    {
      id: "volunteer",
      icon: <Heart className="w-4 h-4" />,
      title: "Volunteering",
      fields: ["organization", "role", "location", "startDate", "endDate"],
    },
    {
      id: "awards",
      icon: <Trophy className="w-4 h-4" />,
      title: "Awards",
      fields: ["title", "awarder", "date", "summary"],
    },
    {
      id: "publications",
      icon: <Book className="w-4 h-4" />,
      title: "Publications",
      fields: ["name", "publisher", "publishedIn", "url", "date"],
    },
    {
      id: "certifications",
      icon: <Award className="w-4 h-4" />,
      title: "Certifications",
      fields: ["name", "issuer", "date", "url"],
    },
    {
      id: "references",
      icon: <Star className="w-4 h-4" />,
      title: "References",
      fields: ["name", "phone", "email"],
    },
  ];

  const customSections: ResumeSection[] = Object.keys(resumeData)
    .filter(
      (key) =>
        !defaultSections.some((section) => section.id === key) &&
        key !== "customSections"
    )
    .map((key) => ({
      id: key,
      icon: <FileText className="w-4 h-4" />,
      title: key.charAt(0).toUpperCase() + key.slice(1),
      fields: [
        "name",
        "description",
        "startDate",
        "endDate",
        "location",
        "url",
        "summary",
      ],
    }));

  const resumeSections: ResumeSection[] = [
    ...defaultSections,
    ...customSections,
  ];

  useEffect(() => {
    if (isPhoneView) {
      setIsCollapsed(true);
    }
  }, [isPhoneView]);

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

  const createEmptyEntry = (section: keyof ResumeData | string) => {
    const newEntry: any = { id: Date.now().toString() };
    const sectionFields =
      resumeSections.find((s) => s.id === section)?.fields || [];
    sectionFields.forEach((field) => {
      if (field === "url") {
        newEntry[field] = { href: "", label: "" };
      } else if (field === "skills" && section === "skills") {
        newEntry[field] = [];
      } else {
        newEntry[field] = "";
      }
    });
    return newEntry;
  };

  const addEntry = (section: keyof ResumeData | string) => {
    const updatedResumeData = { ...resumeData };
    updatedResumeData[section as keyof ResumeData] = [
      ...(updatedResumeData[section as keyof ResumeData] || []),
      createEmptyEntry(section),
    ];
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const DeleteProfilePicture = () => {
    const updatedResumeData = {
      ...resumeData,
      basics: resumeData.basics?.length
        ? [
            { ...resumeData.basics[0], picture: "" },
            ...resumeData.basics.slice(1),
          ]
        : [],
    };

    console.log(updatedResumeData);

    if (updatedResumeData.basics) {
      dispatch(UpdateLeftBarData(updatedResumeData));
    }
  };

  const updateEntry = (
    section: keyof ResumeData | string,
    id: string,
    field: string,
    value: any
  ) => {
    const updatedResumeData = { ...resumeData };
    updatedResumeData[section as keyof ResumeData] = updatedResumeData[
      section as keyof ResumeData
    ]?.map((entry: any) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const deleteEntry = (section: keyof ResumeData | string, id: string) => {
    const updatedResumeData = { ...resumeData };
    //@ts-ignore
    updatedResumeData[section as keyof ResumeData] = updatedResumeData[
      section as keyof ResumeData
    ].filter((entry: any) => entry.id !== id);
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const addSkill = (entryId: string) => {
    const updatedResumeData = { ...resumeData };
    updatedResumeData.skills = updatedResumeData.skills?.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          skills: [...entry.skills, { name: "", level: "" }],
        };
      }
      return entry;
    });
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const deleteSkill = (entryId: string, skillIndex: number) => {
    const updatedResumeData = { ...resumeData };
    updatedResumeData.skills = updatedResumeData.skills?.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          skills: entry.skills.filter((_, index) => index !== skillIndex),
        };
      }
      return entry;
    });
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const validateUrl = (url: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );

    return !!pattern.test(url);
  };

  const handleUrlChange = (
    section: keyof ResumeData | string,
    id: string,
    field: string,
    value: string
  ) => {
    const errorKey = `${section}-${id}-${field}`;
    if (value && !validateUrl(value)) {
      setUrlErrors((prev) => ({
        ...prev,
        [errorKey]: "Please enter a valid URL",
      }));
    } else {
      setUrlErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }

    const updatedResumeData = { ...resumeData };
    const sectionData = updatedResumeData[section as keyof ResumeData];
    const updatedSection = sectionData?.map((entry: any) => {
      if (entry.id === id) {
        const currentUrl = entry[field] as URL;
        return {
          ...entry,
          [field]: {
            href: value,
            label: currentUrl?.label || "",
          },
        };
      }
      return entry;
    });

    updatedResumeData[section as keyof ResumeData] = updatedSection;
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const renderEntryFields = (
    section: keyof ResumeData | string,
    entry: any,
    index: number
  ) => {
    const fields = resumeSections.find((s) => s.id === section)?.fields || [];
    return (
      <div key={entry.id} className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {section.charAt(0).toUpperCase() + section.slice(1)} {index + 1}
        </h3>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <Label htmlFor={`${field}-${entry.id}`}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              {field === "summary" || field === "content" ? (
                <RichInput
                  content={entry[field] || ""}
                  section={section}
                  onContentChange={(value) =>
                    updateEntry(section, entry.id, field, value)
                  }
                />
              ) : field === "keywords" ? (
                <Input
                  id={`${field}-${entry.id}`}
                  value={(entry[field] || []).join(", ")}
                  onChange={(e) =>
                    updateEntry(
                      section,
                      entry.id,
                      field,
                      e.target.value.split(",").map((item) => item.trim())
                    )
                  }
                  placeholder={`Enter ${field} (comma-separated)`}
                />
              ) : field === "url" ? (
                <div className="space-y-2">
                  <Input
                    id={`${field}-href-${entry.id}`}
                    value={(entry[field] as URL)?.href || ""}
                    onChange={(e) =>
                      handleUrlChange(section, entry.id, field, e.target.value)
                    }
                    placeholder="Enter URL"
                    type="url"
                  />
                  {urlErrors[`${section}-${entry.id}-${field}`] && (
                    <p className="text-sm  text-red-500">
                      {urlErrors[`${section}-${entry.id}-${field}`]}
                    </p>
                  )}
                  <Input
                    id={`${field}-label-${entry.id}`}
                    value={(entry[field] as URL)?.label || ""}
                    onChange={(e) =>
                      updateEntry(section, entry.id, field, {
                        ...(entry[field] as URL),
                        label: e.target.value,
                      })
                    }
                    placeholder="Enter label"
                  />
                </div>
              ) : field === "picture" ? (
                <div className="flex-col items-center justify-center">
                  {resumeData?.basics && resumeData?.basics[0]?.picture && (
                    <div className="relative flex items-center justify-center">
                      <Trash
                        onClick={DeleteProfilePicture}
                        className="absolute right-0 -top-2 w-4 h-4 my-3 text-red-500 cursor-pointer"
                      />
                      <Base64Image
                        base64String={resumeData?.basics[0]?.picture}
                        width={150}
                        height={150}
                        alt={resumeData?.basics[0].name}
                      />
                    </div>
                  )}
                  <Input
                    id={`${field}-${entry.id}`}
                    className="my-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          updateEntry(section, entry.id, field, base64String);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    type="file"
                    accept="image/*"
                  />
                </div>
              ) : field === "startDate" ||
                field === "endDate" ||
                field === "date" ? (
                <CustomDatePicker
                  date={entry[field] ? new Date(entry[field]) : undefined}
                  onSelect={(date) =>
                    updateEntry(
                      section,
                      entry.id,
                      field,
                      date ? date.toISOString() : ""
                    )
                  }
                />
              ) : field === "level" ? (
                <Select
                  onValueChange={(value) =>
                    updateEntry(section, entry.id, field, value)
                  }
                  defaultValue={entry[field] || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field === "skills" && section === "skills" ? (
                <div className="space-y-4">
                  {(entry.skills || []).map(
                    (skill: Skill, skillIndex: number) => (
                      <div
                        key={skillIndex}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Input
                          value={skill.name}
                          onChange={(e) => {
                            const updatedSkills = [...entry.skills];
                            updatedSkills[skillIndex] = {
                              ...updatedSkills[skillIndex],
                              name: e.target.value,
                            };
                            updateEntry(
                              section,
                              entry.id,
                              "skills",
                              updatedSkills
                            );
                          }}
                          placeholder="Skill name"
                        />
                        <Select
                          onValueChange={(value) => {
                            const updatedSkills = [...entry.skills];
                            updatedSkills[skillIndex] = {
                              ...updatedSkills[skillIndex],
                              level: value,
                            };
                            updateEntry(
                              section,
                              entry.id,
                              "skills",
                              updatedSkills
                            );
                          }}
                          defaultValue={skill.level}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Beginner", "Intermediate", "Advanced"].map(
                              (level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSkill(entry.id, skillIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(entry.id)}
                    className="w-full"
                  >
                    Add Skill
                  </Button>
                </div>
              ) : (
                <Input
                  id={`${field}-${entry.id}`}
                  value={entry[field] || ""}
                  onChange={(e) =>
                    updateEntry(section, entry.id, field, e.target.value)
                  }
                  placeholder={`Enter ${field}`}
                />
              )}
            </div>
          ))}
          {section !== "basics" && section !== "summary" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteEntry(section, entry.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderSheetContent = (section: keyof ResumeData | string) => {
    if (section === "createdOn" || section === "updatedOn")
      return <React.Fragment></React.Fragment>;
    console.log(section);
    const sectionEntries =
      (resumeData[section as keyof ResumeData] as any[]) || [];

    console.log(sectionEntries);

    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow pr-4 my-8">
          {sectionEntries.length === 0 && (
            <p className="text-center text-muted-foreground">
              No entries yet. Add some!
            </p>
          )}
          {sectionEntries.map((entry, index) =>
            renderEntryFields(section, entry, index)
          )}
        </ScrollArea>
        {section !== "basics" && section !== "summary" && (
          <div className="mt-4 space-y-2 mb-12">
            <Button onClick={() => addEntry(section)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Add New Entry
            </Button>
          </div>
        )}
      </div>
    );
  };

  const profileData = useAppSelector((state) => state?.profile);

  const handleImport = () => {
    console.log("Import from profile");
    dispatch(UpdateLeftBarData(profileData));
  };

  const handleNewSectionName = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (sections.includes(ev.target.value.toLowerCase())) setisValid(false);
    else setisValid(true);
    setNewSectionName(ev.target.value);
  };

  const handleNewSectionRename = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (sections.includes(ev.target.value.toLowerCase()))
      setisRenameValid(false);
    else setisRenameValid(true);
    setNewSectionTitle(ev.target.value);
  };

  const handleReset = () => {
    console.log("Clear all data");
    dispatch(Reset());
  };

  const handleAddSection = () => {
    if (newSectionName) {
      dispatch(AddCustomSection(newSectionName.toLowerCase()));
      setNewSectionName("");
      setIsAddSectionSheetOpen(false);
    }
  };

  const handleDeleteSection = (sectionId: string) => {
    dispatch(DeleteCustomSection(sectionId));
  };

  const handleRenameSection = (sectionId: string) => {
    if (newSectionTitle) {
      dispatch(
        RenameCustomSection({ oldName: sectionId, newName: newSectionTitle })
      );
      setRenameSectionId(null);
      setNewSectionTitle("");
    }
  };

  console.log(resumeSections);

  return (
    <>
      {isPhoneView ? (
        <LeftSidePanel<ResumeData>
          sections={resumeSections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          renderSheetContent={renderSheetContent}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
          defaultSections={defaultSections}
          handleDeleteSection={handleDeleteSection}
          isCollapsed={isCollapsed}
          setNewSectionTitle={setNewSectionTitle}
          setRenameSectionId={setRenameSectionId}
          handleNewSectionRename={handleNewSectionRename}
          newSectionTitle={newSectionTitle}
          renameSectionId={renameSectionId}
          isRenameValid={isRenameValid}
          handleRenameSection={handleRenameSection}
          handleAddSection={handleAddSection}
          handleNewSectionName={handleNewSectionName}
          isAddSectionSheetOpen={isAddSectionSheetOpen}
          isValid={isValid}
          newSectionName={newSectionName}
          setIsAddSectionSheetOpen={setIsAddSectionSheetOpen}
          type="resume"
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
                <h2 className="text-lg font-semibold">Resume Sections</h2>
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
              <div className="p-4 space-y-2">
                {resumeSections.map((section) => {
                  if (
                    section.title !== "UpdatedOn" &&
                    section.title !== "CreatedOn"
                  ) {
                    return (
                      <Sheet key={section.id}>
                        <SheetTrigger asChild>
                          <div className="flex items-center">
                            <Button
                              variant={
                                activeSection === section.id
                                  ? "default"
                                  : "ghost"
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
                            {!isCollapsed &&
                              !defaultSections.some(
                                (s) => s.id === section.id
                              ) && (
                                <React.Fragment>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setRenameSectionId(section.id);
                                      setNewSectionTitle(section.title);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDeleteSection(section.id);
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </React.Fragment>
                              )}
                          </div>
                        </SheetTrigger>
                        <SheetContent
                          side="left"
                          className="w-[400px] sm:w-[540px]"
                        >
                          <SheetHeader>
                            <SheetTitle>Edit {section.title}</SheetTitle>
                            <SheetDescription>
                              Modify or add new entries to this section.
                            </SheetDescription>
                          </SheetHeader>
                          {renderSheetContent(section.id)}
                        </SheetContent>
                      </Sheet>
                    );
                  } else {
                    return <React.Fragment></React.Fragment>;
                  }
                })}
                <Sheet
                  open={renameSectionId !== null}
                  onOpenChange={(open) => !open && setRenameSectionId(null)}
                >
                  <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Rename Section</SheetTitle>
                      <SheetDescription>
                        Rename your existing section to a new title.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <Label htmlFor="rename-section-name">
                        New Section Name
                      </Label>
                      <Input
                        id="rename-section-name"
                        value={newSectionTitle}
                        onChange={handleNewSectionRename}
                        placeholder="Enter new section name"
                      />
                      {!isRenameValid && (
                        <span className="text-red-500 text-sm w-full text-center">
                          This section already exists.
                        </span>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <Button
                          onClick={
                            isRenameValid
                              ? //@ts-ignore
                                () => handleRenameSection(renameSectionId)
                              : undefined
                          }
                          className={`w-full ${
                            !isRenameValid
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          Rename Section
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setRenameSectionId(null)}
                          className="w-full mt-2"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet
                  open={isAddSectionSheetOpen}
                  onOpenChange={setIsAddSectionSheetOpen}
                >
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start ${
                        isCollapsed ? "px-2" : ""
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      {!isCollapsed && (
                        <span className="ml-2">Add Section</span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[400px] sm:w-[540px]">
                    <SheetHeader>
                      <SheetTitle>Add New Section</SheetTitle>
                      <SheetDescription>
                        Create a custom section for your resume.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 mt-4">
                      <Label htmlFor="new-section-name">Section Name</Label>
                      <Input
                        id="new-section-name"
                        value={newSectionName}
                        onChange={handleNewSectionName}
                        placeholder="Enter section name"
                      />
                      {!isValid && (
                        <span className="text-red-500 text-sm w-full text-center">
                          This section already exists.
                        </span>
                      )}
                      <Button
                        onClick={isValid ? () => handleAddSection() : undefined}
                        className={`w-full ${
                          !isValid ? "cursor-not-allowed opacity-50" : ""
                        }`}
                      >
                        Create Section
                      </Button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </ScrollArea>
            <div
              className={`border-t flex ${
                isCollapsed
                  ? "flex-col items-center"
                  : "flex-row space-x-4 p-4 justify-center"
              }`}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={isCollapsed ? null : "outline"}>
                          <Import className="h-4 w-4" />{" "}
                          {isCollapsed ? "" : "Import Data"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Import Data</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will import data from your profile. Are
                            you sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleImport}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Import from profile</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant={isCollapsed ? null : "outline"}>
                          <Eraser className="h-4 w-4" />
                          {isCollapsed ? "" : "Clear Data"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Clear All Data</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action will clear all your resume data. Are you
                            sure you want to continue?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={handleReset}>
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Clear all data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
