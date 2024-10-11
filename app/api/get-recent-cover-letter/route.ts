import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const prisma = new PrismaClient();
  let result = null;
  try {
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
