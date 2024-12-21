// import { auth } from "@/auth";
// import { NextRequest, NextResponse } from "next/server";
// import { rateLimiter } from "@/lib/rateLimiter";
// import { prisma } from "@/prisma";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { resumeId: string } }
// ) {
//   const resumeId = params.resumeId;
//   const session = await auth();
//    let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
//    ip = ip === "::1" ? "127.0.0.1" : ip;  
//   let result = null;
//   try {
//      if (rateLimiter(session?.user?.id, ip)) {
//        return NextResponse.json(
//          { message: "Rate limit exceeded." },
//          { status: 429 }
//        );
//      } 
//     result = await prisma.resume.findUnique({
//       where: {
//         id: resumeId,
//         userId: session?.user?.id,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching resume data:", error);
//     throw error;
//   } finally {
//     prisma.$disconnect();
//   }

//   console.log(`Fetched data : ${result}`);

//   return NextResponse.json({
//     resumeData: result,
//     message: `Resume data for ID: ${resumeId}`,
//   });
// }


import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";

export const GET = asyncHandler(
  async (
    request: NextRequest,
    { params }: { params: { resumeId: string } }
  ) => {
    const resumeId = params.resumeId;

    // Authentication check
    const session = await auth();
    if (!session || !session.user?.id) {
      throw ApiError.userNotAuthenticated; // Handle unauthenticated users
    }

    let ip =
      request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    let result = null;

    // Rate limit check
    if (rateLimiter(session.user.id, ip)) {
      throw ApiError.rateLimitExceeded; // Rate-limiting error
    }

    // Fetch the resume
    result = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session.user.id,
      },
    });

    if (!result) {
      throw ApiError.resourceNotFound; // If resume is not found
    }

    return NextResponse.json({
      resumeData: result,
      message: `Resume data for ID: ${resumeId}`,
    });
  }
);
