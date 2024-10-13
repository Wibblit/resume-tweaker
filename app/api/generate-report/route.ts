export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { history } = await request.json();

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Generate a comprehensive interview report based on the following question-answer pairs:

${history
  .map(
    (item: { question: string; answer: string }, index: number) =>
      `Question ${index + 1}: ${item.question}
Answer: ${item.answer}
`
  )
  .join("\n")}

Please provide a detailed analysis including:
1. Overall performance evaluation
2. Strengths demonstrated in the answers
3. Areas for improvement
4. Specific feedback for each question-answer pair
5. Suggestions for further development
6. A numerical score out of 10 for each of the following criteria: Subject Knowledge, Communication Skills, Problem-Solving Ability, and Overall Impression
7. A final recommendation (Hire, Consider, or Do Not Hire)

Format the report in a clear, structured manner using markdown for headings and bullet points.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini response for report generation:", text);

    return NextResponse.json({ report: text });
  } catch (error) {
    console.error(
      "Error processing Gemini API response for report generation:",
      error
    );
    return NextResponse.json(
      { error: "Failed to generate report", details: (error as Error).message },
      { status: 500 }
    );
  }
}
