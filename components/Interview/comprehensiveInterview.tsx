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
  ClipboardCheck,
  Loader2,
  LogOut,
  Pause,
  Play,
  RedoDot,
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
import fetchRetry from "fetch-retry";
import axios from "axios";
import { useAppSelector } from "@/hooks/hooks";
import { creditList } from "@/utils/credits";
import { updateCredits } from "@/slices/userAssets";

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
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isNextLoading, setIsNextLoading] = useState(false);
  const [isSkipLoading, setIsSkipLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuitting, setIsQuitting] = useState(false);
  const [shouldStartTyping, setShouldStartTyping] = useState(false);
  const [intervieweeSkippedQuestions, setIntervieweeSkippedQuestions] =
    useState<number[]>([]);
  const [recorded, setRecorded] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [currRetryNumber, setCurrRetryNumber] = useState(0);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const { toast } = useToast();
  const fetch = fetchRetry(window.fetch);

  const credits = useAppSelector((state) => state?.assets?.credits);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrl = audioQueue[currentQuestionIndex] || "";
  const currQuestion = questions[currentQuestionIndex] || "";

  // Timer effect
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

  // Initial audio generation
  useEffect(() => {
    generateFirstQuestionAudio();
  }, []);

  // Audio playback setup
  useEffect(() => {
    setIsTypingComplete(false);
    if (currentAudioUrl) {
      audioRef.current = new Audio(currentAudioUrl);
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
      }
    };
  }, [currentQuestionIndex, currentAudioUrl]);

  const generateFirstQuestionAudio = async () => {
    if (questions.length === 0 || audioQueue[0]) return;

    setIsGeneratingAudio(true);
    try {
      const wav = await tts.predict({
        text: questions[0],
        voiceId: "en_US-hfc_male-medium",
      });
      const audioUrl = URL.createObjectURL(wav);
      setAudioQueue((prev) => {
        const newQueue = [...prev];
        newQueue[0] = audioUrl;
        return newQueue;
      });
    } catch (error) {
      console.error("Error generating first question audio:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Failed to generate audio for the question. Please try refreshing.",
      });
    }
    setIsGeneratingAudio(false);
  };

  const generateNextQuestionAudio = async () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= questions.length || audioQueue[nextIndex]) return;

    setIsGeneratingAudio(true);
    try {
      const wav = await tts.predict({
        text: questions[nextIndex],
        voiceId: "en_US-hfc_male-medium",
      });
      const audioUrl = URL.createObjectURL(wav);
      setAudioQueue((prev) => {
        const newQueue = [...prev];
        newQueue[nextIndex] = audioUrl;
        return newQueue;
      });
    } catch (error) {
      console.error("Error generating next question audio:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate audio for the next question.",
      });
    }
    setIsGeneratingAudio(false);
  };

  const handleQuitInterview = () => {
    if (isProcessing) return;
    setIsQuitModalOpen(true);
  };

  const handleConfirmQuit = async () => {
    setIsQuitting(true);
    try {
      // Clean up any ongoing processes
      if (isRecording) {
        mediaRecorderRef.current?.stop();
      }
      if (isPlayingAudio) {
        stopAudio();
      }
      router.replace("/home/ai-interview");
    } catch (error) {
      console.error("Error during quit:", error);
      setIsQuitting(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to quit interview. Please try again.",
      });
    }
  };

  const handleNextQuestion = async () => {
    if (isProcessing || !recorded) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Please record your response or skip this question to proceed.",
      });
      return;
    }

    setIsNextLoading(true);
    setIsProcessing(true);

    try {
      if (currentQuestionIndex < questions.length - 1) {
        stopAudio();
        await generateNextQuestionAudio();
        setCurrentQuestionIndex((prev) => prev + 1);
        setRecorded(false);
        setIsTypingComplete(false);
        // setAudioBlob(null);
      } else {
        await handleInterviewComplete();
      }
    } catch (error) {
      console.error("Error proceeding to next question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to proceed to next question. Please try again.",
      });
    }

    setIsNextLoading(false);
    setIsProcessing(false);
  };

  const handleSkipQuestion = async () => {
    if (isProcessing) return;
    setIsSkipLoading(true);
    setIsProcessing(true);

    try {
      dispatch({
        type: "STORE_ANSWER",
        payload: {
          questionIndex: currentQuestionIndex,
          answer: "Skipped",
        },
      });

      const updatedSkippedQuestions = [
        ...intervieweeSkippedQuestions,
        currentQuestionIndex + 1,
      ];
      setIntervieweeSkippedQuestions(updatedSkippedQuestions);

      if (isRecording) {
        mediaRecorderRef.current?.stop();
      }
      if (isPlayingAudio) {
        stopAudio();
      }

      if (currentQuestionIndex < questions.length - 1) {
        await generateNextQuestionAudio();
        setCurrentQuestionIndex((prev) => prev + 1);
        setIsTypingComplete(false);
        // setAudioBlob(null);
      } else {
        await handleInterviewComplete(updatedSkippedQuestions);
      }
    } catch (error) {
      console.error("Error skipping question:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to skip question. Please try again.",
      });
    }

    setIsSkipLoading(false);
    setIsProcessing(false);
  };

  const handleInterviewComplete = async (finalSkippedQuestions?: number[]) => {
    if (isProcessing) return;

    setIsProcessing(true);
    setIsRecording(false);
    setIsInterviewComplete(true);

    try {
      // if (audioBlob) {
      //@ts-ignore
      await generateReport(audioBlob, finalSkippedQuestions);
      // } else {
      //   setShowNoAudioAlert(true);
      // }
    } catch (error) {
      console.error("Error completing interview:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete interview. Please try again.",
      });
    }

    setIsProcessing(false);
  };

  const generateReport = async (
    audioBlob: Blob,
    finalSkippedQuestions?: number[]
  ) => {
    setIsLoading(true);
    try {
      const base64Audio = await blobToBase64(audioBlob);
      console.log("base64", base64Audio);
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          history,
          questions,
          base64Audio,
          timeSpent: duration * 60 - timeLeft,
          intervieweeSkippedQuestions: finalSkippedQuestions,
        }),
        retryOn: (attempt, error, response) => {
          if (attempt >= 3) {
            setShowErrorMessage(true);
            setIsRetrying(false);
            return false;
          }
          setCurrRetryNumber(attempt + 1);
          if (response && response.status >= 400) {
            console.log(`retrying, attempt number ${attempt + 1}`);
            return true;
          }
          return false;
        },
      });

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: `Error ${response.statusText}`,
          description: "Failed to generate interview report. Please try again.",
        });
        return;
      }

      const data = await response.json();
      setReport(JSON.parse(data.report));

      if (data.success) {
        dispatch(
          updateCredits(credits - (creditList.get("comprehensive") ?? 0))
        );
      }

      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate interview report. Please try again.",
      });
    }
    setIsLoading(false);
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

  const playAudio = () => {
    if (!audioRef.current || isPlayingAudio || isProcessing) return;

    audioRef.current
      .play()
      .then(() => {
        setIsPlayingAudio(true);
        setShouldStartTyping(true); // Trigger typing animation when audio starts
      })
      .catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlayingAudio(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to play audio. Please try again.",
        });
      });
  };

  const stopAudio = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlayingAudio(false);
    setShouldStartTyping(false);
  };

  const toggleRecording = () => {
    if (isProcessing || isGeneratingAudio) return;
    setRecorded(true);
    setIsRecording(!isRecording);
  };

  // Add effect to auto-play audio when question changes
  useEffect(() => {
    if (currentAudioUrl && !isGeneratingAudio) {
      playAudio();
    }
  }, [currentQuestionIndex, currentAudioUrl, isGeneratingAudio]);

  return (
    <Card className="max-w-4xl mx-auto bg-background shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex justify-between items-center pb-4">
          <span>
            Comprehensive Interview - Question {currentQuestionIndex + 1}
          </span>
          {isInterviewComplete ? (
            <Button
              onClick={() => router.replace("/home/ai-interview")}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isQuitting || isProcessing}
            >
              <LogOut className="h-4 w-4" />
              Get back
            </Button>
          ) : (
            <Button
              onClick={handleQuitInterview}
              variant="outline"
              className="flex items-center gap-2"
              disabled={isQuitting || isProcessing}
            >
              {isQuitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogOut className="h-4 w-4" />
              )}
              Quit Interview
            </Button>
          )}
        </CardTitle>
        <div
          className="px-4 py-2 rounded-full text-sm font-medium mt-4 shadow-md"
          style={{
            backgroundColor:
              timeLeft > (duration * 60) / 2
                ? "white"
                : `rgb(
                    ${127 +
                Math.floor(
                  (255 - 127) * (timeLeft / ((duration * 60) / 2))
                )
                },
                    ${29 +
                Math.floor(
                  (255 - 29) * (timeLeft / ((duration * 60) / 2))
                )
                },
                    ${29 +
                Math.floor(
                  (255 - 29) * (timeLeft / ((duration * 60) / 2))
                )
                }
                  )`,
            color: timeLeft < duration * 60 * 0.18 ? "white" : "black",
          }}
        >
          Time: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
          {String(timeLeft % 60).padStart(2, "0")}
        </div>
      </CardHeader>
      <CardContent>
        <VideoRecorder isInterviewComplete={isInterviewComplete} />
        {!isInterviewComplete && (
          <>
            <div className="mb-4 space-y-4">
              {!currentAudioUrl || isGeneratingAudio ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[75%]" />
                </div>
              ) : (
                <p className="text-lg mb-2 min-h-[3rem]">
                  <TypeAnimation
                    key={`${currentQuestionIndex}-${shouldStartTyping}`}
                    sequence={[
                      shouldStartTyping ? currQuestion : "",
                      () => setIsTypingComplete(true),
                    ]}
                    wrapper="p"
                    cursor={true}
                    speed={50}
                  />
                </p>
              )}

              <div className="flex items-center space-x-4">
                {currentAudioUrl && (
                  <Button
                    onClick={isPlayingAudio ? stopAudio : playAudio}
                    variant="outline"
                    size="sm"
                    disabled={isProcessing || isGeneratingAudio}
                  >
                    {isPlayingAudio ? (
                      <AudioLines className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                    <span className="ml-2">
                      {isPlayingAudio ? "Stop" : "Play Audio"}
                    </span>
                  </Button>
                )}
                {isTypingComplete && (
                  <Button
                    variant="link"
                    size="sm"
                    className="flex items-center justify-center text-blue-500 hover:underline text-lg"
                    onClick={handleSkipQuestion}
                    disabled={
                      isSkipLoading || isProcessing || isGeneratingAudio
                    }
                  >
                    {isSkipLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <RedoDot className="w-4 h-4 mr-2" />
                    )}
                    Skip Question
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
                onClick={toggleRecording}
                variant={isRecording ? "destructive" : "default"}
                className="flex items-center"
                disabled={isProcessing || isGeneratingAudio}
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
                onClick={handleNextQuestion}
                disabled={
                  isNextLoading ||
                  isProcessing ||
                  isGeneratingAudio ||
                  !audioBlob
                }
                variant="default"
                className="flex items-center justify-center gap-2"
              >
                {isNextLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {currentQuestionIndex === questions.length - 1 ||
                  timeLeft === 0 ? (
                  <span className="flex gap-2 items-center">
                    Get report <ClipboardCheck className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="flex gap-2 items-center">
                    Next Question <CircleArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>
          </>
        )}
        {isLoading && !showErrorMessage && (
          <div className="w-full items-center text-center justify-center my-4">
            <div className="size-12 rounded-full border-t-2 border-primary ml-[calc(50%-24px)] border-b-2 animate-spin"></div>
            <div className="mt-2">
              Hold tight! Crafting your interview insights...
            </div>
          </div>
        )}
        {showReport && report && <InterviewResults data={report} />}
        {showErrorMessage && !report && (
          <div className="flex items-center space-x-4 mt-4 text-center w-full justify-center">
            <span className="text-red-500">
              Something went wrong. Please try again.
            </span>
            <Button
              onClick={async () => {
                setIsRetrying(true);
                await generateReport(audioBlob!, intervieweeSkippedQuestions);
              }}
              disabled={isRetrying}
              variant="outline"
              size="sm"
            >
              {isRetrying ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <div>Retrying......{currRetryNumber}</div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <RedoDot className="mr-2 h-4 w-4" />
                  <div>Retry</div>
                </div>
              )}
            </Button>
          </div>
        )}
        <ConfirmQuitModal
          isOpen={isQuitModalOpen}
          onClose={() => setIsQuitModalOpen(false)}
          onConfirm={handleConfirmQuit}
        />
        <NoAudioAlert
          isOpen={showNoAudioAlert}
          onClose={() => setShowNoAudioAlert(false)}
        />
      </CardContent>
    </Card>
  );
}

// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import VideoRecorder from "./videoRecorder";
// import AudioRecorder from "./audioRecorder";
// import {
//   AudioLines,
//   CircleArrowRight,
//   ClipboardCheck,
//   Loader2,
//   LogOut,
//   Pause,
//   Play,
//   RedoDot,
//   Volume2,
// } from "lucide-react";
// import InterviewResults from "./interviewResults";
// import AudioVisualization from "./audioVisualization";
// import { NoAudioAlert } from "./NoAudioAlert";
// import { useRouter } from "next/navigation";
// import { ConfirmQuitModal } from "./ConfirmQuiteModal";
// import { TypeAnimation } from "react-type-animation";
// import { Skeleton } from "../ui/skeleton";
// import { useToast } from "@/hooks/use-toast";
// import fetchRetry from "fetch-retry";
// import { SpeechService } from "@/lib/client/SpeechService";
// import { useAppSelector } from "@/hooks/hooks";
// import { creditList } from "@/utils/credits";
// import { updateCredits } from "@/slices/userAssets";

// interface ComprehensiveInterviewProps {
//   questions: string[];
//   duration: number;
// }

// export default function ComprehensiveInterview({
//   questions = [],
//   duration = 5,
// }: ComprehensiveInterviewProps) {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [showNoAudioAlert, setShowNoAudioAlert] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(duration * 60);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
//   const [showReport, setShowReport] = useState(false);
//   const [report, setReport] = useState(null);
//   const [isInterviewComplete, setIsInterviewComplete] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
//   const [isTypingComplete, setIsTypingComplete] = useState(false);
//   const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
//   const [isPlayingAudio, setIsPlayingAudio] = useState(false);
//   const [isNextLoading, setIsNextLoading] = useState(false);
//   const [isSkipLoading, setIsSkipLoading] = useState(false);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isQuitting, setIsQuitting] = useState(false);
//   const [shouldStartTyping, setShouldStartTyping] = useState(false);
//   const [intervieweeSkippedQuestions, setIntervieweeSkippedQuestions] =
//     useState<number[]>([]);
//   const [recorded, setRecorded] = useState(false);
//   const [isRetrying, setIsRetrying] = useState(false);
//   const [currRetryNumber, setCurrRetryNumber] = useState(0);
//   const [showErrorMessage, setShowErrorMessage] = useState(false);

//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { toast } = useToast();
//   const fetch = fetchRetry(window.fetch);
//   const credits = useAppSelector((state) => state?.assets?.credits);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const speechServiceRef = useRef<SpeechService | null>(null);
//   const [isVoiceReady, setIsVoiceReady] = useState(false);

//   useEffect(() => {
//     const initializeSpeechService = async () => {
//       speechServiceRef.current = new SpeechService(
//         setIsPlayingAudio,
//         setIsGeneratingAudio,
//         () => setIsVoiceReady(true)
//       );
//       await speechServiceRef.current.initialize();
//     };

//     initializeSpeechService();

//     return () => {
//       speechServiceRef.current?.cancel();
//     };
//   }, []);

//   useEffect(() => {
//     if (!isInterviewComplete && speechServiceRef.current && isVoiceReady) {
//       speechServiceRef.current.speak(questions[currentQuestionIndex]);
//     }
//   }, [currentQuestionIndex, isInterviewComplete, questions, isVoiceReady]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => {
//         if (prevTime <= 1 || isInterviewComplete) {
//           clearInterval(timer);
//           if (!isInterviewComplete) {
//             handleInterviewComplete();
//           }
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [isInterviewComplete]);

//   const handleQuitInterview = () => {
//     if (isProcessing) return;
//     setIsQuitModalOpen(true);
//   };

//   const handleConfirmQuit = async () => {
//     setIsQuitting(true);
//     try {
//       if (isRecording) {
//         mediaRecorderRef.current?.stop();
//       }
//       await speechServiceRef.current?.stop();
//       router.replace("/home/ai-interview");
//     } catch (error) {
//       console.error("Error during quit:", error);
//       setIsQuitting(false);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to quit interview. Please try again.",
//       });
//     }
//   };

//   const handleNextQuestion = async () => {
//     if (isProcessing || !recorded) {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description:
//           "Please record your response or skip this question to proceed.",
//       });
//       return;
//     }

//     setIsNextLoading(true);
//     setIsProcessing(true);

//     try {
//       if (currentQuestionIndex < questions.length - 1) {
//         speechServiceRef.current?.stop();
//         setCurrentQuestionIndex((prev) => prev + 1);
//         setRecorded(false);
//         setIsTypingComplete(false);
//       } else {
//         await handleInterviewComplete();
//       }
//     } catch (error) {
//       console.error("Error proceeding to next question:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to proceed to next question. Please try again.",
//       });
//     }

//     setIsNextLoading(false);
//     setIsProcessing(false);
//   };

//   const handleSkipQuestion = async () => {
//     if (isProcessing) return;
//     setIsSkipLoading(true);
//     setIsProcessing(true);

//     try {
//       dispatch({
//         type: "STORE_ANSWER",
//         payload: {
//           questionIndex: currentQuestionIndex,
//           answer: "Skipped",
//         },
//       });

//       const updatedSkippedQuestions = [
//         ...intervieweeSkippedQuestions,
//         currentQuestionIndex + 1,
//       ];
//       setIntervieweeSkippedQuestions(updatedSkippedQuestions);

//       if (isRecording) {
//         mediaRecorderRef.current?.stop();
//       }
//       speechServiceRef.current?.stop();

//       if (currentQuestionIndex < questions.length - 1) {
//         setCurrentQuestionIndex((prev) => prev + 1);
//         setIsTypingComplete(false);
//       } else {
//         await handleInterviewComplete(updatedSkippedQuestions);
//       }
//     } catch (error) {
//       console.error("Error skipping question:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to skip question. Please try again.",
//       });
//     }

//     setIsSkipLoading(false);
//     setIsProcessing(false);
//   };

//   const handleInterviewComplete = async (finalSkippedQuestions?: number[]) => {
//     if (isProcessing) return;

//     setIsProcessing(true);
//     setIsRecording(false);
//     setIsInterviewComplete(true);

//     try {
//       if (audioBlob) {
//         await generateReport(audioBlob, finalSkippedQuestions);
//       }
//     } catch (error) {
//       console.error("Error completing interview:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to complete interview. Please try again.",
//       });
//     }

//     setIsProcessing(false);
//   };

//   const generateReport = async (
//     audioBlob: Blob,
//     finalSkippedQuestions?: number[]
//   ) => {
//     setIsLoading(true);
//     try {
//       const base64Audio = await blobToBase64(audioBlob);
//       const response = await fetch("/api/generate-report", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           questions,
//           base64Audio,
//           timeSpent: duration * 60 - timeLeft,
//           intervieweeSkippedQuestions: finalSkippedQuestions,
//         }),
//         retryOn: (attempt, error, response) => {
//           if (attempt >= 3) {
//             setShowErrorMessage(true);
//             setIsRetrying(false);
//             return false;
//           }
//           setCurrRetryNumber(attempt + 1);
//           if (response && response.status >= 400) {
//             return true;
//           }
//           return false;
//         },
//       });

//       if (!response.ok) {
//         toast({
//           variant: "destructive",
//           title: `Error ${response.statusText}`,
//           description: "Failed to generate interview report. Please try again.",
//         });
//         return;
//       }

//       const data = await response.json();
//       setReport(JSON.parse(data.report));

//       if (data.success) {
//         dispatch(
//           updateCredits(credits - (creditList.get("comprehensive") ?? 0))
//         );
//       }

//       setShowReport(true);
//     } catch (error) {
//       console.error("Error generating report:", error);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to generate interview report. Please try again.",
//       });
//     }
//     setIsLoading(false);
//   };

//   const blobToBase64 = (blob: Blob): Promise<string> => {
//     return new Promise((resolve, reject) => {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         if (typeof reader.result === "string") {
//           resolve(reader.result.split(",")[1]);
//         } else {
//           reject(new Error("Failed to convert blob to base64"));
//         }
//       };
//       reader.onerror = reject;
//       reader.readAsDataURL(blob);
//     });
//   };

//   const toggleRecording = () => {
//     if (isProcessing || isGeneratingAudio) return;
//     setRecorded(true);
//     setIsRecording(!isRecording);
//   };

//   return (
//     <Card className="max-w-4xl mx-auto bg-background shadow-lg">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold flex justify-between items-center pb-4">
//           <span>
//             Comprehensive Interview - Question {currentQuestionIndex + 1}
//           </span>
//           {isInterviewComplete ? (
//             <Button
//               onClick={() => router.replace("/home/ai-interview")}
//               variant="outline"
//               className="flex items-center gap-2"
//               disabled={isQuitting || isProcessing}
//             >
//               <LogOut className="h-4 w-4" />
//               Get back
//             </Button>
//           ) : (
//             <Button
//               onClick={handleQuitInterview}
//               variant="outline"
//               className="flex items-center gap-2"
//               disabled={isQuitting || isProcessing}
//             >
//               {isQuitting ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <LogOut className="h-4 w-4" />
//               )}
//               Quit Interview
//             </Button>
//           )}
//         </CardTitle>
//         <div
//           className="px-4 py-2 rounded-full text-sm font-medium mt-4 shadow-md"
//           style={{
//             backgroundColor:
//               timeLeft > (duration * 60) / 2
//                 ? "white"
//                 : `rgb(
//                     ${
//                       127 +
//                       Math.floor(
//                         (255 - 127) * (timeLeft / ((duration * 60) / 2))
//                       )
//                     },
//                     ${
//                       29 +
//                       Math.floor(
//                         (255 - 29) * (timeLeft / ((duration * 60) / 2))
//                       )
//                     },
//                     ${
//                       29 +
//                       Math.floor(
//                         (255 - 29) * (timeLeft / ((duration * 60) / 2))
//                       )
//                     }
//                   )`,
//             color: timeLeft < duration * 60 * 0.18 ? "white" : "black",
//           }}
//         >
//           Time: {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
//           {String(timeLeft % 60).padStart(2, "0")}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <VideoRecorder isInterviewComplete={isInterviewComplete} />
//         {!isInterviewComplete && (
//           <>
//             <div className="mb-4 space-y-4">
//               {isGeneratingAudio ? (
//                 <div className="space-y-2">
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-[75%]" />
//                 </div>
//               ) : (
//                 <p className="text-lg mb-2 min-h-[3rem]">
//                   <TypeAnimation
//                     key={`${currentQuestionIndex}-${shouldStartTyping}`}
//                     sequence={[
//                       questions[currentQuestionIndex],
//                       () => setIsTypingComplete(true),
//                     ]}
//                     wrapper="p"
//                     cursor={true}
//                     speed={50}
//                   />
//                 </p>
//               )}

//               <div className="flex items-center space-x-4">
//                 <Button
//                   onClick={() => {
//                     if (isPlayingAudio) {
//                       speechServiceRef.current?.stop();
//                     } else {
//                       speechServiceRef.current?.speak(
//                         questions[currentQuestionIndex]
//                       );
//                     }
//                   }}
//                   variant="outline"
//                   size="sm"
//                   disabled={isProcessing || isGeneratingAudio}
//                 >
//                   {isPlayingAudio ? (
//                     <AudioLines className="w-4 h-4" />
//                   ) : (
//                     <Volume2 className="w-4 h-4" />
//                   )}
//                   <span className="ml-2">
//                     {isPlayingAudio ? "Stop" : "Play Audio"}
//                   </span>
//                 </Button>
//                 {isTypingComplete && (
//                   <Button
//                     variant="link"
//                     size="sm"
//                     className="flex items-center justify-center text-blue-500 hover:underline text-lg"
//                     onClick={handleSkipQuestion}
//                     disabled={isSkipLoading || isProcessing}
//                   >
//                     {isSkipLoading ? (
//                       <Loader2 className="w-4 h-4 animate-spin mr-2" />
//                     ) : (
//                       <RedoDot className="w-4 h-4 mr-2" />
//                     )}
//                     Skip Question
//                   </Button>
//                 )}
//               </div>
//             </div>
//             <AudioRecorder
//               isRecording={isRecording}
//               setIsRecording={setIsRecording}
//               setAudioBlob={setAudioBlob}
//               mediaRecorderRef={mediaRecorderRef}
//             />
//             <AudioVisualization isRecording={isRecording} />
//             <div className="flex justify-between mt-4">
//               <Button
//                 onClick={toggleRecording}
//                 variant={isRecording ? "destructive" : "default"}
//                 className="flex items-center"
//                 disabled={isProcessing}
//               >
//                 {isRecording ? (
//                   <>
//                     <Pause className="mr-2 h-4 w-4" />
//                     Pause Recording
//                   </>
//                 ) : (
//                   <>
//                     <Play className="mr-2 h-4 w-4" />
//                     {currentQuestionIndex === 0 ? (
//                       <span>Start Recording</span>
//                     ) : (
//                       <span>Resume Recording</span>
//                     )}
//                   </>
//                 )}
//               </Button>
//               <Button
//                 onClick={handleNextQuestion}
//                 disabled={
//                   isNextLoading ||
//                   isProcessing ||
//                   isGeneratingAudio ||
//                   !audioBlob
//                 }
//                 variant="default"
//                 className="flex items-center justify-center gap-2"
//               >
//                 {isNextLoading && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {currentQuestionIndex === questions.length - 1 ||
//                 timeLeft === 0 ? (
//                   <span className="flex gap-2 items-center">
//                     Get report <ClipboardCheck className="w-4 h-4" />
//                   </span>
//                 ) : (
//                   <span className="flex gap-2 items-center">
//                     Next Question <CircleArrowRight className="w-4 h-4" />
//                   </span>
//                 )}
//               </Button>
//             </div>
//           </>
//         )}
//         {isLoading && !showErrorMessage && (
//           <div className="w-full items-center text-center justify-center my-4">
//             <div className="size-12 rounded-full border-t-2 border-primary ml-[calc(50%-24px)] border-b-2 animate-spin"></div>
//             <div className="mt-2">
//               Hold tight! Crafting your interview insights...
//             </div>
//           </div>
//         )}
//         {showReport && report && <InterviewResults data={report} />}
//         {showErrorMessage && !report && (
//           <div className="flex items-center space-x-4 mt-4 text-center w-full justify-center">
//             <span className="text-red-500">
//               Something went wrong. Please try again.
//             </span>
//             <Button
//               onClick={async () => {
//                 setIsRetrying(true);
//                 await generateReport(audioBlob!, intervieweeSkippedQuestions);
//               }}
//               disabled={isRetrying}
//               variant="outline"
//               size="sm"
//             >
//               {isRetrying ? (
//                 <div className="flex items-center space-x-2">
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   <div>Retrying......{currRetryNumber}</div>
//                 </div>
//               ) : (
//                 <div className="flex items-center space-x-2">
//                   <RedoDot className="mr-2 h-4 w-4" />
//                   <div>Retry</div>
//                 </div>
//               )}
//             </Button>
//           </div>
//         )}
//         <ConfirmQuitModal
//           isOpen={isQuitModalOpen}
//           onClose={() => setIsQuitModalOpen(false)}
//           onConfirm={handleConfirmQuit}
//         />
//         <NoAudioAlert
//           isOpen={showNoAudioAlert}
//           onClose={() => setShowNoAudioAlert(false)}
//         />
//       </CardContent>
//     </Card>
//   );
// }
