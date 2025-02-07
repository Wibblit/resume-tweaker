"use client";
import { useEffect, useRef, useState } from "react";

interface AudioVisualizationProps {
  isRecording: boolean;
}

export default function AudioVisualization({ isRecording }: AudioVisualizationProps) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const previousHeightsRef = useRef<number[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isRecording) {
      startVisualization();
    } else {
      stopVisualization();
    }

    return () => {
      stopVisualization();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isRecording]);

  const startVisualization = async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      analyserRef.current.fftSize = 256;
      const bufferLength = analyserRef.current.frequencyBinCount;
      dataArrayRef.current = new Uint8Array(bufferLength);
      previousHeightsRef.current = Array(32).fill(20);

      animate();
    } catch (error) {
      console.error('Error starting audio visualization:', error);
    }
  };

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsSpeaking(false);
  };

  const detectSpeaking = (audioData: Uint8Array): boolean => {
    const average = audioData.reduce((sum, value) => sum + value, 0) / audioData.length;
    return average > 30;
  };

  const smoothValue = (current: number, previous: number, smoothingFactor: number = 0.3) => {
    return previous + smoothingFactor * (current - previous);
  };

  const animate = () => {
    if (!analyserRef.current || !dataArrayRef.current) return;

    analyserRef.current.getByteFrequencyData(dataArrayRef.current);
    const speaking = detectSpeaking(dataArrayRef.current);
    setIsSpeaking(speaking);

    const bars = document.querySelectorAll('.audio-bar');
    const time = Date.now() / 1000;
    const newHeights: number[] = [];

    bars.forEach((bar, index) => {
      const element = bar as HTMLElement;
      const normalizedIndex = index / (bars.length - 1);

      let targetHeight: number;
      if (speaking) {
        const frequencyIndex = Math.floor(normalizedIndex * (dataArrayRef.current!.length - 1));
        const frequencyData = dataArrayRef.current![frequencyIndex];
        const baseHeight = (frequencyData / 255) * 100;
        const wave = Math.sin(time * 3 + normalizedIndex * Math.PI * 2) * 10;
        targetHeight = Math.max(5, Math.min(100, baseHeight + wave));
      } else {
        const breathingWave = Math.sin(time * 2 + normalizedIndex * Math.PI) * 10;
        targetHeight = 20 + breathingWave;
      }

      const smoothedHeight = smoothValue(
        targetHeight,
        previousHeightsRef.current[index] || targetHeight
      );
      newHeights.push(smoothedHeight);

      element.style.height = `${smoothedHeight}%`;
      element.style.opacity = speaking ? '1' : '0.6';
    });

    previousHeightsRef.current = newHeights;
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  return (
    <div className="relative flex items-center justify-center gap-[3px] h-24 my-4">
      {Array.from({ length: 32 }).map((_, index) => (
        <div
          key={index}
          className={`
            audio-bar
            w-1.5
            rounded-full
            transition-[opacity]
            duration-150
            ease-out
            ${isRecording ? 'bg-gradient-to-t from-primary/80 to-primary' : 'bg-primary/40'}
          `}
          style={{
            height: '20%',
            transform: `scaleY(${isRecording ? 1 : 0.5})`,
            transformOrigin: 'center',
          }}
        />
      ))}
    </div>
  );
}
