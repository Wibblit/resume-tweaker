
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { rateLimiter } from "@/lib/rateLimiter";
import { auth } from "@/auth";

export async function GET(req: NextRequest) {
  
    const session = await auth();
    let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip; 

  try {
    if (rateLimiter(session?.user?.id, ip)) {
      return NextResponse.json(
        { message: "Rate limit exceeded." },
        { status: 429 }
      );
    } 
    const blogs = await prisma.blog.findMany({
      where: {
        isFeatured: true, // Fetch only featured blogs
      },
    });
    return NextResponse.json(blogs);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
