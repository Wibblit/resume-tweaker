import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { genericPrompt } from "@/data/prompts/genericPrompt";
import { jdTailoredPrompt } from "@/data/prompts/jdTailoredPrompt";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest, response: NextResponse) {
  const { resumeId, jd } = await request.json();
  const prompt = jd ? jdTailoredPrompt : genericPrompt;
  const session = await auth();
  let result = null;
  try {
    result = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session?.user?.id,
      },
    });
    if (result) {
      const { id, userId, resumeName, ...resumeDetails } = result;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("resume: ", resumeDetails);
      const detailedPrompt = resumeDetails + jd + prompt;
      const generatedContent = await model.generateContent(detailedPrompt);
      const response = generatedContent.response;
      const text = response.text();
      const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();

      console.log("Gemini review : " + cleanedText);
      const resumeReview = JSON.parse(cleanedText);
      return NextResponse.json({
        resumeReview,
        message: "Review generated successfully.",
      });
    }
  } catch (error) {
    console.error("Error processing Gemini API response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate review for the resume",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
