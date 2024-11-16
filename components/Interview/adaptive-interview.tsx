'use client'

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkipForward, Mic, StopCircle } from 'lucide-react'
import { ScrollArea } from "@/components/ui/scroll-area"
import ReactMarkdown from "react-markdown"
import { useToast } from "@/hooks/use-toast"
import VideoRecorder from "./videoRecorder"
import AudioRecorder from "./audioRecorder"
import InterviewResults from "./interviewResults"

interface InterviewData {
  job: string
  position: string
  companyName: string
  jd: string
}

interface HistoryItem {
  role: string
  content: string
}

export default function AdaptiveInterview({ formData }: { formData: InterviewData }) {
  const [currentQuestion, setCurrentQuestion] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (!currentQuestion && !isInterviewComplete) {
      fetchNextQuestion()
    }
  }, [currentQuestion, isInterviewComplete])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prevTime) => prevTime + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const fetchNextQuestion = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/adaptive-interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          history,
          timeSpent,
        }),
      })

      if (response.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        })
        return
      }

      if (!response.ok) {
        throw new Error("Failed to fetch question")
      }

      const data = await response.json()

      if (data.isComplete) {
        setIsInterviewComplete(true)
        setReport(JSON.parse(data.report))
      } else {
        setCurrentQuestion(data.question)
        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "assistant", content: data.question },
        ])
      }
    } catch (error) {
      console.error("Error fetching question:", error)
      toast({
        title: "Error",
        description: "Failed to fetch the next question. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const submitAnswer = async () => {
    if (!audioBlob) {
      toast({
        title: "No Recording",
        description: "Please record an answer before submitting.",
        variant: "destructive",
      })
      return
    }

    try {
      const base64Audio = await blobToBase64(audioBlob)
      const newHistory = [...history, { role: "user", content: base64Audio }]
      setHistory(newHistory)

      setAudioBlob(null)
      setCurrentQuestion("")

      await fetchNextQuestion()
    } catch (error) {
      console.error("Error converting audio to base64:", error)
      toast({
        title: "Error",
        description: "Failed to process audio. Please try again.",
        variant: "destructive",
      })
    }
  }

  const skipQuestion = async () => {
    const newHistory = [...history, { role: "user", content: "Skipped" }]
    setHistory(newHistory)
    setAudioBlob(null)
    setIsRecording(false)
    setCurrentQuestion("")

    await fetchNextQuestion()
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result.split(',')[1])
        } else {
          reject(new Error('Failed to convert blob to base64'))
        }
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  if (isInterviewComplete && report) {
    return <InterviewResults data={report} />
  }

  return (
    <Card className="max-w-4xl mx-auto relative bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Adaptive Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <VideoRecorder isInterviewComplete={isInterviewComplete} />
        <ScrollArea className="h-[300px] mb-4">
          <ReactMarkdown className="text-lg mb-4 text-foreground">
            {currentQuestion}
          </ReactMarkdown>
        </ScrollArea>
        <div className="space-y-4">
          <AudioRecorder
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            setAudioBlob={setAudioBlob}
          />
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={toggleRecording}
              variant={isRecording ? "destructive" : "default"}
              className="bg-primary text-primary-foreground"
            >
              {isRecording ? (
                <>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>
            <Button
              onClick={submitAnswer}
              disabled={isLoading || !audioBlob}
              variant="default"
              className="bg-primary text-primary-foreground"
            >
              Submit Answer
            </Button>
            <Button
              onClick={skipQuestion}
              disabled={isLoading}
              variant="outline"
              className="bg-muted text-muted-foreground"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip Question
            </Button>
          </div>
        </div>
        {isLoading && (
          <div className="w-full items-center text-center justify-center my-4">
            <div
              className="size-12 rounded-full border-t-2 border-primary ml-[calc(50%-24px)]
       border-b-2 animate-spin"
            ></div>
            <div className="mt-2">Processing...</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}