import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";
import { title } from "process";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

export const GET = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session || !session?.user?.id) {
    throw ApiError.userNotAuthenticated;
  }

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;
  let result = null;
  if (rateLimiter(session?.user?.id, ip)) {
    throw ApiError.rateLimitExceeded;
  }

  result = await prisma.resume.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      id: "desc",
    },
    take: 3,
    select: {
      id: true,
      userId: true,
      resumeName: true,
    },
  });

  if (!result) {
    throw ApiError.resourceNotFound;
  }

  console.log(`recent resumes : ${result}`);
  return NextResponse.json({
    recentResumes: result,
    message: "Recent resumes fetched successfully",
    title: "Success",
    success: true,
  });
});
