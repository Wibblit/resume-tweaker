'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SkipForward, StopCircle, Mic, Send } from 'lucide-react'
import { VoiceAnimation } from '@/components/voice-animation'
import { useDispatch } from 'react-redux'

interface InterviewProcessProps {
  questions: string[]
  formData: any
}

export function InterviewProcess({ questions, formData }: InterviewProcessProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isAISpeaking, setIsAISpeaking] = useState(true) // Start as true to trigger immediate speech
  const [userAnswer, setUserAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(formData.duration * 60) // Convert minutes to seconds
  const [isRecording, setIsRecording] = useState(false)
  const [showButtons, setShowButtons] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null)
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Ensure voices are ready before speech synthesis starts
    let voices = speechSynthesis.getVoices()
    if (voices.length === 0) {
      speechSynthesis.onvoiceschanged = () => {
        voices = speechSynthesis.getVoices()
        initializeSpeech()
      }
    } else {
      initializeSpeech()
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (currentQuestionIndex < questions.length && !isAISpeaking) {
      speakQuestion(questions[currentQuestionIndex])
    }
  }, [currentQuestionIndex, questions, isAISpeaking])

  const initializeSpeech = () => {
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (voice) => voice.name.includes("Google") && voice.lang.startsWith("en")
    ) || voices[0];
    console.log("preferredVoice", preferredVoice);
    if (preferredVoice) {
      speechSynthesisRef.current = new SpeechSynthesisUtterance();
      speechSynthesisRef.current.voice = preferredVoice;
      speechSynthesisRef.current.rate = 1;
      speechSynthesisRef.current.pitch = 1;
      speakQuestion(questions[currentQuestionIndex]); // Start speech on mount
    } else {
      console.log("No preferred voice");
    }
  };
  

  const speakQuestion = (text: string) => {
    if (speechSynthesisRef.current) {
      setIsAISpeaking(true)
      setShowButtons(false) // Hide buttons while AI is speaking
      speechSynthesisRef.current.text = text
      speechSynthesis.speak(speechSynthesisRef.current)
      speechSynthesisRef.current.onend = () => {
        setIsAISpeaking(false)
        setShowButtons(true) // Show buttons once AI is done speaking
      }
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      mediaRecorderRef.current.start()
      setIsRecording(true)

      const chunks: Blob[] = []
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data)
      }

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        await processAudio(audioUrl)
      }
    } catch (err) {
      console.error("Error accessing microphone:", err)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const processAudio = async (audioUrl: string) => {
    // Simulating audio to text processing
    setUserAnswer("This is a simulated user answer converted from speech to text.")
    // Store the answer in Redux if needed
    dispatch({ type: 'STORE_ANSWER', payload: { questionIndex: currentQuestionIndex, answer: "This is a simulated user answer." } })
  }

  const submitAnswer = () => {
    console.log("Submitting answer:", userAnswer)
    setUserAnswer('')
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    setShowButtons(false)
    setIsAISpeaking(true) // Prepare for the next question
  }

  const skipQuestion = () => {
    setUserAnswer('')
    setIsRecording(false)
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
    setShowButtons(false)
    setIsAISpeaking(true) // Prepare for the next question
  }

  if (currentQuestionIndex >= questions.length) {
    return <div>Interview completed! Generating report...</div>
  }

  return (
    <Card className="max-w-4xl mx-auto relative bg-card text-card-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">Question {currentQuestionIndex + 1}</CardTitle>
        <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
          Time: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4 text-foreground">{questions[currentQuestionIndex]}</p>
        {isAISpeaking ? (
          <div className="flex flex-col items-center justify-center h-32">
            <VoiceAnimation />
            <p className="mt-2 text-sm text-muted-foreground">AI is speaking...</p>
          </div>
        ) : (
          showButtons && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                {!isRecording ? (
                  <Button onClick={startRecording} variant="secondary" className="bg-secondary text-secondary-foreground">
                    <Mic className="mr-2 h-4 w-4" />
                    Start Recording
                  </Button>
                ) : (
                  <Button onClick={stopRecording} variant="destructive" className="bg-destructive text-destructive-foreground">
                    <StopCircle className="mr-2 h-4 w-4" />
                    Stop Recording
                  </Button>
                )}
                <Button onClick={submitAnswer} disabled={isRecording || !userAnswer} variant="default" className="bg-primary text-primary-foreground">
                  <Send className="mr-2 h-4 w-4" />
                  Submit Answer
                </Button>
                <Button onClick={skipQuestion} disabled={isRecording} variant="outline" className="bg-background text-foreground">
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip Question
                </Button>
              </div>
              {userAnswer && (
                <Card className="bg-muted">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Your Answer</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{userAnswer}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
