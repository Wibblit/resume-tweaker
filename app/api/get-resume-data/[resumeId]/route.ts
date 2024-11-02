import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { rateLimiter } from "@/lib/rateLimiter";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  const resumeId = params.resumeId;
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
    result = await prisma.resume.findUnique({
      where: {
        id: resumeId,
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
    resumeData: result,
    message: `Resume data for ID: ${resumeId}`,
  });
}
