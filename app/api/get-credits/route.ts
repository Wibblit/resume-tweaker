export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";

export const GET = asyncHandler(
  async (req: NextRequest): Promise<NextResponse> => {
    const session = await auth();

    if (!session || !session.user?.id) {
      throw ApiError.userNotAuthenticated; // Handle unauthenticated users
    }

    let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    if (rateLimiter(session?.user?.id, ip)) {
      return NextResponse.json(
        { message: "Rate limit exceeded." },
        { status: 429 }
      );
    }
    console.log("yos", session?.user?.id);
    const response = await prisma.userAssets.findUnique({
      where: {
        userId: session?.user?.id,
      },
    });
    console.log(`profile : ${response}`);
    return NextResponse.json({
      Credits: response,
      message: "Credits fetched successfully",
    });
  }
);
