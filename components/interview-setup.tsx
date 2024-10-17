"use client"

import { useState, ChangeEvent, FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setQuestions, setFormData } from "@/slices/interviewSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Upload, HelpCircle } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import axios from "axios"
import Tesseract, { createWorker, PSM } from "tesseract.js"
import pdfToImages from "@/lib/pdfToImages"

interface FormData {
  job: string
  position: string
  companyName: string
  resume: File | null
  resumeId: string
  resumeOption: "select" | "upload"
  resumeText: string
  jd: string
  duration: number
  interviewer: string
  interviewType: "comprehensive" | "adaptive"
}

interface UserResume {
  id: string
  resumeName: string
}

export default function InterviewSetup() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [formData, setLocalFormData] = useState<FormData>({
    job: "",
    position: "",
    companyName: "",
    resume: null,
    resumeId: "",
    resumeOption: "select",
    resumeText: "",
    jd: "",
    duration: 10,
    interviewer: "",
    interviewType: "comprehensive",
  })
  const [userResumes, setUserResumes] = useState<UserResume[]>([])
  const [ocrProgress, setOcrProgress] = useState(0)
  const [isOcrInProgress, setIsOcrInProgress] = useState(false)
  const workerRef = useRef<Tesseract.Worker | null>(null)

  useEffect(() => {
    async function worker() {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            setOcrProgress(message.progress)
            console.log(message.progress === 1 ? "Done" : message.status)
          }
        },
      })
    }
    worker()
    return () => {
      workerRef.current?.terminate()
      workerRef.current = null
    }
  }, [])

  useEffect(() => {
    async function getUserResumes() {
      try {
        const response = await axios.get<{
          recentResumes: UserResume[]
          message: string
        }>("/api/get-recent-resumes/")
        setUserResumes(response.data.recentResumes)
      } catch (error) {
        console.error("Error fetching user resumes:", error)
      }
    }
    getUserResumes()
  }, [])

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setLocalFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setIsOcrInProgress(true)
    setOcrProgress(0)

    const worker = workerRef.current
    await worker?.load()
    await worker?.loadLanguage("eng")
    await worker?.initialize("eng")
    await worker?.setParameters({ tessjs_create_hocr: '1', tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD })

    let ocrText = ""

    if (uploadedFile.type === "application/pdf") {
      const pdfUrl = URL.createObjectURL(uploadedFile)
      const imageUrls = await pdfToImages(pdfUrl)
      for (let i = 0; i < imageUrls.length; i++) {
        const response = await worker?.recognize(imageUrls[i])
        ocrText += " " + response?.data.text
      }
    } else {
      const response = await worker?.recognize(uploadedFile)
      ocrText = response?.data.text || ""
    }

    setLocalFormData((prev) => ({
      ...prev,
      resume: uploadedFile,
      resumeOption: "upload",
      resumeText: ocrText,
    }))

    setIsOcrInProgress(false)
    setOcrProgress(1)
  }

  const handleResumeSelect = (value: string) => {
    setLocalFormData((prev) => ({
      ...prev,
      resumeId: value,
      resumeOption: "select",
      resume: null,
      resumeText: "",
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const numberOfQuestions = Math.floor(formData.duration / 2)
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: formData.job,
          position: formData.position,
          companyName: formData.companyName,
          resumeId: formData.resumeId,
          resumeOption: formData.resumeOption,
          resumeText: formData.resumeText,
          jd: formData.jd,
          numberOfQuestions,
          interviewType: formData.interviewType,
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to generate questions")
      }
      const data = await response.json()
      dispatch(setQuestions(data.questions))
      dispatch(setFormData(formData))
      router.push(`/ai-interview/interview`)
    } catch (error) {
      console.error("Error generating questions:", error)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Interview Setup</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="job">Job</Label>
          <Input
            id="job"
            name="job"
            placeholder="e.g. Software Engineer"
            onChange={handleInputChange}
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            placeholder="e.g. Senior"
            onChange={handleInputChange}
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder="e.g. Tech Corp"
            onChange={handleInputChange}
            required
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="resume-option">Resume Option</Label>
          <RadioGroup
            value={formData.resumeOption}
            onValueChange={(value: "select" | "upload") =>
              setLocalFormData((prev) => ({ ...prev, resumeOption: value }))
            }
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
        {formData.resumeOption === "select" ? (
          <div>
            <Label htmlFor="resume-select">Select Resume</Label>
            <Select value={formData.resumeId} onValueChange={handleResumeSelect}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Choose a resume" />
              </SelectTrigger>
              <SelectContent>
                {userResumes?.map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.resumeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label htmlFor="resume">Upload Resume</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Input
                id="resume"
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx"
                disabled={isOcrInProgress}
              />
              <Button
                type="button"
                onClick={() => document.getElementById("resume")?.click()}
                variant="secondary"
                className="w-full"
                disabled={isOcrInProgress}
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Resume
              </Button>
              <span className="text-sm text-muted-foreground">
                {formData.resume ? formData.resume.name : "No file chosen"}
              </span>
            </div>
            {isOcrInProgress && (
              <div className="mt-4">
                <Label>Extracting data from file...</Label>
                <Progress value={ocrProgress * 100} className="mt-2" />
                <p className="text-sm text-muted-foreground mt-1">
                  {(ocrProgress * 100).toFixed(0)}% complete
                </p>
              </div>
            )}
          </div>
        )}
        <div>
          <Label htmlFor="jd">Job Description (Optional)</Label>
          <Textarea
            id="jd"
            name="jd"
            placeholder="Paste job description here..."
            onChange={handleInputChange}
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="duration">Duration (max 20 mins)</Label>
          <Slider
            id="duration"
            min={5}
            max={20}
            step={1}
            value={[formData.duration]}
            onValueChange={(value) =>
              setLocalFormData((prev) => ({ ...prev, duration: value[0] }))
            }
            className="mt-2"
          />
          <span className="text-sm text-muted-foreground">
            {formData.duration} minutes
          </span>
        </div>
        <div>
          <Label htmlFor="interviewer">Interviewer Name</Label>
          <Input
            id="interviewer"
            name="interviewer"
            placeholder="e.g. John Doe"
            onChange={handleInputChange}
            required
            className="mt-2"
          />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <Label>Interview Type</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Comprehensive: A set of predefined questions.</p>
                  <p>Adaptive: Questions adjust based on your answers.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <RadioGroup
            defaultValue={formData.interviewType}
            onValueChange={(value) =>
              setLocalFormData((prev) => ({
                ...prev,
                interviewType: value as "comprehensive" | "adaptive",
              }))
            }
            className="mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comprehensive" id="comprehensive" />
              <Label htmlFor="comprehensive">Comprehensive Interview</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="adaptive" id="adaptive" />
              <Label htmlFor="adaptive">Adaptive Flow Interview</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit" className="w-full" disabled={isOcrInProgress}>
          Start Interview
        </Button>
      </form>
    </div>
  )
}