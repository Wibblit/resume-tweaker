"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkipForward, StopCircle, Mic, Send } from "lucide-react";
import { VoiceAnimation } from "@/components/voice-animation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { createModel, KaldiRecognizer, Model } from "vosk-browser";
import * as tts from "@diffusionstudio/vits-web";
import MicrophoneStream from "microphone-stream";

interface InterviewData {
  job: string;
  position: string;
  companyName: string;
  jd: string;
}

export default function AdaptiveInterview({
  formData,
}: {
  formData: InterviewData;
  model: Model;
  setModel: React.Dispatch<React.SetStateAction<Model | null>>;
}) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>(
    []
  );
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [model, setModel] = useState<Model | null>(null);
  const recognizerRef = useRef<KaldiRecognizer | null>(null);
  const micStreamRef = useRef<any>(null);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const [fetchingQuetion, setFetchingQuestion] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentQuestion && !isInterviewComplete) {
      fetchNextQuestion();
    }
  }, [currentQuestion, isInterviewComplete]);

  useEffect(() => {
    if (currentQuestion && !isAISpeaking && isAudioLoaded) {
      speakQuestion(currentQuestion);
    }
  }, [currentQuestion, isAudioLoaded]);

  const fetchNextQuestion = async () => {
    try {
      setFetchingQuestion(true);
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData,
          history,
        }),
      });

      if (response.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      const question = data.question;

      if (question.toLowerCase().includes("interview complete")) {
        setIsInterviewComplete(true);
      } else {
        setCurrentQuestion(question);
        setFetchingQuestion(false);

        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "assistant", content: question },
        ]);
        speakQuestion(question)
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };


  const speakQuestion = async (text: string) => {
    if (isAISpeaking) {
      return;
    }

    setIsAISpeaking(true);

    try { 

      const wav = await tts.predict({
        text,
        voiceId: "en_US-hfc_female-medium",
      });

      const audio = new Audio(URL.createObjectURL(wav));
      console.log("Created audio URL");

      audio.onended = () => {
        setIsAISpeaking(false);
        URL.revokeObjectURL(audio.src);
      };

      audio.onerror = (event) => {
        console.error("Audio playback error:", event);
        setIsAISpeaking(false);
        URL.revokeObjectURL(audio.src);
      };

      await audio.play();
    } catch (error) {
      console.error("Speech synthesis error:", error);
      setIsAISpeaking(false);
    }
  };

  const startRecording = async () => {
    if (!model) {
      console.error("Vosk model not loaded");
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      micStreamRef.current = new MicrophoneStream({
        objectMode: true,
        bufferSize: 1024,
      });
      micStreamRef.current.setStream(mediaStream);

      const recognizer = new model.KaldiRecognizer(48000);
      recognizer.setWords(true);

      recognizer.on("result", (message: any) => {
        const result = message.result;
        setRecognizedText((prev) => prev + " " + result.text);
        setUserAnswer((prev) => prev + " " + result.text);
      });

      recognizerRef.current = recognizer;

      micStreamRef.current.on("data", (chunk: any) => {
        recognizer.acceptWaveform(chunk);
      });

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description:
          "Failed to start recording. Please check your microphone and try again.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (micStreamRef.current) {
      micStreamRef.current.stop();
      micStreamRef.current = null;
    }
    if (recognizerRef.current) {
      recognizerRef.current.remove();
      recognizerRef.current = null;
    }
    setIsRecording(false);
  };

  const submitAnswer = async () => {
    if (recognizedText.trim() === "") {
      console.error("Cannot submit empty answer");
      return;
    }

    const newHistory = [...history, { role: "user", content: recognizedText }];
    setHistory(newHistory);

    setUserAnswer("");
    setRecognizedText("");
    setCurrentQuestion("");
    setIsAISpeaking(false);

    await fetchNextQuestion();
  };

  const skipQuestion = async () => {
    const newHistory = [...history, { role: "user", content: "Skipped" }];
    setHistory(newHistory);
    setUserAnswer("");
    setRecognizedText("");
    stopRecording();
    setCurrentQuestion("");
    setIsAISpeaking(false);

    await fetchNextQuestion();
  };

  if (isInterviewComplete) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-bold mb-4">Interview completed!</h2>
        <p>Thank you for participating in the adaptive interview.</p>
      </div>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto relative bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Adaptive Interview</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] mb-4">
          {fetchingQuetion ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ReactMarkdown className="text-lg mb-4 text-foreground">
              {currentQuestion}
            </ReactMarkdown>
          )}
        </ScrollArea>
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
              setRecognizedText(e.target.value);
              setUserAnswer(e.target.value);
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
              disabled={isRecording || !recognizedText.trim()}
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
  );
}
