"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AudioLines, Loader, Volume2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TypeAnimation } from "react-type-animation";

interface QuestionDisplayProps {
  question: string;
  onNextQuestion: () => void;
  audioUrl: string | undefined;
  isPlayingAudio: boolean;
  setIsPlayingAudio: React.Dispatch<React.SetStateAction<boolean>>;
  skipQuestionLoading?: boolean;
  setIsoLoader : React.Dispatch<React.SetStateAction<boolean>>;
}

export default function QuestionDisplay({
  question,
  onNextQuestion,
  audioUrl,
  isPlayingAudio,
  setIsPlayingAudio,
  skipQuestionLoading,
  setIsoLoader,
}: QuestionDisplayProps) {
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isNextLoading, setIsNextLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsTypingComplete(false);
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      playAudio();
      audioRef.current.onended = () => {
        setIsPlayingAudio(false);
      };
    }
    // Clean up the audio when the component unmounts or question changes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlayingAudio(false);
      }
    };
  }, [question, audioUrl, setIsPlayingAudio]);

  const playAudio = () => {
    if (audioRef.current && !isPlayingAudio) {
      audioRef.current
        .play()
        .then(() => setIsPlayingAudio(true))
        .catch((err) => {
          console.error("Audio playback failed:", err);
          setIsPlayingAudio(false);
        });
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlayingAudio(false);
    }
  };
  const handleNextQuestion = async () => {
    setIsNextLoading(true);
    setIsoLoader(true);
    stopAudio();
    await onNextQuestion();
    setIsoLoader(false);
    setIsNextLoading(false);
  };

  isNextLoading && console.log("Ho bahai");

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
            sequence={[question, () => setIsTypingComplete(true)]}
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
            onClick={handleNextQuestion}
            disabled={skipQuestionLoading || isNextLoading}
            variant="link"
            size="sm"
            className={`text-blue-500 flex items-center justify-center  hover:underline text-lg ${
              skipQuestionLoading || isNextLoading
                ? "cursor-not-allowed opacity-50"
                : ""
            }`}
          >
            {isNextLoading && <Loader className="animate-spin mr-1" />}
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
}
