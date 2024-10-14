export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    console.log("Prompt: ", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const result = await model.generateContent(prompt);
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
