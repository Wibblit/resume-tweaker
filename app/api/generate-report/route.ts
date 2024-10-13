export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { reportGenerationPrompt } from "@/data/prompts/reportGenerationPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { history } = await request.json();
    console.log("history: ", history)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = JSON.stringify(history) + " " + reportGenerationPrompt;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();
    console.log("Gemini response for report generation:", text);

    return NextResponse.json({ report: cleanedText });
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
