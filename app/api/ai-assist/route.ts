export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { rateLimiter } from "@/lib/rateLimiter";
import { auth } from "@/auth";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";
import {
  getAISuggestionPrompt,
  getAIEnhancementPrompt,
} from "@/data/prompts/textEditorPrompt";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await auth();
  let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (!session || !session.user?.id) throw ApiError.userNotAuthenticated;

  if (rateLimiter(session?.user?.id, ip)) throw ApiError.rateLimitExceeded;
  const { prompt, content, action, section } = await request.json();
  const detailedPrompt =
    action === "enhance"
      ? getAIEnhancementPrompt(content, section)
      : getAISuggestionPrompt(prompt, section);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(detailedPrompt);
  console.log("result: ", result);
  const response = result.response;
  const text = response.text();
  return NextResponse.json({ content: text });
});
