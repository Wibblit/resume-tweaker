import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { coverId: string } }
) {
  const coverId = params.coverId;
  const session = await auth();
    let ip = request.ip || request.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;  
  let result = null;
  try {
    if (rateLimiter(session?.user?.id, ip)) {
      return NextResponse.json(
        { message: "Rate limit exceeded." },
        { status: 429 }
      );
    } 
    result = await prisma.coverletter.findUnique({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
    });
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }

  console.log(`Fetched data : ${result}`);

  return NextResponse.json({
    coverData: result,
    message: `Resume data for ID: ${coverId}`,
  });
}
