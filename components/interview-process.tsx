// "use client";

// import { useState, useEffect, useRef } from "react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { SkipForward, StopCircle, Mic, Send } from "lucide-react";
// import { VoiceAnimation } from "@/components/voice-animation";
// import { useDispatch } from "react-redux";

// declare global {
//   interface Window {
//     SpeechRecognition: any;
//     webkitSpeechRecognition: any;
//   }
// }

// interface InterviewProcessProps {
//   questions: string[];
//   formData: any;
// }

// export function InterviewProcess({
//   questions,
//   formData,
// }: InterviewProcessProps) {
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [isAISpeaking, setIsAISpeaking] = useState(false);
//   const [userAnswer, setUserAnswer] = useState("");
//   const [timeLeft, setTimeLeft] = useState(formData.duration * 60);
//   const [isRecording, setIsRecording] = useState(false);
//   const [showButtons, setShowButtons] = useState(true);
//   const [recognizedText, setRecognizedText] = useState("");
//   const [allRecognizedText, setAllRecognizedText] = useState<string[]>([]);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const recognitionRef = useRef<any>(null);
//   const dispatch = useDispatch();
//   const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const getVoices = () => {
//       const availableVoices = speechSynthesis.getVoices();
//       if (availableVoices.length) {
//         setVoices(availableVoices);
//       }
//     };

//     getVoices();
//     speechSynthesis.onvoiceschanged = getVoices;
//   }, []);

//   useEffect(() => {
//     if (currentQuestionIndex < questions.length && !isAISpeaking) {
//       speakQuestion(questions[currentQuestionIndex]);
//     }
//   }, [currentQuestionIndex, questions]);

//   const speakQuestion = (text: string) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     const preferredVoice =
//       voices.find(
//         (voice) => voice.name.includes("Google") && voice.lang.startsWith("en")
//       ) || voices[0];

//     if (preferredVoice) {
//       utterance.voice = preferredVoice;
//     }
//     utterance.rate = 1;
//     utterance.pitch = 1;

//     setIsAISpeaking(true);
//     setShowButtons(false);

//     speechSynthesis.cancel();
//     speechSynthesis.speak(utterance);

//     utterance.onend = () => {
//       setIsAISpeaking(false);
//       setShowButtons(true);
//     };

//     utterance.onerror = (event) => {
//       console.error("Speech synthesis error:", event.error);
//       setIsAISpeaking(false);
//       setShowButtons(true);
//     };
//   };

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       mediaRecorderRef.current = new MediaRecorder(stream);
//       mediaRecorderRef.current.start();
//       setIsRecording(true);

//       // Initialize speech recognition
//       const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//       recognitionRef.current = new SpeechRecognition();
//       recognitionRef.current.continuous = true;
//       recognitionRef.current.interimResults = true;

//       recognitionRef.current.onresult = (event: any) => {
//         const transcript = Array.from(event.results)
//           .map((result: any) => result[0].transcript)
//           .join(" ");
//         setRecognizedText(transcript);
//       };

//       recognitionRef.current.start();

//       const chunks: Blob[] = [];
//       mediaRecorderRef.current.ondataavailable = (event) => {
//         chunks.push(event.data);
//       };

//       mediaRecorderRef.current.onstop = async () => {
//         const audioBlob = new Blob(chunks, { type: "audio/webm" });
//         const audioUrl = URL.createObjectURL(audioBlob);
//         await processAudio(audioUrl);
//       };
//     } catch (err) {
//       console.error("Error accessing microphone:", err);
//     }
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//       setIsRecording(false);
//     }
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//     setAllRecognizedText((prev) => [...prev, recognizedText]);
//     setUserAnswer(recognizedText);
//   };

//   const processAudio = async (audioUrl: string) => {
//     // This function can be used for any additional audio processing if needed
//     console.log("Audio processed:", audioUrl);
//   };

//   const submitAnswer = () => {
//     console.log("Submitting answer:", userAnswer);
//     dispatch({
//       type: "STORE_ANSWER",
//       payload: {
//         questionIndex: currentQuestionIndex,
//         answer: userAnswer,
//       },
//     });
//     setUserAnswer("");
//     setRecognizedText("");
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     setShowButtons(false);
//     setIsAISpeaking(false);
//   };

//   const skipQuestion = () => {
//     setUserAnswer("");
//     setRecognizedText("");
//     setIsRecording(false);
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop();
//     }
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//     }
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     setShowButtons(false);
//     setIsAISpeaking(false);
//   };

//   if (currentQuestionIndex >= questions.length) {
//     return <div>Interview completed! Generating report...</div>;
//   }

//   return (
//     <Card className="max-w-4xl mx-auto relative bg-card text-card-foreground">
//       <CardHeader className="relative">
//         <CardTitle className="text-2xl font-bold">
//           Question {currentQuestionIndex + 1}
//         </CardTitle>
//         <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
//           Time: {Math.floor(timeLeft / 60)}:
//           {(timeLeft % 60).toString().padStart(2, "0")}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <p className="text-lg mb-4 text-foreground">
//           {questions[currentQuestionIndex]}
//         </p>
//         {isAISpeaking ? (
//           <div className="flex flex-col items-center justify-center h-32">
//             <VoiceAnimation />
//             <p className="mt-2 text-sm text-muted-foreground">
//               AI is speaking...
//             </p>
//           </div>
//         ) : (
//           showButtons && (
//             <div className="space-y-4">
//               <div className="flex items-center justify-center space-x-4">
//                 {!isRecording ? (
//                   <Button
//                     onClick={startRecording}
//                     variant="secondary"
//                     className="bg-secondary text-secondary-foreground"
//                   >
//                     <Mic className="mr-2 h-4 w-4" />
//                     Start Recording
//                   </Button>
//                 ) : (
//                   <Button
//                     onClick={stopRecording}
//                     variant="destructive"
//                     className="bg-destructive text-destructive-foreground"
//                   >
//                     <StopCircle className="mr-2 h-4 w-4" />
//                     Stop Recording
//                   </Button>
//                 )}
//                 <Button
//                   onClick={submitAnswer}
//                   disabled={isRecording || !userAnswer}
//                   variant="default"
//                   className="bg-primary text-primary-foreground"
//                 >
//                   <Send className="mr-2 h-4 w-4" />
//                   Submit Answer
//                 </Button>
//                 <Button
//                   onClick={skipQuestion}
//                   variant="outline"
//                   className="bg-muted text-muted-foreground"
//                 >
//                   <SkipForward className="mr-2 h-4 w-4" />
//                   Skip Question
//                 </Button>
//               </div>
//               {recognizedText && (
//                 <div className="mt-4 p-4 bg-muted rounded-md">
//                   <p className="text-sm font-medium">Recognized Text:</p>
//                   <p className="text-muted-foreground">{recognizedText}</p>
//                 </div>
//               )}
//             </div>
//           )
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SkipForward, StopCircle, Mic, Send } from "lucide-react";
import { VoiceAnimation } from "@/components/voice-animation";

declare global { interface Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}} 

interface InterviewProcessProps {
  questions: string[];
  formData: any;
}

export function InterviewProcess({
  questions,
  formData,
}: InterviewProcessProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAISpeaking, setIsAISpeaking] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(formData.duration * 60);
  const [isRecording, setIsRecording] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  const [recognizedText, setRecognizedText] = useState("");
  const recognitionRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const getVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (availableVoices.length) {
        setVoices(availableVoices);
      }
    };

    getVoices();
    speechSynthesis.onvoiceschanged = getVoices;
  }, []);

  useEffect(() => {
    if (currentQuestionIndex < questions.length && !isAISpeaking) {
      speakQuestion(questions[currentQuestionIndex]);
    }
  }, [currentQuestionIndex, questions]);

  const speakQuestion = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
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

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);

    utterance.onend = () => {
      setIsAISpeaking(false);
      setShowButtons(true);
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
      setIsAISpeaking(false);
      setShowButtons(true);
    };
  };


  const startRecording = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      console.error("Speech Recognition API is not supported in this browser.");
      return;
    }

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    let finalTranscriptBuffer = userAnswer;

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      finalTranscriptBuffer += finalTranscript;
      setUserAnswer(`${finalTranscriptBuffer} ${interimTranscript}`);
      setRecognizedText(`${finalTranscriptBuffer} ${interimTranscript}`);
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const submitAnswer = () => {
    console.log("Submitting answer:", userAnswer);
    dispatch({
      type: "STORE_ANSWER",
      payload: {
        questionIndex: currentQuestionIndex,
        answer: userAnswer,
      },
    });
    setUserAnswer("");
    setRecognizedText("");
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowButtons(false);
    setIsAISpeaking(false);
  };

  const skipQuestion = () => {
    setUserAnswer("");
    setRecognizedText("");
    stopRecording();
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowButtons(false);
    setIsAISpeaking(false);
  };

  if (currentQuestionIndex >= questions.length) {
    return <div>Interview completed! Generating report...</div>;
  }

  return (
    <Card className="max-w-4xl mx-auto relative bg-card text-card-foreground">
      <CardHeader className="relative">
        <CardTitle className="text-2xl font-bold">
          Question {currentQuestionIndex + 1}
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
                  disabled={isRecording || !userAnswer}
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
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p className="text-sm font-medium">Recognized Text:</p>
                  <p className="text-muted-foreground">{recognizedText}</p>
                </div>
              )}
            </div>
          )
        )}
      </CardContent>
    </Card>
  );
}