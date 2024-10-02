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
import { FileText, Menu, MessageSquare, Star, Upload, User } from "lucide-react"

export default function AIReviewPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [reviewType, setReviewType] = useState("generic")
  const [file, setFile] = useState<File | null>(null)
  const [jd, setJd] = useState("")
  const [aiSuggestions, setAiSuggestions] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0]
    if (uploadedFile) {
      setFile(uploadedFile)
    }
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
      <motion.main
        className="flex-1 overflow-auto p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-6 text-3xl font-bold">AI Resume Review</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="resume-upload">Upload Your Resume</Label>
              <div className="mt-2 flex items-center gap-4">
                <Input
                  id="resume-upload"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="flex-1"
                />
                <Button type="button" size="icon" variant="outline">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              {file && <p className="mt-2 text-sm text-muted-foreground">File uploaded: {file.name}</p>}
            </div>
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
            <div>
              <Label htmlFor="jd">Job Description (Optional)</Label>
              <Textarea
                id="jd"
                placeholder="Paste the job description here for tailored suggestions..."
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                className="mt-2"
              />
            </div>
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