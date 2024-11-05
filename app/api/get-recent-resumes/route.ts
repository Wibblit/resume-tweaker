import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";

export async function GET(req : NextRequest) {
  const session = await auth()
    let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;  
    const prisma = new PrismaClient()
    let result = null;
  try {
      if (rateLimiter(session?.user?.id, ip)) {
        return NextResponse.json(
          { message: "Rate limit exceeded." },
          { status: 429 }
        );
    } 
    if (session?.user?.id) {
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
    }
           
    } catch (error) {
        console.error("Error fetching resume data:", error);
        throw error;
    } finally {
        prisma.$disconnect()
    }
    
    console.log(`recent resumes : ${result}`);
    return NextResponse.json({
        recentResumes: result,
        message: "Recent resumes fetched successfully"
    })
}