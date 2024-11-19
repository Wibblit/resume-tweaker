'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdaptiveInterview from "@/components/Interview/adaptive-interview"
import ComprehensiveInterview from "@/components/Interview/comprehensiveInterview"
import { useSearchParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { createModel, Model } from "vosk-browser"

interface InterviewData {
  job: string
  position: string
  companyName: string
  jd: string
  numberOfQuestions: number
  interviewType: string
  duration: number
  resumeText: string
}

export default function InterviewPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const router = useRouter()
  const [comprehensiveQuestions, setComprehensiveQuestion] = useState<string[]>([])
  const [model, setModel] = useState<Model | null>(null)
  const [interviewData, setInterviewData] = useState<InterviewData>({
    job: "",
    position: "",
    companyName: "",
    jd: "",
    numberOfQuestions: 0,
    interviewType: "",
    duration: 0,
    resumeText: "",
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }

    window.addEventListener("beforeunload", handleBeforeUnload)

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [])

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      if (confirm("Are you sure you want to leave? This will delete all ongoing interview details.")) {
        router.back()
      } else {
        window.history.pushState(null, "", window.location.href)
      }
    }

    window.addEventListener("popstate", handlePopState)

    return () => {
      window.removeEventListener("popstate", handlePopState)
    }
  }, [router])

  useEffect(() => {
    async function interviewSetup() {
      try {
        setInterviewData({
          job: searchParams.get("job") || "",
          position: searchParams.get("position") || "",
          companyName: searchParams.get("companyName") || "",
          jd: searchParams.get("jd") || "",
          numberOfQuestions: parseInt(searchParams.get("numberOfQuestions") || "0", 10),
          interviewType: searchParams.get("interviewType") || "",
          duration: parseInt(searchParams.get("duration") || "0", 10),
          resumeText: searchParams.get("resumeText") || ""
        })
      } catch (error) {
        console.error("Error during interview setup:", error)
      }
    }
    interviewSetup()
  }, [searchParams])

  useEffect(() => {
    const fetchQuestions = async () => {
      if (interviewData.interviewType !== "adaptive" && interviewData.job) {
        setIsLoading(true)
        try {
          const response = await fetch("/api/generate-questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              job: interviewData.job,
              position: interviewData.position,
              companyName: interviewData.companyName,
              jd: interviewData.jd,
              numberOfQuestions: interviewData.numberOfQuestions,
              resumeText: interviewData.resumeText,
            }),
          })

          if (!response.ok) {
            throw new Error("Failed to fetch questions")
          }
          const data = await response.json()
          setComprehensiveQuestion(data.questions || [])
        } catch (error) {
          console.error("Error generating questions:", error)
          toast({
            title: "Error generating the questions",
            description: "Unable to join the interview. Please try again.",
            variant: "destructive",
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    fetchQuestions()
  }, [interviewData, toast])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">AI Interview</h1>
      {interviewData.interviewType === "adaptive" ? (
        <AdaptiveInterview interviewData={interviewData} />
      ) : (
        <ComprehensiveInterview questions={comprehensiveQuestions} duration={interviewData.duration} />
      )}
    </main>
  )
}