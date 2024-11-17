"use client";

import React from "react";
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
import {
  Plus,
} from "lucide-react";;

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
}

export const CustomSection = ({
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
} : CustomSectionProps) => {
  return (
    <>
      {renameSectionId && (
        <div className="flex-col items-center justify-center space-x-2">
          <Input
            value={newSectionTitle}
            onChange={handleNewSectionRename}
            placeholder="New section name"
          />
          {!isRenameValid && (
            <span className="text-red-500 text-sm w-full">
              This section already exists.
            </span>
          )}
          <div className="flex items-center justify-between mt-2">
            <Button
              onClick={
                isRenameValid
                  ? () => handleRenameSection(renameSectionId)
                  : undefined
              }
              className={`${
                !isRenameValid ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Rename
            </Button>
            <Button variant="ghost" onClick={() => setRenameSectionId(null)}>
              Cancel
            </Button>
          </div>
        </div>
      )}
      <Sheet
        open={isAddSectionSheetOpen}
        onOpenChange={setIsAddSectionSheetOpen}
      >
        <SheetTrigger asChild>
          <Button
            variant="outline"
            className={`w-full justify-start ${isCollapsed ? "px-2" : ""}`}
          >
            <Plus className="w-4 h-4" />
            {!isCollapsed && <span className="ml-2">Add Section</span>}
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
    </>
  );
};
