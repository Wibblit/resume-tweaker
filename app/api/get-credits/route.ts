import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user?.id) {
    throw ApiError.userNotAuthenticated; // Handle unauthenticated users
  }

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  console.log("Session", session);
  if (session?.user?.id) {
    try {
      if (rateLimiter(session?.user?.id, ip)) {
        return NextResponse.json(
          { message: "Rate limit exceeded." },
          { status: 429 }
        );
      }
      console.log("yos", session?.user?.id)
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
    } catch (error) {
      console.error("Error fetching credits:", error);
      throw error;
    } finally {
      prisma.$disconnect();
    }
  }
}
