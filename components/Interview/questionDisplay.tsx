"use client";

import React, { useState, useEffect } from "react";
import * as tts from "@diffusionstudio/vits-web";
import { Button } from "@/components/ui/button";
import { Loader2, Volume2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionDisplayProps {
  question: string;
  onNextQuestion: () => void;
}

export default function QuestionDisplay({
  question,
  onNextQuestion,
}: QuestionDisplayProps) {
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);

  useEffect(() => {
    setCharIndex(0);
    setDisplayedQuestion("");
    generateSpeech();
  }, [question]);

  useEffect(() => {
    if (charIndex < question?.length) {
      const timer = setTimeout(() => {
        setDisplayedQuestion((prev) => prev + question[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [charIndex, question]);

  const generateSpeech = async () => {
    setIsGeneratingAudio(true);
    try {
      const wav = await tts.predict({
        text: question,
        voiceId: "en_US-hfc_female-medium",
      });
      const audioUrl = URL.createObjectURL(wav);
      const audio = new Audio(audioUrl);
      setIsGeneratingAudio(false);
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
    } finally {
      setIsGeneratingAudio(false);
    }
  };


  return (
    <div className="mb-4 space-y-4">
      {isGeneratingAudio ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[75%]" />
        </div>
      ) : (
        <p className="text-lg mb-2">{displayedQuestion}</p>
      )}

      <div className="flex items-center space-x-4">
        {charIndex === question?.length && (
          <Button
            onClick={onNextQuestion}
            variant="link"
            size="sm"
            className="text-blue-500 hover:underline text-lg"
          >
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}
