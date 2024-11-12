"use client";

import { useEffect, useState } from "react";
import AdaptiveInterview from "@/components/adaptive-interview";
import ComprehensiveInterview from "@/components/interview-process";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import * as tts from "@diffusionstudio/vits-web";
import { createModel, Model } from "vosk-browser";

interface InterviewData {
  job: string;
  position: string;
  companyName: string;
  jd: string;
  numberOfQuestions: number;
  interviewType: string;
  duration: number;
}

export default function InterviewPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [comprehensiveQuestions, setComprehensiveQuestion] = useState<string[]>(
    []
  );
  const [model, setModel] = useState<Model | null>(null);
  const [interviewData, setInterviewData] = useState<InterviewData>({
    job: "",
    position: "",
    companyName: "",
    jd: "",
    numberOfQuestions: 0,
    interviewType: "",
    duration: 0,
  });

  //change this to true after uncommnent
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function interviewSetup() {
      try {
        const loadedModel = await createModel(
          "/models/vosk-model-small-en-us-0.15.tar.gz"
        );
  
        setModel(loadedModel);

        await tts.download("en_US-hfc_female-medium", (progress) => {
          console.log(
            `Downloading ${progress.url} - ${Math.round(
              (progress.loaded * 100) / progress.total
            )}%`
          );
        });

        setInterviewData({
          job: searchParams.get("job") || "",
          position: searchParams.get("position") || "",
          companyName: searchParams.get("companyName") || "",
          jd: searchParams.get("jd") || "",
          numberOfQuestions: parseInt(
            searchParams.get("numberOfQuestions") || "0",
            10
          ),
          interviewType: searchParams.get("interviewType") || "",
          duration: parseInt(searchParams.get("duration") || "0", 10),
        });
      } catch (error) {
        console.error("Error during interview setup:", error);
      }
    }

    interviewSetup();

    return () => {
      (async () => {
        try {
          await tts.flush();
          await model?.terminate();
          console.log("tts flushed");
        } catch (error) {
          console.error("Error flushing TTS resources:", error);
        }
      })();
    };
  }, [searchParams]);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (interviewData.interviewType !== "adaptive" && interviewData.job) {
        setIsLoading(true);
        try {
          const response = await fetch("/api/generate-questions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              job: interviewData.job,
              position: interviewData.position,
              companyName: interviewData.companyName,
              jd: interviewData.jd,
              numberOfQuestions: interviewData.numberOfQuestions,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch questions");
          }
          const data = await response.json();
          setComprehensiveQuestion(data.questions || []);
        } catch (error) {
          console.error("Error generating questions:", error);
          toast({
            title: "Error generating the questions",
            description: "Unable to join the interview. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [interviewData, toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        AI Interview
      </h1>
      {interviewData.interviewType === "adaptive" ? (
        <AdaptiveInterview formData={interviewData} />
      ) : model ? (
        <ComprehensiveInterview
          questions={comprehensiveQuestions}
          duration={interviewData.duration}
          model={model!}
          setModel={setModel}
        />
      ) : (
        <div>Loding...</div>
      )}
    </main>
  );
}
