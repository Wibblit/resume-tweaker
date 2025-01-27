// import { auth } from "@/auth";
// import { NextRequest } from "next/server";
// import { prisma } from "@/prisma";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";
// import { genericPrompt } from "@/data/prompts/genericPrompt";
// import { jdTailoredPrompt } from "@/data/prompts/jdTailoredPrompt";
// import { rateLimiter } from "@/lib/rateLimiter";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(request: NextRequest) {
//   const { resumeId, jd, resumeOption, resumeText } = await request.json();
//   const prompt = jd ? jdTailoredPrompt : genericPrompt;
//   const session = await auth();
//   let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
//   ip = ip === "::1" ? "127.0.0.1" : ip;
//   let result = null;
//   try {
//     if (rateLimiter(session?.user?.id, ip)) {
//       return NextResponse.json(
//         { message: "Rate limit exceeded." },
//         { status: 429 }
//       );
//     }
//     result =
//       resumeOption === "upload"
//         ? resumeText
//         : await prisma.resume.findUnique({
//             where: {
//               id: resumeId,
//               userId: session?.user?.id,
//             },
//           });
//     if (result) {
//       if (resumeOption !== "upload") {
//         const { id, userId, resumeName, ...resumeDetails } = result;
//         result = resumeDetails;
//         result = {
//           ...result,
//           basics: result.basics.map((basic: any, index: number) =>
//             index === 0 ? { ...basic, picture: null } : basic
//           ),
//           styles: null,
//           createdOn: null,
//           updatedOn: null,
//         };
//         result = JSON.stringify(result) + JSON.stringify(result);
//       }
//       const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//       console.log("resume: ", result);
//       const detailedPrompt = `${result} ${jd} ${prompt}`;
//       const generatedContent = await model.generateContent(detailedPrompt);
//       const response = generatedContent.response;
//       const text = response.text();
//       const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();

//       console.log("Gemini review : " + cleanedText);
//       const resumeReview = JSON.parse(cleanedText);

//       console.log(
//         "Input Word count",
//         detailedPrompt.split(" ").length,
//         "character count",
//         detailedPrompt.length
//       );

//       console.log("Input Counts ", await model.countTokens(detailedPrompt));
//       console.log("OutputCounts ", await model.countTokens(text));

//       return NextResponse.json({
//         resumeReview,
//         message: "Review generated successfully.",
//       });
//     }
//   } catch (error) {
//     console.error("Error processing Gemini API response:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to generate review for the resume",
//         details: (error as Error).message,
//       },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }

import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { genericPrompt } from "@/data/prompts/genericPrompt";
import { jdTailoredPrompt } from "@/data/prompts/jdTailoredPrompt";
import { rateLimiter } from "@/lib/rateLimiter";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
// import { creditList } from "@/utils/credits";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = asyncHandler(async (request: NextRequest) => {
  // Authentication check
  const session = await auth();
  if (!session || !session.user?.id) {
    throw ApiError.userNotAuthenticated; // Handle unauthenticated users
  }
  const data = await request.json();
  const { resumeId, jd, resumeOption, resumeText, reviewType } = data;
  console.log(data);
  const prompt = jd ? jdTailoredPrompt : genericPrompt;
  let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  // const results = await prisma.userAssets.findUnique({
  //   where: {
  //     userId: session?.user?.id,
  //   },
  //   select: {
  //     credits: true,
  //   },
  // });
  // const requiredCredits = creditList.get(reviewType);

  // if (
  //   results?.credits &&
  //   requiredCredits !== undefined &&
  //   typeof requiredCredits === "number"
  // ) {
  //   if (results?.credits > requiredCredits) {
  //     return NextResponse.json({
  //       message: `You need at least ${requiredCredits} credits to access this feature.`,
  //       status: 402,
  //     });
  //   }
  // }

  // Rate limit check
  if (rateLimiter(session.user.id, ip)) {
    throw ApiError.rateLimitExceeded; // Rate-limiting error
  }

  let result =
    resumeOption === "upload"
      ? resumeText
      : await prisma.resume.findUnique({
          where: {
            id: resumeId,
            userId: session.user.id,
          },
        });

  if (!result) {
    throw ApiError.resourceNotFound; // If resume is not found
  }

  if (resumeOption !== "upload") {
    const { id, userId, resumeName, ...resumeDetails } = result;
    result = resumeDetails;
    result = {
      ...result,
      basics: result.basics.map((basic: any, index: number) =>
        index === 0 ? { ...basic, picture: null } : basic
      ),
      styles: null,
      createdOn: null,
      updatedOn: null,
    };
    result = JSON.stringify(result) + JSON.stringify(result);
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const detailedPrompt = `${result} ${jd} ${prompt}`;
  const generatedContent = await model.generateContent(detailedPrompt);
  const response = generatedContent.response;
  const text = response.text();
  const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();

  const resumeReview = JSON.parse(cleanedText);

  return NextResponse.json({
    resumeReview,
    message: "Review generated successfully.",
  });
});
