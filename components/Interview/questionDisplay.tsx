"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AudioLines, Loader2, Volume2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionDisplayProps {
  question: string;
  onNextQuestion: () => void;
  audioUrl: string | undefined;
}

export default function QuestionDisplay({
  question,
  onNextQuestion,
  audioUrl,
}: QuestionDisplayProps) {
  const [displayedQuestion, setDisplayedQuestion] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  useEffect(() => {
    setCharIndex(0);
    setDisplayedQuestion("");
    if (audioUrl) {
      playAudio();
    }
  }, [question, audioUrl]);

  useEffect(() => {
    if (charIndex < question?.length) {
      const timer = setTimeout(() => {
        console.log("hit")
        setDisplayedQuestion((prev) => prev + question[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [charIndex, question]);

  const playAudio = async () => {
    if (audioUrl) {
      setIsPlayingAudio(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      try {
        await audio.play(); // Ensure async playback
      } catch (err) {
        console.error("Audio playback failed:", err);
        setIsPlayingAudio(false);
      }
    }
  };

  return (
    <div className="mb-4 space-y-4">
      {!audioUrl ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[75%]" />
        </div>
      ) : (
        <p className="text-lg mb-2">{displayedQuestion}</p>
      )}

      <div className="flex items-center space-x-4">
        {audioUrl && (
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

