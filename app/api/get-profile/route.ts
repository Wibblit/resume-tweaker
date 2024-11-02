import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { initialState } from "@/slices/profileSlice";

export async function GET() {
  const session = await auth();
  const prisma = new PrismaClient();
  let result = null;
  if (session?.user?.id) {
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
       profileData: result?.id ? result : initialState,
       message: "Profile fetched successfully",
     });
  }
  console.log(`profile : ${result}`);
  return NextResponse.json({
    profileData: initialState,
    message: "Profile fetched successfully",
  });
}
