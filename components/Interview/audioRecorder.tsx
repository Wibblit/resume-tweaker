'use client'

import React, { useRef, useEffect } from 'react'

interface AudioRecorderProps {
  isRecording: boolean
  setIsRecording: (isRecording: boolean) => void
  setAudioBlob: (blob: Blob) => void
}

export default function AudioRecorder({ isRecording, setIsRecording, setAudioBlob }: AudioRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaRecorderRef.current = new MediaRecorder(stream)
        
        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunksRef.current.push(event.data)
          }
        }

        mediaRecorderRef.current.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          setAudioBlob(blob)
          chunksRef.current = []
        }

        mediaRecorderRef.current.start()
        setIsRecording(true)
      } catch (error) {
        console.error('Error starting audio recording:', error)
      }
    }

    const stopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
        setIsRecording(false)
      }
    }

    if (isRecording) {
      startRecording()
    } else {
      stopRecording()
    }

    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [isRecording, setIsRecording, setAudioBlob])

  return null // This component doesn't render anything visible
}