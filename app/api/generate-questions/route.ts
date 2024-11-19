import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const session = await auth();
  const { job, position, companyName, jd, numberOfQuestions, resumeText } =
    await req.json();
  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  try {
    if (rateLimiter(session?.user?.id, ip)) {
      return NextResponse.json(
        { message: "Rate limit exceeded." },
        { status: 429 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate ${numberOfQuestions} interview questions for a ${position} ${job} position at ${companyName}. 
    ${jd ? `Consider this job description: ${jd}` : ""} ${
      resumeText ? `and resume ${resumeText}` : ""
    } "Provide the questions as a JSON array of strings."
    Ensure the questions are challenging and relevant to the position.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    try {
      const text = response.text();
      // Clean the response by removing backticks and any potential JSON formatting
      const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();
      const questions = JSON.parse(cleanedText);

      console.log(questions);
      return NextResponse.json({ questions });
    } catch (error) {
      const questions: any[] = [];
      return NextResponse.json({ questions });
    }
  } catch (error) {
    console.error("Error processing Gemini API response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
