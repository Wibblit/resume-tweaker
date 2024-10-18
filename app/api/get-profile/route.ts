import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const prisma = new PrismaClient();
  let result = null;
  try {
    result = await prisma.profile.findUnique({
      where: {
        userId: session?.user?.id,
      },
    });
    console.log("Direct Output", result);
    
  } catch (error) {
    console.error("Error fetching profile data:", error);
    throw error;
  } finally {
    prisma.$disconnect();
  }

  console.log(`profile : ${result}`);
  return NextResponse.json({
    profileData: result,
    message: "Profile fetched successfully",
  });
}
