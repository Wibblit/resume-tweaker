import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  const { job, position, companyName, jd, numberOfQuestions } = await request.json()

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `Generate ${numberOfQuestions} interview questions for a ${position} ${job} position at ${companyName}. 
    ${jd ? `Consider this job description: ${jd}` : ''}
    Provide the questions as a JSON array of strings.`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    console.log("Gemini response ", text)

    // Clean the response by removing backticks and any potential JSON formatting
    const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim()

    // Parse the cleaned JSON string to get the array of questions
    const questions = JSON.parse(cleanedText)

    return NextResponse.json({ questions })
  } catch (error) {
    console.error('Error processing Gemini API response:', error)
    return NextResponse.json({ error: 'Failed to generate questions', details: (error as Error).message }, { status: 500 })
  }
}