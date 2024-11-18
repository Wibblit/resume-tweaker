// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { CustomSection } from "./CustomSection";
// import { ResumeData, ResumeSection } from "@/types/types";

// interface SectionProps {
//   id: string;
//   title: string;
//   icon: React.ReactNode;
// }

// interface LeftSidePanelProps<T> {
//   sections: SectionProps[];
//   activeSection: string;
//   setActiveSection: React.Dispatch<React.SetStateAction<string>>;
//   renderSheetContent: (section: keyof ResumeData | string) => React.JSX.Element;
//   isPanelOpen: boolean;
//   setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   renameSectionId: string | null;
//   newSectionTitle: string;
//   handleNewSectionRename: (ev: React.ChangeEvent<HTMLInputElement>) => void;
//   isRenameValid: boolean;
//   setRenameSectionId: React.Dispatch<React.SetStateAction<string | null>>;
//   isAddSectionSheetOpen: boolean;
//   setIsAddSectionSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   isCollapsed: boolean;
//   newSectionName: string;
//   handleNewSectionName: (ev: React.ChangeEvent<HTMLInputElement>) => void;
//   handleAddSection: () => void;
//   isValid: boolean;
//   handleRenameSection: (sectionId: string) => void;
//   defaultSections: ResumeSection[];
//   setNewSectionTitle: React.Dispatch<React.SetStateAction<string>>;
//   handleDeleteSection: (sectionId: string) => void;
//   resumeSections: ResumeSection[];
// }

// export default function LeftSidePanel<T>({
//   sections,
//   isPanelOpen,
//   setIsPanelOpen,
//   renameSectionId,
//   newSectionTitle,
//   handleNewSectionRename,
//   isRenameValid,
//   setRenameSectionId,
//   isAddSectionSheetOpen,
//   setIsAddSectionSheetOpen,
//   isCollapsed,
//   newSectionName,
//   handleNewSectionName,
//   handleAddSection,
//   isValid,
//   handleRenameSection,
//   defaultSections,
//   setNewSectionTitle,
//   handleDeleteSection,
//   resumeSections,
//   activeSection,
//   setActiveSection,
//   renderSheetContent,
// }: LeftSidePanelProps<T>) {
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false);

//   const handleSectionClick = (sectionId: string) => {
//     setActiveSection(sectionId);
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setActiveSection("");
//   };

//   const togglePanel = () => {
//     setIsPanelOpen(!isPanelOpen);
//   };

//   return (
//     <div className="relative h-screen">
//       <div className="absolute h-screen flex items-center justify-center">
//         <motion.div
//           initial={{ x: -60 }}
//           animate={{ x: isPanelOpen ? 0 : -60 }}
//           transition={{ duration: 0.3 }}
//           className="bg-background border-r border-border shadow-lg h-auto rounded-r-lg z-50"
//         >
//           <div className="w-[120px]">
//             <CustomSection
//               handleAddSection={handleAddSection}
//               handleNewSectionName={handleNewSectionName}
//               handleNewSectionRename={handleNewSectionRename}
//               handleRenameSection={handleRenameSection}
//               isAddSectionSheetOpen={isAddSectionSheetOpen}
//               isCollapsed={isCollapsed}
//               isRenameValid={isRenameValid}
//               isValid={isValid}
//               newSectionName={newSectionName}
//               newSectionTitle={newSectionTitle}
//               renameSectionId={renameSectionId}
//               setIsAddSectionSheetOpen={setIsAddSectionSheetOpen}
//               setRenameSectionId={setRenameSectionId}
//               activeSection={activeSection}
//               defaultSections={defaultSections}
//               handleDeleteSection={handleDeleteSection}
//               resumeSections={resumeSections}
//               setActiveSection={setActiveSection}
//               setNewSectionTitle={setNewSectionTitle}
//               renderSheetContent={renderSheetContent}
//               type="small"
//             />
//           </div>
//           <div className="absolute -right-12 top-1/2 -translate-y-1/2">
//             <Button
//               variant="secondary"
//               size="icon"
//               className="rounded-full shadow-md bg-background border border-border"
//               onClick={togglePanel}
//             >
//               {isPanelOpen ? (
//                 <ChevronLeft className="h-4 w-4" />
//               ) : (
//                 <ChevronRight className="h-4 w-4" />
//               )}
//             </Button>
//           </div>
//         </motion.div>
//       </div>
//       <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
//         <DialogContent className="sm:max-w-[425px] flex flex-col h-[100dvh] max-h-[100dvh]">
//           <DialogHeader>
//             <DialogTitle>
//               Edit {sections.find((s) => s.id === activeSection)?.title}
//             </DialogTitle>
//             <DialogDescription>
//               Make changes to your section here. Click save when you're done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="flex-grow overflow-y-auto mt-4 pr-4">
//             {activeSection && renderSheetContent(activeSection)}
//           </div>
//           <DialogClose asChild>
//             <Button type="button" variant="secondary" className="mt-4">
//               Close
//             </Button>
//           </DialogClose>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { CustomSection } from "./CustomSection";
import { ResumeData, ResumeSection } from "@/types/types";

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface LeftSidePanelProps<T> {
  sections: SectionProps[];
  activeSection: string;
  setActiveSection: React.Dispatch<React.SetStateAction<string>>;
  renderSheetContent: (section: keyof ResumeData | string) => React.JSX.Element;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
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
}

export default function LeftSidePanel<T>({
  sections,
  isPanelOpen,
  setIsPanelOpen,
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
}: LeftSidePanelProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveSection("");
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  return (
    <div className="relative h-screen">
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 bottom-0 w-60 bg-background border-r border-border shadow-lg z-50 overflow-hidden"
          >
            <div className="flex flex-col h-full">
              <div className="p-0 border-b flex justify-between items-center flex-col">
                <div className="flex flex-row items-center justify-end w-full mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className=""
                    onClick={togglePanel}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </div>

                <h2 className="text-lg font-semibold py-2">Resume Sections</h2>
              </div>
              <div className="flex-grow flex-row overflow-y-auto">
                <CustomSection
                  handleAddSection={handleAddSection}
                  handleNewSectionName={handleNewSectionName}
                  handleNewSectionRename={handleNewSectionRename}
                  handleRenameSection={handleRenameSection}
                  isAddSectionSheetOpen={isAddSectionSheetOpen}
                  isCollapsed={false}
                  isRenameValid={isRenameValid}
                  isValid={isValid}
                  newSectionName={newSectionName}
                  newSectionTitle={newSectionTitle}
                  renameSectionId={renameSectionId}
                  setIsAddSectionSheetOpen={setIsAddSectionSheetOpen}
                  setRenameSectionId={setRenameSectionId}
                  activeSection={activeSection}
                  defaultSections={defaultSections}
                  handleDeleteSection={handleDeleteSection}
                  resumeSections={resumeSections}
                  setActiveSection={setActiveSection}
                  setNewSectionTitle={setNewSectionTitle}
                  renderSheetContent={renderSheetContent}
                  type="small"
                  togglePanel={togglePanel}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {!isPanelOpen && (
        <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-r-full shadow-md bg-background border border-border"
            onClick={togglePanel}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-[425px] flex flex-col h-[100dvh] max-h-[100dvh]">
          <DialogHeader>
            <DialogTitle>
              Edit {sections.find((s) => s.id === activeSection)?.title}
            </DialogTitle>
            <DialogDescription>
              Make changes to your section here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto mt-4 pr-4">
            {activeSection && renderSheetContent(activeSection)}
          </div>
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