import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { initialState } from "@/slices/profileSlice";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;
  let result = null;
  if (session?.user?.id) {
    try {
      if (rateLimiter(session?.user?.id, ip)) {
        return NextResponse.json(
          { message: "Rate limit exceeded." },
          { status: 429 }
        );
      }
      result = await prisma.profile.findUnique({
        where: {
          userId: session?.user?.id,
        },
      });
      //console.log("Direct Output", result);
    } catch (error) {
      console.error("Error fetching profile data:", error);
      throw error;
    } finally {
      prisma.$disconnect();
    }
    //console.log(`profile : ${result}`);
    return NextResponse.json({
      profileData: result?.id ? result : initialState,
      message: "Profile fetched successfully",
    });
  }
  //console.log(`profile : ${result}`);
  return NextResponse.json({
    profileData: initialState,
    message: "Profile fetched successfully",
  });
}
