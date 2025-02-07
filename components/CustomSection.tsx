"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Edit, Trash2, ChevronRight, ChevronLeft } from "lucide-react";
import { ResumeData, ResumeSection } from "@/types/types";

interface CustomSectionProps {
  renameSectionId: string | null;
  newSectionTitle: string;
  handleNewSectionRename: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  isRenameValid: boolean;
  setRenameSectionId: React.Dispatch<React.SetStateAction<string | null>>;
  isAddSectionSheetOpen: boolean;
  setIsAddSectionSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed: boolean;
  newSectionName: string;
  handleNewSectionName: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddSection: () => void;
  isValid: boolean;
  handleRenameSection: (sectionId: string) => void;
  defaultSections: ResumeSection[];
  setNewSectionTitle: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteSection: (sectionId: string) => void;
  resumeSections: ResumeSection[];
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  renderSheetContent: (section: keyof ResumeData | string) => React.JSX.Element;
  type: "small" | "medium";
  togglePanel?: () => void;
}

export const CustomSection: React.FC<CustomSectionProps> = ({
  renameSectionId,
  newSectionTitle,
  handleNewSectionRename,
  isRenameValid,
  setRenameSectionId,
  isAddSectionSheetOpen,
  setIsAddSectionSheetOpen,
  isCollapsed,
  newSectionName,
  handleNewSectionName,
  handleAddSection,
  isValid,
  handleRenameSection,
  defaultSections,
  setNewSectionTitle,
  handleDeleteSection,
  resumeSections,
  activeSection,
  setActiveSection,
  renderSheetContent,
  type,
  togglePanel,
}) => {
  const [isRenameSheetOpen, setIsRenameSheetOpen] = useState(false);

  const handleOpenRenameSheet = (sectionId: string, title: string) => {
    setRenameSectionId(sectionId);
    setNewSectionTitle(title);
    setIsRenameSheetOpen(true);
  };

  const handleCloseRenameSheet = () => {
    setRenameSectionId(null);
    setIsRenameSheetOpen(false);
  };

  const renderSectionButton = (section: ResumeSection) => {
    const isDefault = defaultSections.some((s) => s.id === section.id);
    const isSmall = type === "small";

    return (
      <div className={`flex items-center w-full mb-2`}>
        <Button
          variant={activeSection === section.id ? "default" : "ghost"}
          className={`flex-grow justify-start ${isCollapsed ? "px-2" : "px-4"}`}
          onClick={() => setActiveSection(section.id)}
        >
          {section.icon}
          <span className={`ml-2 ${isCollapsed ? "sr-only" : ""}`}>
            {isSmall ? section.title.slice(0, 8) : section.title}
          </span>
          {isCollapsed && (
            <ChevronRight className="ml-auto h-4 w-4" />
          )}
        </Button>
        {!isDefault && !isCollapsed && (
          <div className="flex ml-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleOpenRenameSheet(section.id, section.title);
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
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderAddSectionButton = () => (
    <Sheet open={isAddSectionSheetOpen} onOpenChange={setIsAddSectionSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start ${
            isCollapsed ? "px-2" : "px-4"
          } my-4`}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2 ">Add Section</span>}
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
            onClick={() => {
              if (isValid) {
                handleAddSection();
                setIsAddSectionSheetOpen(false);
              }
            }}
            className="w-full"
            disabled={!isValid}
          >
            Create Section
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <ScrollArea
      className={`h-[calc(100vh-${type === "small" ? "200px" : "100px"})]`}
    >
      {type === "small" && (
        <Button
          variant="secondary"
          size="icon"
          className="rounded-l-full shadow-md bg-background border border-border absolute top-1/2 -translate-y-1/2 -right-0"
          onClick={togglePanel}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      <div className={`pr-2 ${type === "medium" ? "space-y-4" : "space-y-2"}`}>
        {type === "small" && renderAddSectionButton()}
        {resumeSections.map((section) => (
          <Sheet key={section.id}>
            <SheetTrigger asChild>{renderSectionButton(section)}</SheetTrigger>
            <SheetContent side="left" className="w-[400px] sm:w-[540px]">
              <SheetHeader>
                <SheetTitle>Edit {section.title}</SheetTitle>
                <SheetDescription>
                  Modify or add new entries to this section.
                </SheetDescription>
              </SheetHeader>
              {renderSheetContent(section.id)}
            </SheetContent>
          </Sheet>
        ))}
        {type === "medium" && renderAddSectionButton()}
      </div>

      <Sheet open={isRenameSheetOpen} onOpenChange={handleCloseRenameSheet}>
        <SheetContent side="left" className="w-[400px] sm:w-[540px]">
          <SheetHeader>
            <SheetTitle>Rename Section</SheetTitle>
            <SheetDescription>
              Enter a new name for this section.
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 mt-4">
            <Label htmlFor="rename-section">New Section Name</Label>
            <Input
              id="rename-section"
              value={newSectionTitle}
              onChange={handleNewSectionRename}
              placeholder="Enter new section name"
            />
            {!isRenameValid && (
              <span className="text-red-500 text-sm w-full">
                This section name already exists.
              </span>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => handleCloseRenameSheet()}
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (isRenameValid && renameSectionId) {
                    handleRenameSection(renameSectionId);
                    handleCloseRenameSheet();
                  }
                }}
                disabled={!isRenameValid}
              >
                Rename
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </ScrollArea>
  );
};