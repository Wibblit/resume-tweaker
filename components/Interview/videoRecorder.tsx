'use client'

import React, { useRef, useEffect, useState } from 'react'
import { CheckCircle, Camera, CameraOff } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface VideoRecorderProps {
  isInterviewComplete: boolean
}

export default function VideoRecorder({ isInterviewComplete }: VideoRecorderProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [isCameraOn, setIsCameraOn] = useState(false)

  useEffect(() => {
    if (!isInterviewComplete && isCameraOn) {
      startCamera()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isInterviewComplete, isCameraOn])

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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }

  const toggleCamera = () => {
    setIsCameraOn(!isCameraOn)
  }

  return (
    <div className="relative mb-4">
      <video 
        ref={videoRef} 
        autoPlay 
        muted 
        className={`w-full h-64 bg-black ${!isCameraOn || isInterviewComplete ? 'hidden' : ''}`}
      />
      {isInterviewComplete ? (
        <div className="w-full h-64 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-white">
            <CheckCircle className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Interview Complete</h2>
            <p>Thank you for your participation</p>
          </div>
        </div>
      ) : (
        <div className={`w-full h-64 bg-gray-800 flex items-center justify-center ${isCameraOn ? 'hidden' : ''}`}>
          <p className="text-white">Camera is off</p>
        </div>
      )}
      {!isInterviewComplete && (
        <Button
          onClick={toggleCamera}
          variant="outline"
          size="sm"
          className="absolute bottom-4 right-4"
        >
          {isCameraOn ? (
            <>
              <CameraOff className="mr-2 h-4 w-4" />
              Turn Camera Off
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              Turn Camera On
            </>
          )}
        </Button>
      )}
    </div>
  )
}

