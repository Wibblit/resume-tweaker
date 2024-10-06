'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface Report {
  overallScore: number
  strengths: string[]
  areasForImprovement: string[]
  recommendations: string
}

export function InterviewReport() {
  const [report, setReport] = useState<Report | null>(null)

  useEffect(() => {
    const simulatedReport: Report = {
      overallScore: 8.5,
      strengths: [
        "Strong technical knowledge",
        "Excellent communication skills",
        "Problem-solving ability",
      ],
      areasForImprovement: [
        "Could provide more specific examples",
        "Time management during responses",
      ],
      recommendations: "Candidate shows strong potential. Recommend moving forward to the next round of interviews.",
    }

    setReport(simulatedReport)
  }, [])

  if (!report) {
    return <div className="flex justify-center items-center h-screen text-foreground">Loading report...</div>
  }

  return (
    <Card className="max-w-2xl mx-auto bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Interview Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Overall Score:</h3>
            <p className="text-3xl font-bold text-primary">{report.overallScore} / 10</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Strengths:</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground">
              {report.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Areas for Improvement:</h3>
            <ul className="list-disc pl-5 space-y-1 text-foreground">
              {report.areasForImprovement.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Recommendations:</h3>
            <p className="text-foreground">{report.recommendations}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}