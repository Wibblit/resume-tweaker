"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, PlusCircle, Menu, MessageSquare, Star, User } from "lucide-react"
import SidebarContent from "@/components/SideBar"
// import { MobileSideBar } from "@/components/MobileSideBar"

export default function HomePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar for larger screens */}
      <aside className="hidden w-64 border-r border-border lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {/* <MobileSideBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      /> */}

      {/* Main content */}
      <AnimatePresence>
        {isLoaded && (
          <motion.main
            className="flex-1 overflow-hidden p-4 md:p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
           
            <ScrollArea className="h-full">
              <Tabs defaultValue="resumes" className="h-full">
                <div className="flex items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="resumes">Resumes</TabsTrigger>
                    <TabsTrigger value="letters">Letters</TabsTrigger>
                  </TabsList>
                  <div className="flex items-center gap-2">
                    <Button>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create New
                    </Button>
                    <Button
                      variant="ghost"
                      className="hidden items-center gap-2 lg:flex"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Input placeholder="Search templates..." />
                </div>
                <TabsContent value="resumes" className="mt-4">
                  <ResumeContent />
                </TabsContent>
                <TabsContent value="letters" className="mt-4">
                  <LetterContent />
                </TabsContent>
              </Tabs>
            </ScrollArea>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResumeContent() {
  const recentResumes = [
    { id: 1, name: "Software Engineer Resume" },
    { id: 2, name: "Marketing Specialist CV" },
    { id: 3, name: "Data Analyst Resume" },
  ]

  const resumeTemplates = [
    { id: 1, name: "Modern Professional" },
    { id: 2, name: "Creative Designer" },
    { id: 3, name: "Executive Summary" },
    { id: 4, name: "Fresh Graduate" },
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold">Recently Edited Resumes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentResumes.map((resume) => (
            <Button key={resume.id} variant="outline" className="h-auto flex-col items-start p-4">
              <FileText className="h-6 w-6 mb-2" />
              <span>{resume.name}</span>
            </Button>
          ))}
          <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
            <PlusCircle className="h-6 w-6 mb-2" />
            <span>Create New Resume</span>
          </Button>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Resume Templates</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resumeTemplates.map((template) => (
            <Button key={template.id} variant="outline" className="h-auto flex-col items-start p-4">
              <div className="aspect-[3/4] w-full bg-muted mb-2"></div>
              <span>{template.name}</span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}

function LetterContent() {
  const recentLetters = [
    { id: 1, name: "Software Engineer Cover Letter" },
    { id: 2, name: "Marketing Specialist Application" },
  ]

  const letterTemplates = [
    { id: 1, name: "Professional Cover Letter" },
    { id: 2, name: "Creative Application Letter" },
    { id: 3, name: "Resignation Letter" },
    { id: 4, name: "Thank You Letter" },
  ]

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-2xl font-bold">Recently Edited Letters</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentLetters.map((letter) => (
            <Button key={letter.id} variant="outline" className="h-auto flex-col items-start p-4">
              <FileText className="h-6 w-6 mb-2" />
              <span>{letter.name}</span>
            </Button>
          ))}
          <Button variant="outline" className="h-auto flex-col items-center justify-center p-4">
            <PlusCircle className="h-6 w-6 mb-2" />
            <span>Create New Letter</span>
          </Button>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold">Letter Templates</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {letterTemplates.map((template) => (
            <Button key={template.id} variant="outline" className="h-auto flex-col items-start p-4">
              <div className="aspect-[3/4] w-full bg-muted mb-2"></div>
              <span>{template.name}</span>
            </Button>
          ))}
        </div>
      </section>
    </div>
  )
}