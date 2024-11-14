'use client'

import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import VideoRecorder from "./videoRecorder"
import QuestionDisplay from "./questionDisplay"
import AudioRecorder from "./audioRecorder"
import { Pause, Play } from 'lucide-react'
import InterviewResults from "./interviewResults"; 

interface VideoInterviewProps {
  questions: string[]
  duration: number
}

export default function ComprehensiveInterview({
  questions = [],
  duration = 5,
}: VideoInterviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [report, setReport] = useState(null)
  const [isInterviewComplete, setIsInterviewComplete] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 || isInterviewComplete) {
          clearInterval(timer)
          if (!isInterviewComplete) {
            handleInterviewComplete()
          }
          return 0
        }
        return prevTime - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isInterviewComplete])

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    } else {
      handleInterviewComplete()
    }
  }

  const handleSkipQuestion = () => {
    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: "Skipped",
      },
    })
    handleNextQuestion()
  }

  const handleInterviewComplete = async () => {
    setIsRecording(false)
    setIsInterviewComplete(true)
    if (audioBlob) {
      console.log("Interview complete, preparing to send audio blob")
      await generateReport(audioBlob)
    } else {
      console.error("No audio blob available at the end of the interview")
    }
  }

  const generateReport = async (audioBlob: Blob) => {
    try {
      console.log("Starting report generation process")
      const base64Audio = await blobToBase64(audioBlob)
      console.log("Audio converted to base64, length:", base64Audio.length)

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questions,
          base64Audio,
          timeSpent: duration * 60 - timeLeft,
        }),
      })

      console.log("Request sent, status:", response.status)

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Report data received:", data)

      setReport(JSON.parse(data.report)); // Update: Parse the report data

      setShowReport(true)
    } catch (error) {
      console.error("Error generating report:", error)
    }
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

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Video Interview - Question {currentQuestionIndex + 1}
        </CardTitle>
        <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
          Time: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </CardHeader>
      <CardContent>
        <VideoRecorder isInterviewComplete={isInterviewComplete} />
        {!isInterviewComplete && (
          <>
            <QuestionDisplay
              question={questions[currentQuestionIndex]}
              onNextQuestion={handleNextQuestion}
            />
            <AudioRecorder
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setAudioBlob={setAudioBlob}
            />
            <div className="flex justify-between mt-4">
              <Button
                onClick={() => setIsRecording(!isRecording)}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center"
              >
                {isRecording ? (
                  <>
                    <Pause className="mr-2 h-4 w-4" />
                    Pause Recording
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Resume Recording
                  </>
                )}
              </Button>
              <Button onClick={handleSkipQuestion}>Skip Question</Button>
            </div>
          </>
        )}
      </CardContent>
      {showReport && report && ( // Update: Check for report data
        <InterviewResults data={report} /> // Update: Render InterviewResults component
      )}
    </Card>
  )
}