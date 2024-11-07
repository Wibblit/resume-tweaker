import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { prisma } from "@/prisma";

export async function GET(req : NextRequest) {
  const session = await auth();
  let result = null;
    let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;  
  try {
     if (rateLimiter(session?.user?.id, ip)) {
       return NextResponse.json(
         { message: "Rate limit exceeded." },
         { status: 429 }
       );
    } 
    if (session?.user?.id) {
      result = await prisma.coverletter.findMany({
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
          coverName: true,
        },
      });
    }
    
  } catch (error) {
    console.error("Error fetching resume data:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }

  console.log(`recent resumes : ${result}`);
  return NextResponse.json({
    recentCoverLetters: result,
    message: "Recent resumes fetched successfully",
  });
}
