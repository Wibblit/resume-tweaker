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

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { SkipForward, StopCircle, Mic, Send } from "lucide-react";
// import { VoiceAnimation } from "@/components/voice-animation";

// declare global { interface  Window  {
//     SpeechRecognition?: any;
//     webkitSpeechRecognition?: any;
//   }} 

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


//   const startRecording = () => {
//     if (
//       !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
//     ) {
//       console.error("Speech Recognition API is not supported in this browser.");
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.continuous = true;
//     recognitionRef.current = recognition;

//     let finalTranscriptBuffer = userAnswer;

//     recognition.onresult = (event: any) => {
//       let interimTranscript = "";
//       let finalTranscript = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const result = event.results[i];
//         if (result.isFinal) {
//           finalTranscript += result[0].transcript;
//         } else {
//           interimTranscript += result[0].transcript;
//         }
//       }

//       finalTranscriptBuffer += finalTranscript;
//       setUserAnswer(`${finalTranscriptBuffer} ${interimTranscript}`);
//       setRecognizedText(`${finalTranscriptBuffer} ${interimTranscript}`);
//     };

//     recognition.onstart = () => {
//       setIsRecording(true);
//     };

//     recognition.onend = () => {
//       setIsRecording(false);
//     };

//     recognition.start();
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//     }
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
//     stopRecording();
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

// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { SkipForward, StopCircle, Mic, Send } from "lucide-react";
// import { VoiceAnimation } from "@/components/voice-animation";

// declare global {
//   interface Window {
//     SpeechRecognition?: any;
//     webkitSpeechRecognition?: any;
//     opera?: any;
//   }
// }

// interface InterviewProcessProps {
//   questions: string[];
//   formData: any;
// }

// function mobileAndTabletCheck() {
//   let check = false;
//   (function (a) {
//     if (
//       /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
//         a
//       ) ||
//       /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| ||a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
//         a.substr(0, 4)
//       )
//     )
//       check = true;
//   })(navigator.userAgent || navigator.vendor || window.opera);
//   return check;
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
//   const recognitionRef = useRef<any>(null);
//   const dispatch = useDispatch();
//   const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
//   const lastRecognizedTextRef = useRef("");
//   const isMobileOrTabletRef = useRef(false);

//   useEffect(() => {
//     isMobileOrTabletRef.current = mobileAndTabletCheck();
//   }, []);

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

//   const startRecording = () => {
//     if (
//       !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
//     ) {
//       console.error("Speech Recognition API is not supported in this browser.");
//       return;
//     }

//     const SpeechRecognition =
//       window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recognition = new SpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = true;
//     recognition.continuous = true;
//     recognitionRef.current = recognition;

//     recognition.onresult = (event: any) => {
//       let interimTranscript = "";
//       let finalTranscript = "";

//       for (let i = event.resultIndex; i < event.results.length; ++i) {
//         if (event.results[i].isFinal && event.results[i][0].confidence !== 0) {
//           if (isMobileOrTabletRef.current) {
//             finalTranscript = event.results[i][0].transcript;
//           } else {
//             finalTranscript += event.results[i][0].transcript;
//           }
//         } else {
//           if (isMobileOrTabletRef.current) {
//             interimTranscript = event.results[i][0].transcript;
//           } else {
//             interimTranscript += event.results[i][0].transcript;
//           }
//         }
//       }

//       const updatedTranscript = isMobileOrTabletRef.current
//         ? `${lastRecognizedTextRef.current}${finalTranscript}`
//         : `${lastRecognizedTextRef.current}${finalTranscript}${interimTranscript}`;

//       setUserAnswer(updatedTranscript);
//       setRecognizedText(updatedTranscript);

//       if (finalTranscript) {
//         lastRecognizedTextRef.current = updatedTranscript;
//       }

//       if (finalTranscript && !isMobileOrTabletRef.current) {
//         recognition.stop();
//       }
//     };

//     recognition.onstart = () => {
//       setIsRecording(true);
//     };

//     recognition.onend = () => {
//       setIsRecording(false);
//       // Restart recognition if it stops unexpectedly
//       if (isRecording) {
//         recognition.start();
//       }
//     };

//     recognition.start();
//   };

//   const stopRecording = () => {
//     if (recognitionRef.current) {
//       recognitionRef.current.stop();
//       setIsRecording(false);
//     }
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
//     lastRecognizedTextRef.current = "";
//     setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
//     setShowButtons(false);
//     setIsAISpeaking(false);
//   };

//   const skipQuestion = () => {
//     setUserAnswer("");
//     setRecognizedText("");
//     lastRecognizedTextRef.current = "";
//     stopRecording();
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

declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
    opera?: any;
  }
}

interface InterviewProcessProps {
  questions: string[];
  formData: any;
}

function mobileAndTabletCheck() {
  let check = false;
  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| ||a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
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
  const lastRecognizedTextRef = useRef("");
  const isMobileOrTabletRef = useRef(false);

  useEffect(() => {
    isMobileOrTabletRef.current = mobileAndTabletCheck();
  }, []);

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

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal && event.results[i][0].confidence !== 0) {
          if (isMobileOrTabletRef.current) {
            finalTranscript = event.results[i][0].transcript;
          } else {
            finalTranscript += event.results[i][0].transcript;
          }
        } else {
          if (isMobileOrTabletRef.current) {
            interimTranscript = event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      }

      const updatedTranscript = isMobileOrTabletRef.current
        ? `${lastRecognizedTextRef.current}${finalTranscript}`
        : `${lastRecognizedTextRef.current}${finalTranscript}${interimTranscript}`;

      setUserAnswer(updatedTranscript);
      setRecognizedText(updatedTranscript);

      if (finalTranscript) {
        lastRecognizedTextRef.current = updatedTranscript;
      }
    };

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onend = () => {
      // Only stop recording if the user has explicitly stopped it
      if (isRecording) {
        recognition.start();
      } else {
        setIsRecording(false);
      }
    };

    recognition.start();
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      setIsRecording(false); // Set this before stopping to prevent auto-restart
      recognitionRef.current.stop();
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
    lastRecognizedTextRef.current = "";
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    setShowButtons(false);
    setIsAISpeaking(false);
  };

  const skipQuestion = () => {
    setUserAnswer("");
    setRecognizedText("");
    lastRecognizedTextRef.current = "";
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