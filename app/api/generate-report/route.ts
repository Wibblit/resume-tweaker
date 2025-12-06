export const maxDuration = 60;
export const dynamic = "force-dynamic";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse, NextRequest } from "next/server";
import { reportGenerationPrompt } from "@/data/prompts/reportGenerationPrompt";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler"; // Ensure correct import
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler"; // Ensure correct import
import { rateLimiter } from "@/lib/rateLimiter"; // Ensure correct import
import { auth } from "@/auth"; // Ensure correct import
import { creditList } from "@/utils/credits";
import { prisma } from "@/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = asyncHandler(async (request: NextRequest) => {
  const session = await auth(); // Authenticate session
  if (!session || !session.user?.id) {
    throw ApiError.userNotAuthenticated; // Throw error if the user is not authenticated
  }

  let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  // Apply rate limiting
  if (rateLimiter(session.user.id, ip)) {
    throw ApiError.rateLimitExceeded; // Throw rate limit exceeded error
  }

  try {
    const { questions, base64Audio, timeSpent, intervieweeSkippedQuestions } =
      await request.json();

    //console.log(
    //   "Questions",
    //   questions,
    //   "Time spent: ",
    //   timeSpent,
    //   "Audio length:",
    //   base64Audio.length,
    //   "interviewee skipped questions",
    //   intervieweeSkippedQuestions
    // );

    if (!questions || !base64Audio || !timeSpent) {
      throw ApiError.invalidRequest; // Throw an error if any necessary data is missing
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Generate content using the audio and the prompt
    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio,
        },
      },
      {
        text: `Context\nQuestions:${JSON.stringify(
          questions
        )}\n${reportGenerationPrompt(
          "comprehensive",
          intervieweeSkippedQuestions
        )}`,
      },
    ]);

    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();
    //console.log("Gemini response for report generation:", response);
    //console.log(
    //   "prompt: ",
    //   `Context\nQuestions:${JSON.stringify(
    //     questions
    //   )}\n${reportGenerationPrompt(
    //     "comprehensive",
    //     intervieweeSkippedQuestions
    //   )}`
    // );

    await prisma.userAssets.update({
      where: {
        userId: session?.user?.id,
      },
      data: {
        credits: {
          decrement: creditList.get("comprehensive"),
        },
      },
    });

    return NextResponse.json({ success: true, report: cleanedText });
  } catch (error) {
    console.error(
      "Error processing Gemini API response for report generation:",
      error
    );
    throw error; // Rethrow the error to be handled by asyncHandler
  }
});
