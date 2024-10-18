// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useSelector } from 'react-redux'
// import { RootState } from '@/store'
// import InterviewProcess from '@/components/interview-process'

// export default function InterviewPage() {
//   const router = useRouter()
//   const { questions, formData } = useSelector((state: RootState) => state.interview)

//   useEffect(() => {
//     if (!questions.length || !formData) {
//       router.push('/ai-interview')
//     }
//   }, [questions, formData, router])

//   if (!questions.length || !formData) {
//     return <div>Loading...</div>
//   }

//   return (
//     <main className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-8 text-center text-foreground">AI Interview</h1>
//       <InterviewProcess questions={questions} formData={formData} />
//     </main>
//   )
// }

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import AdaptiveInterview from "@/components/adaptive-interview";
import ComprehensiveInterview from "@/components/interview-process";

export default function InterviewPage() {
  const router = useRouter();
  const { questions, formData } = useSelector(
    (state: RootState) => state.interview
  );

  useEffect(() => {
    if (!questions.length || !formData) {
      router.push("/ai-interview");
    }
  }, [questions, formData, router]);

  if (!questions.length || !formData) {
    return <div className="text-center p-4">Loading...</div>;
  }

  return router.push("/")
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center text-foreground">
        AI Interview
      </h1>
      {formData?.interviewType === "adaptive" ? (
        <AdaptiveInterview initialQuestion={questions[0]} formData={formData} />
      ) : (
        <ComprehensiveInterview questions={questions} formData={formData} />
      )}
    </main>
  );
}
