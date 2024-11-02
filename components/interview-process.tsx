"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkipForward, StopCircle, Mic, Send, Download } from "lucide-react";
import { VoiceAnimation } from "@/components/voice-animation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface InterviewProcessProps {
  questions: string[];
  duration: number;
}

interface HistoryItem {
  question: string;
  answer: string;
}

interface ReportData {
  evaluation: {
    category: string;
    score: number;
    comment: string;
  }[];
  overall_score: number;
  final_recommendation: string;
  overall_comment: string;
}

export default function ComprehensiveInterview({
  questions,
  duration,
}: InterviewProcessProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(duration * 60);
  const [isRecording, setIsRecording] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [recognizedText, setRecognizedText] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const recognitionRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const lastRecognizedTextRef = useRef("");
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
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
    if (
      questions.length > 0 &&
      currentQuestionIndex < questions.length &&
      !isAISpeaking
    ) {
      speakQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  const speakQuestion = (text: string) => {
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
        (voice) => voice.name.includes("Google") && voice.lang.startsWith("en")
      ) || voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    utterance.rate = 1;
    utterance.pitch = 1;

    setIsAISpeaking(true);
    setShowButtons(false);

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
  };

  const startRecording = () => {
    window.SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!window.SpeechRecognition) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new window.SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const updatedTranscript = `${lastRecognizedTextRef.current}${finalTranscript}${interimTranscript}`;

      setUserAnswer(updatedTranscript);
      setRecognizedText(updatedTranscript);

      if (finalTranscript) {
        lastRecognizedTextRef.current = `${lastRecognizedTextRef.current}${finalTranscript}`;
      }
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      if (isRecording) {
        recognition.start();
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (isRecording) {
        recognition.start();
      }
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false);
      recognitionRef.current.stop();
    }
  };

  const submitAnswer = () => {
    const newHistoryItem: HistoryItem = {
      question: questions[currentQuestionIndex],
      answer: recognizedText,
    };
    setHistory((prevHistory) => [...prevHistory, newHistoryItem]);

    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: recognizedText,
      },
    });

    setUserAnswer("");
    setRecognizedText("");
    lastRecognizedTextRef.current = "";
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowButtons(false);
    setIsAISpeaking(false);

    if (currentQuestionIndex === questions.length - 1) {
      generateReport();
    }
  };

  const skipQuestion = () => {
    const newHistoryItem: HistoryItem = {
      question: questions[currentQuestionIndex],
      answer: "Skipped",
    };
    setHistory((prevHistory) => [...prevHistory, newHistoryItem]);

    setUserAnswer("");
    setRecognizedText("");
    lastRecognizedTextRef.current = "";
    stopRecording();
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowButtons(false);
    setIsAISpeaking(false);

    if (currentQuestionIndex === questions.length - 1) {
      generateReport();
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    try {
      const finalHistory = [
        ...history,
        {
          question: questions[currentQuestionIndex],
          answer: recognizedText || "Skipped",
        },
      ];

      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ history: finalHistory }),
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
        throw new Error("Failed to generate report");
      }

      const { report } = await response.json();
      const parsedResult = JSON.parse(report);
      console.log(parsedResult, "report ");
      setReport(parsedResult);
      setShowReport(true);
    } catch (error) {
      console.error("Error generating report:", error);
      setReport(null);
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const downloadReport = () => {
    if (!report) return;

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
`;

    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "interview-report.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
    );
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
                      setRecognizedText(e.target.value);
                      setUserAnswer(e.target.value);
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
  );
}
