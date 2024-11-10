// 'use client'

// import { useEffect, useState, useRef } from "react"
// import { Card, CardDescription, CardHeader } from "@/components/ui/card"
// import { MicroPhone } from "./Microphone"
// import { createModel, KaldiRecognizer, Model } from "vosk-browser"
// import { Textarea } from "@/components/ui/textarea"
// import * as tts from "@diffusionstudio/vits-web";

// interface ComprehensiveInterview {
//   questions: string[]
//   duration: number
// }

// interface VoskResult {
//   result: Array<{
//     conf: number
//     start: number
//     end: number
//     word: string
//   }>
//   text: string
// }

// export function ComprehensiveInterview({ questions }: ComprehensiveInterview) {
//   const [loading, setLoading] = useState(true)
//   const [utterances, setUtterances] = useState<VoskResult[]>([])
//   const [model, setModel] = useState<Model | null>(null)
//   const recognizerRef = useRef<KaldiRecognizer | null>(null)
//   const [partial, setPartial] = useState("")
//   const [recognizerReady, setRecognizerReady] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const [currQuestionIndex, setCurrQuestionIndex] = useState(0);

//   const SpeakQuestion = async () => {
//     const wav = await tts.predict({
//       text: questions[currQuestionIndex],
//       voiceId: 'en_US-hfc_female-medium',
//     });
    
//     const audio = new Audio();
//     audio.src = URL.createObjectURL(wav);
//     audio.play();
//   }

//   useEffect(() => {
//     const loadModel = async () => {
//       try {
//         console.log("Starting to load model...")
//         setLoading(true)
//         model?.terminate()
//         const loadedModel = new Model("/models/vosk-model-small-en-us-0.15.tar.gz")
//         console.log("Model loaded successfully")
//         setModel(loadedModel)
        
//         loadedModel.on("load", async () => {

//           //start first question
//           setCurrQuestionIndex(0);
//           SpeakQuestion();

//           console.log("Initializing recognizer...")
//           const recognizer = new loadedModel.KaldiRecognizer(48000)
//           recognizer.setWords(true)
  
//           recognizer.on("result", (message: any) => {
//             console.log("Received result:", message)
//             const result: VoskResult = message.result
//             setUtterances((utt) => [...utt, result])
//           })
  
//           recognizer.on("partialresult", (message: any) => {
//             console.log("Received partial result:", message)
//             setPartial(message.result.partial)
//           })
  
//           recognizerRef.current = recognizer
//           setRecognizerReady(true)
//           console.log("Recognizer initialized and ready")
//           setLoading(false)
//         })


//         loadedModel.on("error", (err) => {
//           console.error("Error loading model:", err);
//           setError(`Error: ${err instanceof Error ? err.message : String(err)}`);
//         });


//       } catch (error) {
//         console.error("Error loading model or initializing recognizer:", error)
//         setError(`Error: ${error instanceof Error ? error.message : String(error)}`)
//         setLoading(false)
//       }
//     }
//     loadModel()
//   }, [])

//   return (
//     <div className="space-y-4">
//       <Questions
//         recognizer={recognizerRef.current}
//         questions={questions}
//         loading={loading}
//         recognizerReady={recognizerReady}
//         error={error}
//       />
//       <Textarea className="min-h-[100px]" readOnly value={utterances.map((utt) => utt.text).join(" ")} />
//       <div className="text-sm text-gray-500">{partial}</div>
//       {error && <div className="text-red-500">{error}</div>}
//     </div>
//   )
// }

// function Questions({
//   questions,
//   recognizer,
//   loading,
//   recognizerReady,
//   error,
// }: {
//   questions: string[]
//   recognizer: KaldiRecognizer | null
//   loading: boolean
//   recognizerReady: boolean
//   error: string | null
// }) {
//   const [currQuestionIndex, setCurrQuestionIndex] = useState(0)

//   return (
//     <Card>
//       <CardHeader>
//         <div className="text-lg font-semibold">
//           {questions[currQuestionIndex] || "No more questions"}
//         </div>
//       </CardHeader>
//       <CardDescription className="p-4">
//         {loading ? (
//           <div>Loading recognizer... Please wait.</div>
//         ) : error ? (
//           <div className="text-red-500">Error: {error}</div>
//         ) : recognizerReady && recognizer ? (
//           <MicroPhone recognizer={recognizer} loading={loading} />
//         ) : (
//           <div>Recognizer not initialized. Please refresh the page.</div>
//         )}
//       </CardDescription>
//     </Card>
//   )
// }

'use client'

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
  questions,
  duration,
}: InterviewProcessProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAISpeaking, setIsAISpeaking] = useState(false)
  const [userAnswer, setUserAnswer] = useState("")
  const [timeLeft, setTimeLeft] = useState(duration * 60)
  const [isRecording, setIsRecording] = useState(false)
  const [showButtons, setShowButtons] = useState(true)
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await createModel("/models/vosk-model-small-en-us-0.15.tar.gz")
        setModel(loadedModel)
        console.log("Vosk model loaded successfully")
      } catch (error) {
        console.error("Error loading Vosk model:", error)
        toast({
          title: "Error",
          description: "Failed to load speech recognition model. Please try again.",
          variant: "destructive",
        })
      }
    }
    loadModel()
  }, [toast])

  useEffect(() => {
    if (
      questions.length > 0 &&
      currentQuestionIndex < questions.length &&
      !isAISpeaking
    ) {
      speakQuestion(questions[currentQuestionIndex])
    }
  }, [currentQuestionIndex, questions])

  const speakQuestion = async (text: string) => {
    if (isAISpeaking) {
      // If there's an ongoing speech, stop it
      // (Note: @diffusionstudio/vits-web doesn't provide a direct way to stop ongoing speech)
      
    }

    setIsAISpeaking(true)
    setShowButtons(false)

    try {
      const wav = await tts.predict({
        text: text,
        voiceId: 'en_US-hfc_female-medium',
      })
      
      const audio = new Audio()
      audio.src = URL.createObjectURL(wav)
      
      audio.onended = () => {
        setIsAISpeaking(false)
        setShowButtons(true)
      }

      audio.onerror = (event) => {
        console.error("Audio playback error:", event)
        setIsAISpeaking(false)
        setShowButtons(true)
      }

      await audio.play()
    } catch (error) {
      console.error("Speech synthesis error:", error)
      setIsAISpeaking(false)
      setShowButtons(true)
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

      // recognizer.on("partialresult", (message: any) => {
      //   const partial = message.result.partial
      //   setRecognizedText((prev) => prev + " " + partial)
      // })

      recognizerRef.current = recognizer

      micStreamRef.current.on("data", (chunk: any) => {
        recognizer.acceptWaveform(chunk)
      })

      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      toast({
        title: "Error",
        description: "Failed to start recording. Please check your microphone and try again.",
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
    setShowButtons(false)
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
    setShowButtons(false)
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
        {isAISpeaking ? (
          <div className="flex flex-col items-center justify-center h-32">
            <VoiceAnimation />
            <p className="mt-2 text-sm text-muted-foreground">
              AI is speaking...
            </p>
          </div>
        ) : (
          showButtons && (
            <div className="space-y-4">
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
                  disabled={isRecording || !recognizedText}
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
              {recognizedText && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Recognized Text:</p>
                  <Textarea
                    value={recognizedText}
                    onChange={(e) => {
                      setRecognizedText(e.target.value)
                      setUserAnswer(e.target.value)
                    }}
                    className="w-full h-32 p-2 text-muted-foreground bg-muted rounded-md"
                  />
                </div>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}