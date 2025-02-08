import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { adaptivePrompt } from "@/data/prompts/adaptiveStartPrompt";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { prisma } from "@/prisma";
import { creditList } from "@/utils/credits";

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

  let {
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
    isdetected,
  } = await req.json();

  if (currentQuestionIndex === 0) {
    // Check for credits else redirect
  }

  const prompt = adaptivePrompt(
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

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let result;

  console.log(
    currentQuestionIndex,
    Math.floor(numberOfQuestions / 2),
    isdetected
  );
  if (currentQuestionIndex >= Math.floor(numberOfQuestions / 2)) {
    if (!isdetected) {
      await prisma.userAssets.update({
        where: {
          userId: session?.user?.id,
        },
        data: {
          credits: {
            decrement: creditList.get("adaptive"),
          },
        },
      });
      isdetected = true;
    }
  }

  if (isSkipped) {
    chatHistory = [
      ...chatHistory,
      {
        role: "user",
        parts: [
          {
            text: "INFO: USER SKIPPED THE PREVIOUS QUESTION",
          },
        ],
      },
    ];
    result = await model.generateContent(
      adaptivePrompt(
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
      )
    );
  } else {
    if (base64Audio) {
      console.log("base64Audio is given");
      const transcribeText = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/webm",
            data: base64Audio,
          },
        },
        {
          text: "Transcribe this audio. If the audio is not transcriable or if the audio is not detectable just send 'ERROR: UNABLE TO DETECT INPUT' and nothing else. I repeat either send the transcribed text or 'ERROR: UNABLE TO DETECT INPUT' in case of undetectable audio.",
        },
      ]);

      chatHistory = [
        ...chatHistory,
        {
          role: "user",
          parts: [
            {
              text: transcribeText.response
                .text()
                .replace(/```json\s*|\s*```/g, "")
                .trim(),
            },
          ],
        },
      ];
      console.log(
        "Transcribed text",
        JSON.stringify(
          transcribeText.response
            .text()
            .replace(/```json\s*|\s*```/g, "")
            .trim(),
          null,
          2
        )
      );

      result = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/webm",
            data: base64Audio,
          },
        },
        {
          text: adaptivePrompt(
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
          ),
        },
      ]);
    } else {
      result = await model.generateContent(
        adaptivePrompt(
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
        )
      );
    }
  }

  const chat = JSON.parse(
    result.response
      .text()
      .replace(/```json\s*|\s*```/g, "")
      .trim()
  ); // Ensure response is valid JSON

  const lastMessage = chat[chat.length - 1]?.parts[0]?.text || "";
  console.log("Gemini response for adaptive:", result);
  console.log(
    "After Chat History: ",
    JSON.stringify([...chatHistory, ...chat], null, 2)
  );

  console.log("Detected", isdetected);
  return NextResponse.json({
    isdetected: isdetected,
    question: lastMessage,
    chatHistory: [...chatHistory, ...chat],
  });
});
