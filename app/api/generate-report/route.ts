export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { reportGenerationPrompt } from "@/data/prompts/reportGenerationPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {  
  try {
    const { questions, base64Audio, timeSpent } = await request.json();

    console.log("Questions", questions, "Time spent: ", timeSpent, "Audio length:", base64Audio.length);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the audio and the prompt
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio
        } 
      },
      { 
        text: `${JSON.stringify(questions)}\nTime spent: ${timeSpent}\n${reportGenerationPrompt}`
      },
    ]);

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
      { error: "Failed to generate report", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}