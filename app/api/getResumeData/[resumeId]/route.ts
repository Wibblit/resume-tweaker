import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  const resumeId = params.resumeId;
  const session = await auth();
  let result = null;
  try {
    result = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session?.user?.id,
      },
    });
  } catch (error) {
    console.error("Error fetching resume data:", error);
  } finally {
    prisma.$disconnect();
  }

  console.log(`Fetched data : ${result}`);

  return NextResponse.json({
    resumeData: result,
    message: `Resume data for ID: ${resumeId}`,
  });
}
