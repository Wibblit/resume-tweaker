import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { initialState } from "@/slices/profileSlice";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

export const GET = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session || !session?.user?.id) throw ApiError.userNotAuthenticated;

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;
  let result = null;
  if (rateLimiter(session?.user?.id, ip)) throw ApiError.rateLimitExceeded;

  result = await prisma.profile.findUnique({
    where: {
      userId: session?.user?.id,
    },
  });
  console.log("Direct Output", result);

  if (!result) throw ApiError.resourceNotFound;

  console.log(`profile : ${result}`);
  return NextResponse.json({
    profileData: result?.id ? result : initialState,
    message: "Profile fetched successfully",
  });
});
