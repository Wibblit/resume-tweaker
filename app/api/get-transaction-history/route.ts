import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
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
      result = await prisma.payment.findMany({
        where: {
          userId: session?.user?.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } catch (error) {
      console.error("Error fetching transaction history:", error);
      throw error;
    } finally {
      prisma.$disconnect();
    }
    console.log(`profile : ${result}`);
    return NextResponse.json({
      History: result,
      message: "Transaction history fetched successfully",
    });
  }
  console.log(`History : ${result}`);
  return NextResponse.json({
    History: result,
    message: "Transaction history fetched successfully",
  });
}
