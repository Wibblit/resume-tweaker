export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { reportGenerationPrompt } from "@/data/prompts/reportGenerationPrompt";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
    try {
      const { history } = await request.json();
  
      
  
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
      // Generate content using the audio and the prompt
      const result = await model.generateContent(`${history} \n reportGenerationPrompt`);
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