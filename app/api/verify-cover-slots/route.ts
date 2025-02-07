import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";

export const GET = asyncHandler(async (req: NextRequest) => {
  const session = await auth();

  if (!session || !session?.user?.id) throw ApiError.userNotAuthenticated;

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (rateLimiter(session?.user?.id, ip)) throw ApiError.rateLimitExceeded;

  const cover = await prisma.coverletter.count({
    where: {
      userId: session?.user?.id,
    },
  });

  const data = await prisma?.userAssets.findUnique({
    where: {
      userId: session?.user?.id,
    },
  });

  if (!data) {
    return NextResponse.json({
      success: false,
      message: "User assets not found.",
    });
  }

  return NextResponse.json({
    success: true,
    slotVerify: data?.coverslot < cover + 1,
  });
});
