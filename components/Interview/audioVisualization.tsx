'use client'

import React, { useRef, useEffect, useState } from 'react'

interface AudioVisualizationProps {
  isRecording: boolean
}

export default function AudioVisualization({ isRecording }: AudioVisualizationProps) {
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const dataArrayRef = useRef<Uint8Array | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (isRecording) {
      startVisualization()
    } else {
      stopVisualization()
    }

    return () => stopVisualization()
  }, [isRecording])

  const startVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioContextRef.current = new AudioContext()
      analyserRef.current = audioContextRef.current.createAnalyser()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      analyserRef.current.fftSize = 128
      const bufferLength = analyserRef.current.frequencyBinCount
      dataArrayRef.current = new Uint8Array(bufferLength)

      animate()
    } catch (error) {
      console.error('Error starting audio visualization:', error)
    }
  }

  const stopVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    if (audioContextRef.current) {
      audioContextRef.current.close()
    }
    setIsSpeaking(false)
  }

  const detectSpeaking = (audioData: Uint8Array): boolean => {
    const average = audioData.reduce((sum, value) => sum + value, 0) / audioData.length
    const threshold = 35
    return average > threshold
  }

  const animate = () => {
    if (!analyserRef.current || !dataArrayRef.current) return

    analyserRef.current.getByteFrequencyData(dataArrayRef.current)
    const speaking = detectSpeaking(dataArrayRef.current)
    setIsSpeaking(speaking)

    const bars = document.querySelectorAll('.audio-bar')
    const centerIndex = Math.floor(bars.length / 2)
    
    if (speaking) {
      const frequencyData = Array.from(dataArrayRef.current)
      const smoothedData = frequencyData.map((value, i, arr) => {
        const prev = arr[i - 1] || value
        const next = arr[i + 1] || value
        return (prev + value + next) / 3
      })

      bars.forEach((bar, index) => {
        if (index === 0 || index === bars.length - 1) {
          // Keep first and last bars static
          (bar as HTMLElement).style.height = '10%'
        } else {
          // Animate middle bars
          const distanceFromCenter = Math.abs(index - centerIndex)
          const dataIndex = Math.min(distanceFromCenter, smoothedData.length - 1)
          const height = Math.max(10, (smoothedData[dataIndex] / 255) * 100)
          ;(bar as HTMLElement).style.height = `${height}%`
        }
      })
    } else {
      bars.forEach((bar, index) => {
        if (index === 0 || index === bars.length - 1) {
          // Keep first and last bars static
          (bar as HTMLElement).style.height = '10%'
        } else {
          // Set default height for middle bars when not speaking
          const distanceFromCenter = Math.abs(index - centerIndex)
          const minHeight = Math.max(10, 40 - distanceFromCenter * 4)
          ;(bar as HTMLElement).style.height = `${minHeight}%`
        }
      })
    }

    animationFrameRef.current = requestAnimationFrame(animate)
  }

  // Create 15 bars for a more detailed visualization
  const bars = Array.from({ length: 15 })

  return (
    <div className="flex items-center justify-center gap-[2px] h-16 my-4">
      {bars.map((_, index) => (
        <div
          key={index}
          className={`audio-bar w-1 bg-primary rounded-sm transition-all duration-75 ease-out ${
            isRecording ? 'opacity-100' : 'opacity-50'
          }`}
          style={{
           // height: index === 0 || index === bars.length - 1 ? '5%' : '20%',
            minHeight: '2px',
          }}
        />
      ))}
    </div>
  )
}

