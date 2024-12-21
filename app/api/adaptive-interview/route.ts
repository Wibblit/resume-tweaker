import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { adaptiveInitialPrompt } from "@/data/prompts/adaptiveStartPrompt";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined in the environment variables."
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const POST = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session || !session.user?.id) throw ApiError.userNotAuthenticated;

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (rateLimiter(session?.user?.id, ip)) throw ApiError.rateLimitExceeded;

  const {
    jd,
    companyName,
    position,
    job,
    base64Audio,
    numberOfQuestions,
    currentQuestionIndex,
    isSkipped,
    resumeText,
    chatHistory,
    totalDuration,
    timeLeft,
    interviewerPosition,
  } = await req.json();
  console.log(
    "totalduration, timeleft, interviewerPosition",
    totalDuration,
    timeLeft,
    interviewerPosition
  );

  // Adaptive prompt generation
  const prompt = adaptiveInitialPrompt(
    job,
    position,
    companyName,
    resumeText,
    jd,
    numberOfQuestions,
    chatHistory,
    timeLeft,
    totalDuration,
    currentQuestionIndex,
    interviewerPosition
  );

  // Get generative model
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  // console.log("Before Chat History: ", JSON.stringify(chatHistory,null,2));
  // Generate content using the model
  let result;
  if (base64Audio) {
    result = await model.generateContent([
      {
        inlineData: {
          mimeType: "audio/webm",
          data: base64Audio,
        },
      },
      {
        text: prompt,
      },
    ]);
  } else {
    result = await model.generateContent(
      (currentQuestionIndex === 0
        ? "Please provide the first question"
        : isSkipped
        ? "User skipped the previous question"
        : "") + prompt
    );
  }

  // console.log("GEMINI RESPONSE FOR ADAPTIVE", result.response.text())

  const chat = JSON.parse(
    result.response
      .text()
      .replace(/```json\s*|\s*```/g, "")
      .trim()
  ); // Ensure response is valid JSON

  // Extract the last generated question
  const lastMessage = chat[chat.length - 1]?.parts[0]?.text || "";
  console.log("Gemini response for adaptive:", result);
  console.log(
    "After Chat History: ",
    JSON.stringify([...chatHistory, ...chat], null, 2)
  );
  return NextResponse.json({
    question: lastMessage,
    chatHistory: [...chatHistory, ...chat],
  });
});
