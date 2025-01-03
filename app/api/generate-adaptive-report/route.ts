export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";
import { reportGenerationPrompt } from "@/data/prompts/reportGenerationPrompt";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = asyncHandler(async (request: NextRequest) => {
  const { chatHistory, timeSpent } = await request.json();
  const session = await auth();

  let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (!session || !session.user?.id) throw ApiError.userNotAuthenticated;

  if (rateLimiter(session?.user?.id, ip)) {
    throw ApiError.rateLimitExceeded;
  }

  console.log("Chat History ", JSON.stringify(chatHistory, null, 2));
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  

  const result = await model.generateContent(
    `${JSON.stringify(chatHistory)} \n ${reportGenerationPrompt}`
  );
  const response = result.response;
  const text = response.text();
  const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();
  console.log("Gemini response for report generation:", response);

  return NextResponse.json({ report: cleanedText });
});
