// import { auth } from "@/auth";
// import { NextRequest, NextResponse } from "next/server";
// import { rateLimiter } from "@/lib/rateLimiter";
// import { prisma } from "@/prisma";

// export async function GET(
//   request: NextRequest,
//   { params }: { params: { coverId: string } }
// ) {
//   const coverId = params.coverId;
//   const session = await auth();
//     let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
//     ip = ip === "::1" ? "127.0.0.1" : ip;  
//   let result = null;
//   try {
//     if (rateLimiter(session?.user?.id, ip)) {
//       return NextResponse.json(
//         { message: "Rate limit exceeded." },
//         { status: 429 }
//       );
//     } 
//     result = await prisma.coverletter.findUnique({
//       where: {
//         id: coverId,
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
//     coverData: result,
//     message: `Resume data for ID: ${coverId}`,
//   });
// }


import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler"; // Ensure correct import
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler"; // Ensure correct import

export const GET = asyncHandler(
  async (request: NextRequest, { params }: { params: { coverId: string } }) => {
    const coverId = params.coverId;
    const session = await auth();

    // Check if the user is authenticated
    if (!session || !session.user?.id) {
      throw ApiError.userNotAuthenticated;
    }

    let ip =
      request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    let result = null;

    // Rate limit check
    if (rateLimiter(session?.user?.id, ip)) {
      throw ApiError.rateLimitExceeded;
    }

    // Fetch the cover letter data
    result = await prisma.coverletter.findUnique({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
    });

    if (!result) {
      throw ApiError.resourceNotFound;
    }

    console.log(`Fetched data: ${result}`);

    return NextResponse.json({
      coverData: result,
      message: `Cover letter data for ID: ${coverId}`,
    });
  }
);
