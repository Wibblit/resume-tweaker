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
  let resume;
  let resumejson = null;
  let resumestyles = null;

  if (resumeOption === "upload") {
    // For uploaded resumes, use the provided text and default styles
    resume = resumeText;
    resumejson = JSON.parse(resumeText);
    resumestyles = {
      id: 1,
      font: {
        family: 'Helvetica',
        size: '11pt',
        color: '#000000'
      },
      spacing: {
        margin: 6,
        lineHeight: 1.2
      },
      datetype: "MMM 'YY",
      sections: [
        'basics', 'profiles', 'summary', 'experience',
        'education', 'projects', 'skills', 'certifications',
        'languages', 'awards', 'publications', 'references',
        'volunteer'
      ],
      sectionOrder: {
        sections: [
          { name: 'left', width: 'full' },
          { name: 'right', width: 'full' }
        ],
        column3: []
      }
    };
  } else {
    // For selected resumes, fetch from database
    const dbResume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!dbResume) {
      throw ApiError.resourceNotFound;
    }

    const { id, userId, resumeName, styles, ...resumeDetails } = dbResume;
    
    // Process resume data
    const processedResume = {
      ...resumeDetails,
      basics: Array.isArray(resumeDetails.basics) ? resumeDetails.basics.map((basic: any, index: number) =>
        index === 0 ? { ...basic, picture: null } : basic
      ) : [],
      createdOn: null,
      updatedOn: null,
    };

    resumejson = processedResume;
    resume = JSON.stringify(processedResume, null, 2);
    resumestyles = styles;
  }

  // Generate review
  const generatedContent = await resumeReview(resume, jd, reviewType);

  // Update credits
  await prisma.userAssets.update({
    where: {
      userId: session?.user?.id,
    },
    data: {
      credits: {
        decrement: requiredCredits,
      },
    },
  });

  return NextResponse.json({
    output: generatedContent,
    resume: resumejson,
    styles: resumestyles,
    message: "Review generated successfully.",
  });
});
