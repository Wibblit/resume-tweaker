"use client"

import { useEffect, useState, useRef } from "react"
import { useDispatch } from "react-redux"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkipForward, StopCircle, Mic, Send, Download } from "lucide-react"
import { VoiceAnimation } from "@/components/voice-animation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { createModel, KaldiRecognizer, Model } from "vosk-browser"
import * as tts from "@diffusionstudio/vits-web"
import MicrophoneStream from "microphone-stream"

interface InterviewProcessProps {
  questions: string[]
  duration: number
}

interface HistoryItem {
  question: string
  answer: string
}

interface ReportData {
  evaluation: {
    category: string
    score: number
    comment: string
  }[]
  overall_score: number
  final_recommendation: string
  overall_comment: string
}

export default function ComprehensiveInterview({
  questions = [],
  duration = 60,
}: InterviewProcessProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRecording, setIsRecording] = useState(false)
  const [recognizedText, setRecognizedText] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [report, setReport] = useState<ReportData | null>(null)
  const [showReport, setShowReport] = useState(false)
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [model, setModel] = useState<Model | null>(null)
  const recognizerRef = useRef<KaldiRecognizer | null>(null)
  const micStreamRef = useRef<any>(null)
  const dispatch = useDispatch()
  const { toast } = useToast()
  const [audioBlobQueue, setAudioBlobQueue] = useState<Blob[]>([])
  const [isAudioLoaded, setIsAudioLoaded] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const queueAudioForQuestion = async (text: string) => {
    try {
      const wav = await tts.predict({
        text,
        voiceId: "en_US-hfc_female-medium",
      })
      setAudioBlobQueue((prevQueue) => [...prevQueue, wav])
      setIsAudioLoaded(true)
    } catch (error) {
      console.error("Error generating TTS:", error)
      setIsAudioLoaded(false)
    }
  }

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await createModel(
          "/models/vosk-model-small-en-us-0.15.tar.gz"
        )
        setModel(loadedModel)
        console.log("Vosk model loaded successfully")

        if (questions.length > 0) {
          await queueAudioForQuestion(questions[0])
        }
      } catch (error) {
        console.error("Error loading Vosk model:", error)
        toast({
          title: "Error",
          description:
            "Failed to load speech recognition model. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadModel()
  }, [questions, toast])

  useEffect(() => {
    if (
      questions.length > 0 &&
      currentQuestionIndex < questions.length &&
      !isAISpeaking &&
      isAudioLoaded
    ) {
      speakQuestion(questions[currentQuestionIndex])
    }
  }, [currentQuestionIndex, questions, isAudioLoaded])

  const speakQuestion = async (text: string) => {
    if (isAISpeaking) {
      return
    }

    setIsAISpeaking(true)

    try {
      if (audioBlobQueue.length === 0) {
        console.error("No audio available in queue")
        setIsAISpeaking(false)
        return
      }

      const wav = audioBlobQueue[0]
      setAudioBlobQueue((prevQueue) => prevQueue.slice(1))

      const audio = new Audio(URL.createObjectURL(wav))
      console.log("Created audio URL")

      audio.onended = () => {
        setIsAISpeaking(false)
        URL.revokeObjectURL(audio.src)
      }

      audio.onerror = (event) => {
        console.error("Audio playback error:", event)
        setIsAISpeaking(false)
        URL.revokeObjectURL(audio.src)
      }

      await audio.play()
      if (currentQuestionIndex < questions.length - 1) {
        queueAudioForQuestion(questions[currentQuestionIndex + 1])
      }
    } catch (error) {
      console.error("Speech synthesis error:", error)
      setIsAISpeaking(false)
    }
  }

  const startRecording = async () => {
    if (!model) {
      console.error("Vosk model not loaded")
      return
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      })

      micStreamRef.current = new MicrophoneStream({
        objectMode: true,
        bufferSize: 1024,
      })
      micStreamRef.current.setStream(mediaStream)

      const recognizer = new model.KaldiRecognizer(48000)
      recognizer.setWords(true)

      recognizer.on("result", (message: any) => {
        const result = message.result
        setRecognizedText((prev) => prev + " " + result.text)
        setUserAnswer((prev) => prev + " " + result.text)
      })

      recognizerRef.current = recognizer

      micStreamRef.current.on("data", (chunk: any) => {
        recognizer.acceptWaveform(chunk)
      })

      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Error",
        description:
          "Failed to start recording. Please check your microphone and try again.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (micStreamRef.current) {
      micStreamRef.current.stop()
      micStreamRef.current = null
    }
    if (recognizerRef.current) {
      recognizerRef.current.remove()
      recognizerRef.current = null
    }
    setIsRecording(false)
  }

  const submitAnswer = () => {
    const newHistoryItem: HistoryItem = {
      question: questions[currentQuestionIndex],
      answer: recognizedText,
    }
    setHistory((prevHistory) => [...prevHistory, newHistoryItem])
    console.log("Entered submit ans func")
    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: recognizedText,
      },
    })

    setUserAnswer("")
    setRecognizedText("")
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    setIsAISpeaking(false)

    if (currentQuestionIndex === questions.length - 1) {
      generateReport()
    }
  }

  const skipQuestion = () => {
    const newHistoryItem: HistoryItem = {
      question: questions[currentQuestionIndex],
      answer: "Skipped",
    }
    setHistory((prevHistory) => [...prevHistory, newHistoryItem])

    setUserAnswer("")
    setRecognizedText("")
    stopRecording()
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    setIsAISpeaking(false)

    if (currentQuestionIndex === questions.length - 1) {
      generateReport()
    }
  }

  const generateReport = async () => {
    setIsGeneratingReport(true)
    try {
      const finalHistory = [
        ...history,
        {
          question: questions[currentQuestionIndex],
          answer: recognizedText || "Skipped",
        },
      ]

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: finalHistory }),
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
        throw new Error("Failed to generate report")
      }

      const { report } = await response.json()
      const parsedResult = JSON.parse(report)
      console.log(parsedResult, "report ")
      setReport(parsedResult)
      setShowReport(true)
    } catch (error) {
      console.error("Error generating report:", error)
      setReport(null)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const downloadReport = () => {
    if (!report) return

    const reportText = `
Interview Report

Overall Score: ${report.overall_score}
Final Recommendation: ${report.final_recommendation}

Overall Comment:
${report.overall_comment}

Evaluation:
${report.evaluation
  .map(
    (item) => `
${item.category}
Score: ${item.score}
Comment: ${item.comment}
`
  )
  .join("\n")}
`

    const blob = new Blob([reportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "interview-report.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (currentQuestionIndex >= questions.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Interview completed!</h2>
        {isGeneratingReport ? (
          <div className="text-center">
            <p className="mb-2">Generating report...</p>
            <Progress value={66} className="w-[60%]" />
          </div>
        ) : (
          <Dialog open={showReport} onOpenChange={setShowReport}>
            <DialogTrigger asChild>
              <Button>View Report</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[800px] w-full">
              <DialogHeader>
                <DialogTitle>Interview Report</DialogTitle>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] overflow-auto">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Overall Score: {report?.overall_score}
                    </h3>
                    <p className="font-medium">
                      Final Recommendation: {report?.final_recommendation}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Overall Comment:</h3>
                    <p>{report?.overall_comment}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Evaluation:</h3>
                    {report?.evaluation.map((item, index) => (
                      <div key={index} className="mb-2">
                        <h4 className="font-medium">{item.category}</h4>
                        <p>Score: {item.score}</p>
                        <p>{item.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollArea>
              <div className="flex justify-end mt-4">
                <Button onClick={downloadReport}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    )
  }

  return (
    <Card className="max-w-4xl mx-auto relative bg-card text-card-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">
          Comprehensive Interview - Question {currentQuestionIndex + 1}
        </CardTitle>
        <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
          Time: {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4 text-foreground">
          {questions[currentQuestionIndex]}
        </p>
        <div className="flex flex-col items-center justify-center h-32 mb-4">
          <VoiceAnimation isActive={isAISpeaking} />
          <p className="mt-2 text-sm text-muted-foreground">
            {isAISpeaking ? "AI is speaking..." : "AI voice"}
          </p>
        </div>
        <div className="space-y-4">
          <Textarea
            value={recognizedText}
            onChange={(e) => {
              setRecognizedText(e.target.value)
              setUserAnswer(e.target.value)
            }}
            placeholder="Your answer will appear here. You can also type or edit your response."
            className="w-full h-32 p-2 text-foreground bg-background rounded-md resize-y"
          />
          <div className="flex items-center justify-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                variant="secondary"
                className="bg-secondary text-secondary-foreground"
              >
                <Mic className="mr-2 h-4 w-4" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                variant="destructive"
                className="bg-destructive text-destructive-foreground"
              >
                <StopCircle className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            )}
            <Button
              onClick={submitAnswer}
              disabled={!recognizedText.trim()}
              variant="default"
              className="bg-primary text-primary-foreground"
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Answer
            </Button>
            <Button
              onClick={skipQuestion}
              variant="outline"
              className="bg-muted text-muted-foreground"
            >
              <SkipForward className="mr-2 h-4 w-4" />
              Skip Question
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}