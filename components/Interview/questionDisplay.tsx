'use client'

import React, { useState, useEffect } from 'react'

interface QuestionDisplayProps {
  question: string
  onNextQuestion: () => void
}

export default function QuestionDisplay({ question, onNextQuestion }: QuestionDisplayProps) {
  const [displayedQuestion, setDisplayedQuestion] = useState('')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    setCharIndex(0)
    setDisplayedQuestion('')
  }, [question])

  useEffect(() => {
    if (charIndex < question?.length) {
      const timer = setTimeout(() => {
        setDisplayedQuestion(prev => prev + question[charIndex])
        setCharIndex(prev => prev + 1)
      }, 50) 
      return () => clearTimeout(timer)
    }
  }, [charIndex, question])

  return (
    <div className="mb-4">
      <p className="text-lg mb-2">{displayedQuestion}</p>
      {charIndex === question?.length && (
        <button onClick={onNextQuestion} className="text-blue-500 hover:underline mt-4">
          Next Question
        </button>
      )}
    </div>
  )
}