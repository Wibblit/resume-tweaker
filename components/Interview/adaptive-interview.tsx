"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoRecorder from "./videoRecorder";
import QuestionDisplay from "./questionDisplay";
import AudioRecorder from "./audioRecorder";
import { Loader2, LogOut, Pause, Play } from 'lucide-react';
import InterviewResults from "./interviewResults";
import AudioVisualization from "./audioVisualization";
import * as tts from "@diffusionstudio/vits-web";
import { NoAudioAlert } from "./NoAudioAlert";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { ConfirmQuitModal } from "./ConfirmQuiteModal";

interface AdaptiveInterviewProps {
  interviewData: {
    job: string;
    position: string;
    companyName: string;
    jd: string;
    numberOfQuestions: number;
    interviewType: string;
    duration: number;
    resumeText: string;
    interviewerPosition: string;
  };
}

type ChatHistory = {
  role: "user" | "model";
  parts: { text: string }[];
}[];

export default function AdaptiveInterview({
  interviewData,
}: AdaptiveInterviewProps) {
  const {
    job,
    position,
    companyName,
    jd,
    duration,
    numberOfQuestions,
    resumeText,
    interviewerPosition,
  } = interviewData;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRecording, setIsRecording] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const [showNoAudioAlert, setShowNoAudioAlert] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [skipQuestionLoading, setSkipQuestionLoding] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isTimerPaused) {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            if (currentQuestionIndex >= numberOfQuestions - 1) {
              // Don't clear the interval for the last question
              return prevTime;
            }
            clearInterval(timer);
            if (isInterviewComplete) {
              handleInterviewComplete();
            }
            return 0;
          }
          return prevTime - 1;
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isInterviewComplete, isTimerPaused, currentQuestionIndex, numberOfQuestions]);

  useEffect(() => {
    fetchFirstQuestion();
  }, []);

  const handleQuitInterview = () => {
    setIsQuitModalOpen(true);
  };

  const handleConfirmQuit = () => {
    router.replace("/ai-interview");
  };

  const fetchFirstQuestion = async () => {
    setIsTimerPaused(true);
    try {
      const result = await fetch("/api/adaptive-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd,
          companyName,
          position,
          job,
          numberOfQuestions,
          currentQuestionIndex: 0,
          resumeText,
          totalDuration: duration,
          chatHistory: [],
          timeLeft: timeLeft / 60,
          interviewerPosition,
        }),
      });
      if (!result.ok) {
        throw new Error("Failed to get the first question");
      }
      const data = await result.json();
      setChatHistory(data.chatHistory);
      setQuestions([data.question]);
      generateAudio(data.question);
    } catch (error) {
      console.error("Error getting the first question:", error);
    } finally {
      setIsTimerPaused(false);
    }
  };

  const generateAudio = async (question: string) => {
    setIsTimerPaused(true);
    try {
      const wav = await tts.predict({
        text: question,
        voiceId: "en_US-hfc_male-medium",
      });
      const audioUrl = URL.createObjectURL(wav);
      setAudioQueue((prevQueue) => [...prevQueue, audioUrl]);
    } catch (error) {
      console.error(`Error generating audio for question:`, error);
    } finally {
      setIsTimerPaused(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!audioBlob) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Please record your audio response or skip this question to proceed to the next one.",
      });
      return;
    }

    setIsTimerPaused(true);
    try {
      const base64Audio = await blobToBase64(audioBlob);

      const result = await fetch("/api/adaptive-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd,
          companyName,
          position,
          job,
          base64Audio,
          isSkipped: false,
          numberOfQuestions,
          resumeText,
          currentQuestionIndex: currentQuestionIndex + 1,
          totalDuration: duration,
          chatHistory,
          timeLeft: timeLeft / 60,
          interviewerPosition,
        }),
      });
      if (!result.ok) {
        throw new Error("Failed to get the next question");
      }
      const data = await result.json();
      setChatHistory(data.chatHistory);
      setQuestions((prev) => [...prev, data.question]);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAudioBlob(null);
      generateAudio(data.question);

      if (currentQuestionIndex >= numberOfQuestions - 1) {
        handleInterviewComplete();
      } else {
        setIsTimerPaused(false);
      }
    } catch (error) {
      console.error("Error getting the next question:", error);
      setIsTimerPaused(false);
    }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result.split(",")[1]);
        } else {
          reject(new Error("Failed to convert blob to base64"));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const handleSkipQuestion = async () => {
    setSkipQuestionLoding(true);
    setIsTimerPaused(true);
    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: "Skipped",
      },
    });

    mediaRecorderRef.current?.stop();
    setIsPlayingAudio(false);

    try {
      const result = await fetch("/api/adaptive-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd,
          companyName,
          position,
          job,
          isSkipped: true,
          numberOfQuestions,
          resumeText,
          currentQuestionIndex: currentQuestionIndex + 1,
          chatHistory,
          totalDuration: duration,
          timeLeft: timeLeft / 60,
          interviewerPosition,
        }),
      });
      if (!result.ok) {
        throw new Error("Failed to get the next question");
      }
      const data = await result.json();
      setChatHistory(data.chatHistory);
      setQuestions((prev) => [...prev, data.question]);
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setAudioBlob(null);
      generateAudio(data.question);
      setSkipQuestionLoding(false);
      if (currentQuestionIndex >= numberOfQuestions - 1) {
        handleInterviewComplete();
      } else {
        setIsTimerPaused(false);
      }
    } catch (error) {
      console.error("Error getting the next question:", error);
      setSkipQuestionLoding(false);
      setIsTimerPaused(false);
    }
  };

  const handleInterviewComplete = async () => {
    setIsRecording(false);
    setIsInterviewComplete(true);
    setIsTimerPaused(true);
    if (audioBlob || currentQuestionIndex >= numberOfQuestions - 1) {
      console.log("Interview complete, preparing to send audio blob");
      await generateReport();
    } else {
      console.error("No audio blob available at the end of the interview");
      setShowNoAudioAlert(true);
    }
  };

  const generateReport = async () => {
    try {
      console.log("Starting report generation process");
      setIsLoading(true);
      const response = await fetch("/api/generate-adaptive-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timeSpent: duration * 60 - timeLeft,
          chatHistory,
        }),
      });

      console.log("Request sent, status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Report data received:", data);

      setReport(JSON.parse(data.report));
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto bg-background shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center pb-4">
          <span>Adaptive Interview - Question {currentQuestionIndex + 1}</span>
          <Button
            onClick={handleQuitInterview}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Quit Interview
          </Button>
        </CardTitle>
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium mt-4">
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
              audioUrl={audioQueue[currentQuestionIndex]}
              isPlayingAudio={isPlayingAudio}
              setIsPlayingAudio={setIsPlayingAudio}
            />
            <AudioRecorder
              isRecording={isRecording}
              setIsRecording={setIsRecording}
              setAudioBlob={setAudioBlob}
              mediaRecorderRef={mediaRecorderRef}
            />
            <AudioVisualization isRecording={isRecording} />
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
                    {currentQuestionIndex === 0 ? (
                      <span>Start Recording</span>
                    ) : (
                      <span>Resume Recording</span>
                    )}
                  </>
                )}
              </Button>
              <Button onClick={handleSkipQuestion}>
                {skipQuestionLoading ? (
                  <div className="flex">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Skipping Question...
                  </div>
                ) : (
                  <span>Skip Question</span>
                )}
              </Button>
            </div>
          </>
        )}
        {isLoading && (
          <div className="w-full items-center text-center justify-center my-4">
            <div className="size-12 rounded-full border-t-2 border-primary ml-[calc(50%-24px)] border-b-2 animate-spin"></div>
            <div className="mt-2">
              Hold tight! Crafting your interview insights...
            </div>
          </div>
        )}
        {showReport && report && <InterviewResults data={report} />}
        <ConfirmQuitModal
          isOpen={isQuitModalOpen}
          onClose={() => setIsQuitModalOpen(false)}
          onConfirm={handleConfirmQuit}
        />
      </CardContent>
      <NoAudioAlert
        isOpen={showNoAudioAlert}
        onClose={() => setShowNoAudioAlert(false)}
      />
    </Card>
  );
}

