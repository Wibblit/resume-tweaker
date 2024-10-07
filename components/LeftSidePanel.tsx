"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, ChevronLeft, Menu } from "lucide-react"
import { ResumeData } from "@/types/types"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { useMediaQuery } from "react-responsive"

interface ResumeSectionProps {
  id: string
  title: string
  icon: React.ReactNode
}

interface LeftSidePanelProps {
  resumeSections: ResumeSectionProps[]
  activeSection: string
  setActiveSection: (id: string) => void
  renderSheetContent: (section: keyof ResumeData) => JSX.Element
}

export default function LeftSidePanel({
  resumeSections,
  activeSection,
  setActiveSection,
  renderSheetContent,
}: LeftSidePanelProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const isPhoneView = useMediaQuery({ maxWidth: 767 })

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setActiveSection("")
  }

  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen)
  }

  const panelHeight = resumeSections.length * 48 + 32 // 48px per icon + 32px padding

  return (
    <>
      <motion.div
        initial={{ x: -60 }}
        animate={{ x: isPanelOpen ? 0 : -60 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-background border-r border-border shadow-lg rounded-r-lg z-50 flex"
        style={{ height: `${panelHeight}px` }}
      >
        <div className="w-[60px]">
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
        </div>
        <div className="absolute -right-12 top-1/2 -translate-y-1/2">
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full shadow-md bg-background border border-border"
            onClick={togglePanel}
          >
            {isPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </motion.div>

      <AnimatePresence>
        {!isPanelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed left-4 top-4 z-50"
          >
            <Button
              variant="secondary"
              size="icon"
              onClick={togglePanel}
              className="rounded-md shadow-md bg-background border border-border"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent 
          className="sm:max-w-[425px] flex flex-col h-[100dvh] max-h-[100dvh]"
        >
          <DialogHeader>
            <DialogTitle>
              Edit {resumeSections.find((s) => s.id === activeSection)?.title}
            </DialogTitle>
            <DialogDescription>
              Make changes to your resume section here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow overflow-y-auto mt-4 pr-4">
            {activeSection && renderSheetContent(activeSection as keyof ResumeData)}
          </div>
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
  )
}