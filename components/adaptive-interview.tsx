"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkipForward, StopCircle, Mic, Send } from "lucide-react";
import { VoiceAnimation } from "@/components/voice-animation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import ReactMarkdown from "react-markdown";
import { useToast } from "@/hooks/use-toast";
import { createModel, Model, KaldiRecognizer } from "vosk-browser";

interface InterviewData {
  job: string;
  position: string;
  companyName: string;
  jd: string;
}

interface RecognizerMessage {
  result?: { text: string };
  partial?: string;
}

export default function AdaptiveInterview({
  formData,
}: {
  formData: InterviewData;
}) {
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [recognizedText, setRecognizedText] = useState("");
  const [history, setHistory] = useState<{ role: string; content: string }[]>([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [recognizer, setRecognizer] = useState<KaldiRecognizer | null>(null);
  const [model, setModel] = useState<Model | null>(null);
  const { toast } = useToast();

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    async function loadVosk() {
      try {
        const loadedModel = await createModel("/models/vosk-model-small-en-us-0.15");
        setModel(loadedModel);
        const loadedRecognizer = new loadedModel.KaldiRecognizer(16000);
        setRecognizer(loadedRecognizer);

        //@ts-ignore
        loadedRecognizer.on("result", (message: RecognizerMessage) => {
          if (message.result) {
            const result = message.result.text;
            if (result) {
              setRecognizedText((prev) => prev + " " + result);
              setUserAnswer((prev) => prev + " " + result);
            }
          }
        });

        //@ts-ignore
        loadedRecognizer.on("partialresult", (message: RecognizerMessage) => {
          if (message.partial) {
            setRecognizedText((prev) => prev + " " + message.partial);
          }
        });
      } catch (error) {
        console.error("Error loading Vosk model:", error);
      }
    }
    loadVosk();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (processorRef.current) {
        processorRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length) {
        setVoices(availableVoices);
      }
    };

    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices;

    return () => {
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!currentQuestion && !isInterviewComplete) {
      fetchNextQuestion();
    }
  }, [currentQuestion, isInterviewComplete]);

  useEffect(() => {
    if (currentQuestion && !isAISpeaking) {
      speakQuestion(currentQuestion);
    }
  }, [currentQuestion]);

  const fetchNextQuestion = async () => {
    try {
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
        setHistory((prevHistory) => [
          ...prevHistory,
          { role: "assistant", content: question },
        ]);
      }
    } catch (error) {
      console.error("Error fetching question:", error);
    }
  };

  const speakQuestion = (text: string) => {
    if ("speechSynthesis" in window) {
      if (isAISpeaking) {
        window.speechSynthesis.cancel();
      }
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current);
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      const preferredVoice =
        voices.find(
          (voice) =>
            voice.name.includes("Google") && voice.lang.startsWith("en")
        ) || voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      utterance.rate = 1;
      utterance.pitch = 1;

      setIsAISpeaking(true);
      setShowButtons(false);

      utterance.onstart = () => {
        console.log("AI is speaking");
      };

      utterance.onend = () => {
        setIsAISpeaking(false);
        setShowButtons(true);
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }
      };

      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event.error);
        setIsAISpeaking(false);
        setShowButtons(true);
        if (speakingTimeoutRef.current) {
          clearTimeout(speakingTimeoutRef.current);
        }
      };

      window.speechSynthesis.speak(utterance);

      speakingTimeoutRef.current = setTimeout(() => {
        if (isAISpeaking) {
          setIsAISpeaking(false);
          setShowButtons(true);
        }
      }, text.length * 50 + 3000);
    } else {
      console.error("Speech synthesis not supported");
      setIsAISpeaking(false);
      setShowButtons(true);
    }
  };

  const startRecording = async () => {
    if (!recognizer || !model) {
      console.error("Vosk model or recognizer not initialized");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      await audioContextRef.current.audioWorklet.addModule("/audio-processor.js");
      processorRef.current = new AudioWorkletNode(audioContextRef.current, "audio-processor");

      source.connect(processorRef.current);
      processorRef.current.connect(audioContextRef.current.destination);

      processorRef.current.port.onmessage = (event) => {
        const { audioData } = event.data;
        if (recognizer && audioData) {
          recognizer.acceptWaveform(audioData);
        }
      };

      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  const stopRecording = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
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
    setShowButtons(false);
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
    setShowButtons(false);
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
          <ReactMarkdown className="text-lg mb-4 text-foreground">
            {currentQuestion}
          </ReactMarkdown>
        </ScrollArea>
        {isAISpeaking ? (
          <div className="flex flex-col items-center justify-center h-32">
            <VoiceAnimation />
            <p className="mt-2 text-sm text-muted-foreground">
              AI is speaking...
            </p>
          </div>
        ) : (
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
            {recognizedText && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Recognized Text:</p>
                <Textarea
                  value={recognizedText}
                  onChange={(e) => {
                    setRecognizedText(e.target.value);
                    setUserAnswer(e.target.value);
                  }}
                  className="w-full h-32 p-2 text-muted-foreground bg-muted rounded-md"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}