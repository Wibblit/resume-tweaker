"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AudioLines, Volume2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { TypeAnimation } from 'react-type-animation';

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

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  useEffect(() => {
    setIsTypingComplete(false);
    if (audioUrl) {
      playAudio();
    }
  }, [question, audioUrl]);

  const playAudio = () => {
    if (audioUrl && !isPlayingAudio) {
      setIsPlayingAudio(true);
      const audio = new Audio(audioUrl);
      audio.onended = () => setIsPlayingAudio(false);
      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlayingAudio(false);
      });
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
        <p className="text-lg mb-2 min-h-[3rem]">
          <TypeAnimation
            key={`${question}-${audioUrl}`} 
            sequence={[
              question,
              () => setIsTypingComplete(true)
            ]}
              wrapper="p"
            cursor={true}
            speed={50}
          />
        </p>
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
        {isTypingComplete && (
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

