"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight } from "lucide-react";
import { ResumeData } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { useMediaQuery } from "react-responsive";

interface ResumeSectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface LeftSidePanelProps {
  resumeSections: ResumeSectionProps[];
  activeSection: string;
  setActiveSection: (id: string) => void;
  renderSheetContent: (section: keyof ResumeData) => JSX.Element;
}

export default function LeftSidePanel({
  resumeSections,
  activeSection,
  setActiveSection,
  renderSheetContent,
}: LeftSidePanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogHeight, setDialogHeight] = useState("600px");
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  useEffect(() => {
    if (isPhoneView) {
      setDialogHeight("100vh");
    } else {
      setDialogHeight("600px");
    }
  }, [isPhoneView]);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveSection("");
  };

  return (
    <>
      <div
        className="fixed left-0 top-1/2 transform -translate-y-1/2 bg-background border-r border-border shadow-lg rounded-r-lg z-50"
        style={{ width: 60 }}
      >
        <ScrollArea className="h-[80vh]">
          <div className="py-4 space-y-4">
            {resumeSections.map((section) => (
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
        </ScrollArea>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent 
          className={`sm:max-w-[425px] flex flex-col ${isPhoneView ? 'h-screen max-h-screen' : ''}`}
          style={{ height: dialogHeight }}
        >
          <DialogHeader>
            <DialogTitle>
              Edit {resumeSections.find((s) => s.id === activeSection)?.title}
            </DialogTitle>
            <DialogDescription>
              Make changes to your resume section here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="flex-grow mt-4 pr-4">
            <div className={isPhoneView ? 'min-h-[calc(100vh-200px)]' : 'min-h-[400px]'}>
              {activeSection && renderSheetContent(activeSection as keyof ResumeData)}
            </div>
          </ScrollArea>
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="mt-4"
            >
              Close
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
}