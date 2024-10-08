"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { CoverLetterState } from "@/types/types";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CoverLetterSectionProps {
  id: keyof CoverLetterState;
  title: string;
  icon: React.ReactNode;
}

interface CoverLetterPanelProps {
  coverLetterSections: CoverLetterSectionProps[];
  activeSection: keyof CoverLetterState | "";
  setActiveSection: (id: keyof CoverLetterState | "") => void;
  renderSheetContent: (section: keyof CoverLetterState) => JSX.Element;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CoverLetterPanel({
  coverLetterSections = [],
  activeSection,
  setActiveSection,
  renderSheetContent,
  isPanelOpen,
  setIsPanelOpen,
}: CoverLetterPanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const handleSectionClick = (sectionId: keyof CoverLetterState) => {
    setActiveSection(sectionId);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveSection("");
  };

  const togglePanel = () => {
    setIsPanelOpen((prev) => !prev);
  };

  if (!Array.isArray(coverLetterSections) || coverLetterSections.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No cover letter sections available.</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute h-screen flex items-center justify-center">
        <motion.div
          initial={{ x: -60 }}
          animate={{ x: isPanelOpen ? 0 : -60 }}
          transition={{ duration: 0.3 }}
          className="bg-background border-r border-border shadow-lg h-auto rounded-r-lg z-50"
        >
          <div className="w-[60px]">
            <div className="py-4 space-y-4">
              {coverLetterSections.map((section) => (
                <div key={section.id} className="px-2">
                  <Button
                    variant={activeSection === section.id ? "default" : "ghost"}
                    size="icon"
                    className="w-full aspect-square"
                    onClick={() => handleSectionClick(section.id)}
                    title={section.title}
                  >
                    {section.icon}
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="absolute -right-12 top-1/2 -translate-y-1/2">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-md bg-background border border-border"
              onClick={togglePanel}
            >
              {isPanelOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </div>
        </motion.div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px] flex flex-col h-[100dvh] max-h-[100dvh]">
          <DialogHeader>
            <DialogTitle>
              Edit{" "}
              {coverLetterSections.find((s) => s.id === activeSection)?.title}
            </DialogTitle>
            <DialogDescription>
              Make changes to your cover letter section here. Click save when
              you're done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow overflow-y-auto mt-4 pr-4">
            {activeSection && renderSheetContent(activeSection)}
          </ScrollArea>
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="mt-4">
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  );
}
