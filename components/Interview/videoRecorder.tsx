'use client'

import React, { useRef, useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

interface VideoRecorderProps {
  isInterviewComplete: boolean
}

export default function VideoRecorder({ isInterviewComplete }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
        streamRef.current = stream
      } catch (error) {
        console.error('Error accessing camera:', error)
      }
    }

    if (!isInterviewComplete) {
      startCamera()
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [isInterviewComplete])

  return (
    <div className="relative mb-4">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className={`w-full h-64 bg-black ${isInterviewComplete ? 'hidden' : ''}`}
      />
      {isInterviewComplete && (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Interview Complete</h2>
            <p>Thank you for your participation</p>
          </div>
        </div>
      )}
    </div>
  )
}