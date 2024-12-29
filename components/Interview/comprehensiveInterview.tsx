"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import VideoRecorder from "./videoRecorder";
import AudioRecorder from "./audioRecorder";
import {
  AudioLines,
  CircleArrowRight,
  Loader2,
  LogOut,
  Pause,
  Play,
  RedoDot,
  SkipForward,
  Volume2,
} from "lucide-react";
import InterviewResults from "./interviewResults";
import AudioVisualization from "./audioVisualization";
import * as tts from "@diffusionstudio/vits-web";
import { NoAudioAlert } from "./NoAudioAlert";
import { useRouter } from "next/navigation";
import { ConfirmQuitModal } from "./ConfirmQuiteModal";
import { TypeAnimation } from "react-type-animation";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
interface ComprehensiveInterviewProps {
  questions: string[];
  duration: number;
}

export default function ComprehensiveInterview({
  questions = [],
  duration = 5,
}: ComprehensiveInterviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showNoAudioAlert, setShowNoAudioAlert] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState(null);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const dispatch = useDispatch();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const currentAudioUrl = audioQueue[currentQuestionIndex] || "";
  const currQuestion = questions[currentQuestionIndex] || "";
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1 || isInterviewComplete) {
          clearInterval(timer);
          if (isInterviewComplete) {
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
    generateAudioQueue();
  }, []);

  const handleQuitInterview = () => {
    setIsQuitModalOpen(true);
  };

  const handleConfirmQuit = () => {
    router.replace("/ai-interview");
  };

  const [isoLoader, setIsoLoader] = useState<boolean>(false);

  const generateAudioQueue = async () => {
    const startIndex = currentQuestionIndex;
    const endIndex = Math.min(startIndex + 3, questions.length);

    for (let i = startIndex; i < endIndex; i++) {
      if (!audioQueue[i]) {
        try {
          const wav = await tts.predict({
            text: questions[i],
            voiceId: "en_US-hfc_male-medium",
          });
          const audioUrl = URL.createObjectURL(wav);
          setAudioQueue((prevQueue) => {
            const newQueue = [...prevQueue];
            newQueue[i] = audioUrl;
            return newQueue;
          });
        } catch (error) {
          console.error(`Error generating audio for question ${i}:`, error);
        }
      }
    }
  };

  const handleNextQuestion = () => {
    if (!audioBlob) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Please record your audio response or skip this question to proceed to the next one.",
      });
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      generateAudioQueue();
    } else {
      handleInterviewComplete();
    }
  };

  const handleSkipQuestion = () => {
    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: "Skipped",
      },
    });
    mediaRecorderRef.current?.stop();
    if (isPlayingAudio) setIsPlayingAudio(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      generateAudioQueue();
    } else {
      handleInterviewComplete();
    }
  };

  const handleInterviewComplete = async () => {
    setIsRecording(false);
    setIsInterviewComplete(true);
    if (audioBlob) {
      console.log("Interview complete, preparing to send audio blob");
      await generateReport(audioBlob);
    } else {
      console.error("No audio blob available at the end of the interview");
      setShowNoAudioAlert(true);
    }
  };

  const generateReport = async (audioBlob: Blob) => {
    try {
      console.log("Starting report generation process");
      const base64Audio = await blobToBase64(audioBlob);
      console.log("Audio converted to base64, length:", base64Audio.length);

      setIsLoading(true);
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          questions,
          base64Audio,
          timeSpent: duration * 60 - timeLeft,
        }),
      });

      console.log("Request sent, status:", response.status);

      if (!response.ok) {
        throw new Error(`Failed to generate report: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Report data received:", data);
      setIsLoading(false);

      setReport(JSON.parse(data.report));

      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
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

  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsTypingComplete(false);
    if (currentAudioUrl) {
      audioRef.current = new Audio(currentAudioUrl);
      playAudio();
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
      };
    }
    // Clean up the audio when the component unmounts or question changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
      }
    };
  }, [currQuestion, currentAudioUrl, setIsPlayingAudio]);

  const playAudio = () => {
    if (audioRef.current && !isPlayingAudio) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.error("Audio playback failed:", err);
          setIsPlayingAudio(false);
        });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };
  const handleNextQuestions = async () => {
    setIsNextLoading(true);
    setIsoLoader(true);
    stopAudio();
    await handleNextQuestion();
    setIsoLoader(false);
    setIsNextLoading(false);
  };

  return (
    <Card className="max-w-4xl mx-auto bg-background shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center pb-4">
          <span>
            Comprehensive Interview - Question {currentQuestionIndex + 1}
          </span>
          <Button
            onClick={handleQuitInterview}
            variant="outline"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Quit Interview
          </Button>
        </CardTitle>
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
          Time: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </CardHeader>
      <CardContent>
        <VideoRecorder isInterviewComplete={isInterviewComplete} />
        {!isInterviewComplete && (
          <>
            <div className="mb-4 space-y-4">
              {!currentAudioUrl ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ) : (
                <p className="text-lg mb-2 min-h-[3rem]">
                  <TypeAnimation
                    key={`${currQuestion}-${currentAudioUrl}`}
                    sequence={[currQuestion, () => setIsTypingComplete(true)]}
                    wrapper="p"
                    cursor={true}
                    speed={50}
                  />
                </p>
              )}

              <div className="flex items-center space-x-4">
                {currentAudioUrl && (
                  <Button
                    onClick={playAudio}
                    variant="outline"
                    size="sm"
                    disabled={isPlayingAudio}
                  >
                    {isPlayingAudio ? (
                      <AudioLines className="w-4 h-4" />
                    ) : (
                      <Volume2 className="h-4 w-4" />
                    )}
                    <span className="ml-2">
                      {isPlayingAudio ? "Playing..." : "Play Audio"}
                    </span>
                  </Button>
                )}
                {isTypingComplete && (
                  <Button
                    variant={"link"}
                    size={"sm"}
                    className="flex items-center justify-center text-blue-500  hover:underline text-lg"
                    onClick={handleSkipQuestion}
                  >
                    Skip Question <RedoDot className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
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
              <Button
                onClick={handleNextQuestions}
                disabled={isNextLoading}
                variant="default"
                className={`flex items-center justify-center  ${
                  isNextLoading ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isNextLoading && <Loader2 className="animate-spin mr-1" />}
                Next Question <CircleArrowRight className="w-4 h-4" />
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
