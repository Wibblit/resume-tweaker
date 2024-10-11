import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { coverId: string } }
) {
  const coverId = params.coverId;
  const session = await auth();
  let result = null;
  try {
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
