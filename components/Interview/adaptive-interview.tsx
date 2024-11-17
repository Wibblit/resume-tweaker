"use client";

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoRecorder from "./videoRecorder";
import QuestionDisplay from "./questionDisplay";
import AudioRecorder from "./audioRecorder";
import { Pause, Play } from 'lucide-react';
import InterviewResults from "./interviewResults";
import { useToast } from "@/hooks/use-toast";

interface AdaptiveInterviewProps {
  interviewData: {
    job: string;
    position: string;
    companyName: string;
    jd: string;
    numberOfQuestions: number;
    interviewType: string;
    duration: number;
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
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 || isInterviewComplete) {
          clearInterval(timer);
          if (!isInterviewComplete) {
            handleInterviewComplete();
          }
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isInterviewComplete]);

  useEffect(() => {
    async function fetchFirstQuestion() {
      setIsLoading(true);
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
            chatHistory: [],
          }),
        });
        if (!result.ok) {
          throw new Error("Failed to get the first question");
        }
        const data = await result.json();
        setChatHistory(data.chatHistory);
        setQuestions([data.question]);
      } catch (error) {
        console.error("Error getting the first question:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFirstQuestion();
  }, []);

  const handleNextQuestion = async () => {
    if (!audioBlob) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please record your audio response or skip this question to proceed to the next one."
      });
      return;
    }

    setIsLoading(true);
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
          currentQuestionIndex: currentQuestionIndex + 1,
          chatHistory,
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

      if (currentQuestionIndex + 1 >= numberOfQuestions - 1) {
        handleInterviewComplete();
      }
    } catch (error) {
      console.error("Error getting the next question:", error);
    } finally {
      setIsLoading(false);
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
    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: "Skipped",
      },
    });

    setIsLoading(true);
    try {
      const result = await fetch("/api/adaptive-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jd,
          companyName,
          position,
          job,
          base64Audio: "",
          isSkipped: true,
          numberOfQuestions,
          currentQuestionIndex: currentQuestionIndex + 1,
          chatHistory,
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

      if (currentQuestionIndex + 1 >= numberOfQuestions - 1) {
        handleInterviewComplete();
      }
    } catch (error) {
      console.error("Error getting the next question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInterviewComplete = async () => {
    setIsRecording(false);
    setIsInterviewComplete(true);
    if (chatHistory) {
      console.log("Interview complete, preparing to send audio blob");
      await generateReport();
    } else {
      console.error("No audio blob available at the end of the interview");
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

      setReport(data.report);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          Adaptive Interview - Question {currentQuestionIndex + 1}
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
                    {currentQuestionIndex === 0 ? "Start Recording" : "Resume Recording"}
                  </>
                )}
              </Button>
              <Button onClick={handleSkipQuestion}>Skip Question</Button>
            </div>
          </>
        )}
        {isLoading && (
          <div className="w-full items-center text-center justify-center my-4">
            <div className="size-12 rounded-full border-t-2 border-primary ml-[calc(50%-24px)] border-b-2 animate-spin"></div>
            <div className="mt-2">
              Hold tight! {isInterviewComplete ? "Crafting your interview insights..." : "Preparing the next question..."}
            </div>
          </div>
        )}
        {showReport && report && <InterviewResults data={report} />}
      </CardContent>
    </Card>
  );
}