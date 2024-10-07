"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import SidebarContent from "@/components/SideBar"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Menu, MessageSquare, Star, Upload, User } from "lucide-react"

const SAMPLE_RESUMES = [
  { id: "resume1", name: "Software Engineer Resume" },
  { id: "resume2", name: "Product Manager Resume" },
  { id: "resume3", name: "Data Scientist Resume" },
]

export default function AIReviewPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [reviewType, setReviewType] = useState("generic")
  const [resumeOption, setResumeOption] = useState<"select" | "upload">("select")
  const [selectedResume, setSelectedResume] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
      setIsUploadDialogOpen(false)
      setResumeOption("upload")
    }
  }

  const handleResumeSelect = (value: string) => {
    setSelectedResume(value)
    setResumeOption("select")
    setFile(null)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    // Simulating AI processing
    setAiSuggestions("Processing your resume...")
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAiSuggestions(
      `Here are some suggestions for your resume:
      1. Highlight your key achievements more prominently.
      2. Use more action verbs in your job descriptions.
      3. Tailor your skills section to match the job requirements.
      ${jd ? "4. Your resume aligns well with the provided job description, but consider emphasizing your experience with [specific skill mentioned in JD]." : ""}`
    )
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 md:hidden">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <FileText className="h-6 w-6" />
              AI Resume Review
            </Link>
            {/* <ScrollArea className="h-[calc(100vh-8rem)]">
              <SidebarContent />
            </ScrollArea> */}
          </nav>
        </SheetContent>
      </Sheet>
      <motion.main
        className="flex-1 overflow-auto p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">AI Resume Review</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="resume-option">Resume Option</Label>
              <RadioGroup
                id="resume-option"
                value={resumeOption}
                onValueChange={(value: "select" | "upload") => setResumeOption(value)}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="select" id="select-resume" />
                  <Label htmlFor="select-resume">Select Existing Resume</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload-resume" />
                  <Label htmlFor="upload-resume">Upload New Resume</Label>
                </div>
              </RadioGroup>
            </div>
            {resumeOption === "select" ? (
              <div>
                <Label htmlFor="resume-select">Select Resume</Label>
                <Select value={selectedResume} onValueChange={handleResumeSelect}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_RESUMES.map((resume) => (
                      <SelectItem key={resume.id} value={resume.id}>
                        {resume.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="resume-upload">Upload Your Resume</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    className="flex-1"
                    disabled={resumeOption !== "upload"}
                  />
                  <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" size="icon" variant="outline" disabled={resumeOption !== "upload"}>
                        <Upload className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className="text-lg font-semibold mb-4">Upload Resume</h2>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="w-full"
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {file && <p className="mt-2 text-sm text-muted-foreground">File uploaded: {file.name}</p>}
              </div>
            )}
            <div>
              <Label htmlFor="review-type">Review Type</Label>
              <RadioGroup id="review-type" value={reviewType} onValueChange={setReviewType} className="mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generic" id="generic" />
                  <Label htmlFor="generic">Generic Review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="deep" id="deep" />
                  <Label htmlFor="deep">Deep Analysis</Label>
                </div>
              </RadioGroup>
            </div>
            {reviewType === "deep" && (
              <div>
                <Label htmlFor="jd">Job Description</Label>
                <Textarea
                  id="jd"
                  placeholder="Paste the job description here for tailored suggestions..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
            )}
            <Button type="submit" className="w-full">
              Get AI Suggestions
            </Button>
          </form>
          {aiSuggestions && (
            <div className="mt-8 rounded-lg border border-border bg-muted p-4">
              <h2 className="mb-4 text-xl font-semibold">AI Suggestions</h2>
              <p className="whitespace-pre-line">{aiSuggestions}</p>
            </div>
          )}
        </div>
      </motion.main>
    </div>
  )
}