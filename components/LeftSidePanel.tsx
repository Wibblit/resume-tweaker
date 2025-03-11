// import React from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { ChevronRight, ChevronLeft } from "lucide-react";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Trash2, Edit , Plus} from "lucide-react";
// import { ResumeSection } from "@/types/types";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// interface SectionProps {
//   id: string;
//   title: string;
//   icon: React.ReactNode;
// }

// interface LeftSidePanelProps<T> {
//   sections: SectionProps[];
//   activeSection: keyof T | string;
//   setActiveSection: React.Dispatch<React.SetStateAction<keyof T | string>>;
//   renderSheetContent: (section: keyof T) => JSX.Element;
//   isPanelOpen: boolean;
//   setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
//   isCollapsed?: boolean;
//   defaultSections?: ResumeSection[];
//   setRenameSectionId?: React.Dispatch<React.SetStateAction<string | null>>;
//   setNewSectionTitle?: React.Dispatch<React.SetStateAction<string>>;
//   handleDeleteSection?: (sectionId: string) => void;
//   renameSectionId?: string | null;
//   newSectionTitle?: string;
//   handleNewSectionRename?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
//   isRenameValid?: boolean;
//   handleRenameSection?: (sectionId: string) => void;
//   isAddSectionSheetOpen?: boolean;
//   setIsAddSectionSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
//   newSectionName?: string;
//   handleNewSectionName?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
//   isValid?: boolean;
//   handleAddSection?: () => void;
//   type: "resume" | "cover";
// }

// export default function LeftSidePanel<T>({
//   sections,
//   activeSection,
//   setActiveSection,
//   renderSheetContent,
//   isPanelOpen,
//   setIsPanelOpen,
//   isCollapsed,
//   defaultSections,
//   setRenameSectionId,
//   setNewSectionTitle,
//   handleDeleteSection,
// renameSectionId,
//   newSectionTitle,
//   handleNewSectionRename,
//   isRenameValid,
//   handleRenameSection,
//   isAddSectionSheetOpen,
//   setIsAddSectionSheetOpen,
//   newSectionName,
//   handleNewSectionName,
//   isValid,
//   handleAddSection,
//   type,
// }: LeftSidePanelProps<T>) {
//   const [isDialogOpen, setIsDialogOpen] = React.useState(false);

//   const handleSectionClick = (sectionId: string) => {
//     setActiveSection(sectionId as keyof T);
//     setIsDialogOpen(true);
//   };

//   const handleDialogClose = () => {
//     setIsDialogOpen(false);
//     setActiveSection("" as keyof T);
//   };

//   const togglePanel = () => {
//     setIsPanelOpen(!isPanelOpen);
//   };

//   return (
//     <div className="relative h-screen">
//       <div className="absolute h-screen flex items-center justify-center">
//         <motion.div
//           initial={{ x: -240 }}
//           animate={{ x: isPanelOpen ? 0 : -240 }}
//           transition={{ duration: 0.3 }}
//           className="bg-background border-r border-border shadow-lg h-auto rounded-r-lg z-50"
//         >
//           <div className="w-[240px]">
//             {type === "resume" && (
//               <Sheet
//                 open={isAddSectionSheetOpen}
//                 onOpenChange={setIsAddSectionSheetOpen}
//               >
//                 <SheetTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className={`w-full justify-start ${
//                       isCollapsed ? "px-2" : ""
//                     }`}
//                   >
//                     <Plus className="w-4 h-4" />
//                     {!isCollapsed && <span className="ml-2">Add Section</span>}
//                   </Button>
//                 </SheetTrigger>
//                 <SheetContent side="left" className="w-[400px] sm:w-[540px]">
//                   <SheetHeader>
//                     <SheetTitle>Add New Section</SheetTitle>
//                     <SheetDescription>
//                       Create a custom section for your resume.
//                     </SheetDescription>
//                   </SheetHeader>
//                   <div className="space-y-4 mt-4">
//                     <Label htmlFor="new-section-name">Section Name</Label>
//                     <Input
//                       id="new-section-name"
//                       value={newSectionName}
//                       onChange={handleNewSectionName}
//                       placeholder="Enter section name"
//                     />
//                     {!isValid && (
//                       <span className="text-red-500 text-sm w-full text-center">
//                         This section already exists.
//                       </span>
//                     )}
//                     <Button
//                       onClick={isValid ? () => handleAddSection() : undefined}
//                       className={`w-full ${
//                         !isValid ? "cursor-not-allowed opacity-50" : ""
//                       }`}
//                     >
//                       Create Section
//                     </Button>
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             )}
//             <div className="py-4 space-y-2">
//               {sections.map((section) => (
//                 <div
//                   key={section.id}
//                   className="px-2 flex items-center justify-between"
//                 >
//                   <Button
//                     variant={activeSection === section.id ? "default" : "ghost"}
//                     className="w-full justify-start text-left"
//                     onClick={() => handleSectionClick(section.id)}
//                     title={section.title}
//                   >
//                     {section.icon}
//                     <span className="ml-2 truncate max-w-[120px]">
//                       {section.title}
//                     </span>
//                   </Button>
//                   {type === "resume" &&
//                     !defaultSections!.some((s) => s.id === section.id) && (
//                       <div className="flex">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             setRenameSectionId!(section.id);
//                             setNewSectionTitle!(section.title);
//                           }}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleDeleteSection!(section.id);
//                           }}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     )}
//                 </div>
//               ))}
//               <Sheet
//                 open={renameSectionId !== null}
//                 onOpenChange={(open) => !open && setRenameSectionId(null)}
//               >
//                 <SheetContent side="left" className="w-[400px] sm:w-[540px]">
//                   <SheetHeader>
//                     <SheetTitle>Rename Section</SheetTitle>
//                     <SheetDescription>
//                       Rename your existing section to a new title.
//                     </SheetDescription>
//                   </SheetHeader>
//                   <div className="space-y-4 mt-4">
//                     <Label htmlFor="rename-section-name">
//                       New Section Name
//                     </Label>
//                     <Input
//                       id="rename-section-name"
//                       value={newSectionTitle}
//                       onChange={handleNewSectionRename}
//                       placeholder="Enter new section name"
//                     />
//                     {!isRenameValid && (
//                       <span className="text-red-500 text-sm w-full text-center">
//                         This section already exists.
//                       </span>
//                     )}
//                     <div className="flex items-center justify-between mt-2">
//                       <Button
//                         onClick={
//                           isRenameValid
//                             ? //@ts-ignore
//                               () => handleRenameSection(renameSectionId)
//                             : undefined
//                         }
//                         className={`w-full ${
//                           !isRenameValid ? "cursor-not-allowed opacity-50" : ""
//                         }`}
//                       >
//                         Rename Section
//                       </Button>
//                       <Button
//                         variant="ghost"
//                         onClick={() => setRenameSectionId(null)}
//                         className="w-full mt-2"
//                       >
//                         Cancel
//                       </Button>
//                     </div>
//                   </div>
//                 </SheetContent>
//               </Sheet>
//             </div>
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
//             {activeSection && renderSheetContent(activeSection as keyof T)}
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

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft, Trash2, Edit, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResumeSection } from "@/types/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SectionProps {
  id: string;
  title: string;
  icon: React.ReactNode;
}

interface LeftSidePanelProps<T> {
  sections: SectionProps[];
  activeSection: keyof T | string;
  setActiveSection: React.Dispatch<React.SetStateAction<keyof T | string>>;
  renderSheetContent: (section: keyof T) => JSX.Element;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isCollapsed?: boolean;
  defaultSections?: ResumeSection[];
  setRenameSectionId?: React.Dispatch<React.SetStateAction<string | null>>;
  setNewSectionTitle?: React.Dispatch<React.SetStateAction<string>>;
  handleDeleteSection?: (sectionId: string) => void;
  renameSectionId?: string | null;
  newSectionTitle?: string;
  handleNewSectionRename?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  isRenameValid?: boolean;
  handleRenameSection?: (sectionId: string) => void;
  isAddSectionSheetOpen?: boolean;
  setIsAddSectionSheetOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  newSectionName?: string;
  handleNewSectionName?: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  isValid?: boolean;
  handleAddSection?: () => void;
  type: "resume" | "cover";
}

export default function LeftSidePanel<T>({
  sections,
  activeSection,
  setActiveSection,
  renderSheetContent,
  isPanelOpen,
  setIsPanelOpen,
  isCollapsed,
  defaultSections,
  setRenameSectionId,
  setNewSectionTitle,
  handleDeleteSection,
  renameSectionId,
  newSectionTitle,
  handleNewSectionRename,
  isRenameValid,
  handleRenameSection,
  isAddSectionSheetOpen,
  setIsAddSectionSheetOpen,
  newSectionName,
  handleNewSectionName,
  isValid,
  handleAddSection,
  type,
}: LeftSidePanelProps<T>) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId as keyof T);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setActiveSection("" as keyof T);
  };

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const renderAddSectionSheet = () => (
    <Sheet open={isAddSectionSheetOpen} onOpenChange={setIsAddSectionSheetOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="w-4 h-4" />
          <span className="ml-2">Add Section</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full sm:w-[540px]">
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
            onClick={isValid ? handleAddSection : undefined}
            className={`w-full ${
              !isValid ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            Create Section
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderSectionButtons = () => (
    <div className="py-4 space-y-2">
      {sections.map((section) => {
        if (section.title !== "UpdatedOn" && section.title !== "CreatedOn") {
          return (
            <div
              key={section.id}
              className="px-2 flex items-center justify-between"
            >
              <Button
                variant={activeSection === section.id ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => handleSectionClick(section.id)}
                title={section.title}
              >
                {section.icon}
                <span className="ml-2 truncate max-w-[120px]">
                  {section.title}
                </span>
              </Button>
              {type === "resume" &&
                !defaultSections!.some((s) => s.id === section.id) && (
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setRenameSectionId!(section.id);
                        setNewSectionTitle!(section.title);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSection!(section.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
            </div>
          );
        } else {
          return <React.Fragment></React.Fragment>
        }
        
      })}
    </div>
  );

  const renderRenameSectionSheet = () => (
    <Sheet
      open={renameSectionId !== null}
      //@ts-ignore
      onOpenChange={(open) => !open && setRenameSectionId(null)}
    >
      <SheetContent side="left" className="w-full sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Rename Section</SheetTitle>
          <SheetDescription>
            Rename your existing section to a new title.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <Label htmlFor="rename-section-name">New Section Name</Label>
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
          <div className="flex flex-col space-y-2">
            <Button
              onClick={
                isRenameValid
                  ? () => handleRenameSection!(renameSectionId!)
                  : undefined
              }
              className={`w-full ${
                !isRenameValid ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Rename Section
            </Button>
            <Button
              variant="outline"
              //@ts-ignore
              onClick={() => setRenameSectionId(null)}
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <div className="relative h-screen pt-[56px]">
      <div className="absolute h-screen flex items-center justify-center">
        <motion.div
          initial={{ x: -240 }}
          animate={{ x: isPanelOpen ? 0 : -240 }}
          transition={{ duration: 0.3 }}
          className="bg-background border-r border-border shadow-lg h-screen rounded-r-lg z-50"
        >
          <ScrollArea className="h-full">
            <div className="w-[240px]">
              {type === "resume" && renderAddSectionSheet()}
              {renderSectionButtons()}
              {type === "resume"  && renderRenameSectionSheet()}
            </div>
          </ScrollArea>
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
              Edit {sections.find((s) => s.id === activeSection)?.title}
            </DialogTitle>
            <DialogDescription>
              Make changes to your section here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto mt-4 pr-4">
            {activeSection && renderSheetContent(activeSection as keyof T)}
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