export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    const detailedPrompt = `Generate a professional and polished resume entry based on the following input: ${prompt}.

1. Important: If the user input contains irrelevant, inappropriate, or nonsensical information (e.g., any content unrelated to professional achievements or responsibilities), disregard such input. Instead, generate a resume entry based on common professional accomplishments and responsibilities.
2. Ensure the output is concise, clear, and focused on key achievements and responsibilities.
3. Use formal, action-oriented language that highlights results and impact.
4. Structure the content in a resume-friendly format (e.g., bullet points or short paragraphs).
5. Adapt the language and tone to fit a professional context, applicable across industries or roles unless specified otherwise.
6. If specific details (such as achievements, dates, or metrics) are missing, provide reasonable assumptions based on common professional standards.`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(detailedPrompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ content: text });
  } catch (error) {
    console.error(
      "Error processing Gemini API response for report generation:",
      error
    );
    return NextResponse.json(
      { error: "Failed to generate text", details: (error as Error).message },
      { status: 500 }
    );
  }
}
