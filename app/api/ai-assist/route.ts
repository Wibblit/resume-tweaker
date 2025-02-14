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
import { prisma } from "@/prisma";
import { creditList } from "@/utils/credits";

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
  //console.log("result: ", result);
  const response = result.response;
  const text = response.text();

  const res = await prisma.userAssets.findUnique({
    where: {
      userId: session?.user?.id,
    },
  });

  if (!res) {
    return NextResponse.json({
      success: false,
      message: "User assets not found.",
    });
  }

  if (res?.credits < (creditList.get("aienhance") ?? 0)) {
    return NextResponse.json({
      message: `You need at least ${creditList.get(
        "aienhance"
      )}} credits to access this feature.`,
      statusCode: 402,
    });
  }

  await prisma.userAssets.update({
    where: {
      userId: session?.user?.id,
    },
    data: {
      credits: {
        decrement: creditList.get("aienhance"),
      },
    },
  });

  return NextResponse.json({ content: text });
});
