import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { genericPrompt } from "@/data/prompts/genericPrompt";
import { jdTailoredPrompt } from "@/data/prompts/jdTailoredPrompt";
import { rateLimiter } from "@/lib/rateLimiter";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { creditList } from "@/utils/credits";
import { prisma } from "@/prisma";
import { resumeReview } from "./review-utilities";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = asyncHandler(async (request: NextRequest) => {
  // Authentication check
  const session = await auth();
  if (!session || !session.user?.id) {
    throw ApiError.userNotAuthenticated; // Handle unauthenticated users
  }
  const data = await request.json();
  const { resumeId, jd, resumeOption, resumeText, reviewType } = data;
  //console.log(data);
  const prompt = jd ? jdTailoredPrompt : genericPrompt;
  let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;
  const results = await prisma.userAssets.findUnique({
    where: {
      userId: session?.user?.id,
    },
    select: {
      credits: true,
    },
  });
  const requiredCredits = creditList.get(reviewType) ?? 0;

  //console.log(requiredCredits, results);

  if (results?.credits === undefined || results.credits < requiredCredits) {
    return NextResponse.json({
      message: `You need at least ${requiredCredits} credits to access this feature.`,
      statusCode: 402,
    });
  }

  // Rate limit check
  if (rateLimiter(session.user.id, ip)) {
    throw ApiError.rateLimitExceeded; // Rate-limiting error
  }

  let resume =
    resumeOption === "upload"
      ? resumeText
      : await prisma.resume.findUnique({
          where: {
            id: resumeId,
            userId: session.user.id,
          },
        });

  if (!resume) {
    throw ApiError.resourceNotFound; // If resume is not found
  }
  let resumejson = null;
  let resumestyles = null;
  if (resumeOption !== "upload") {
    const { id, userId, resumeName, styles, ...resumeDetails } = resume;
    resume = resumeDetails;
    resume = {
      ...resume,
      basics: resume.basics.map((basic: any, index: number) =>
        index === 0 ? { ...basic, picture: null } : basic
      ),
      createdOn: null,
      updatedOn: null,
    };
    resumejson = resume;
    resume = JSON.stringify(resume, null, 2);
    resumestyles = styles;
    // console.log(resume)
  }

  const generatedContent = await resumeReview(resume, jd, reviewType);
  const review = generatedContent;
  // console.log("Review resume:\n",JSON.stringify(review,null,2));
  await prisma.userAssets.update({
    where: {
      userId: session?.user?.id,
    },
    data: {
      credits: {
        decrement:
          reviewType === "tailored"
            ? creditList.get("tailored")
            : creditList.get("generic"),
      },
    },
  });

  return NextResponse.json({
    output: review,
    resume: resumejson,
    styles: resumestyles,
    message: "Review generated successfully.",
  });
});
