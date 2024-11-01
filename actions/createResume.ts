"use server"
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { headers } from "next/headers";

const prisma = new PrismaClient();

export async function createResume(resumeName: string) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    

    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    const resume = await prisma.resume.create({
      data: {
        userId: session.user.id,
        resumeName: resumeName,
      },
    });

    return {
      success: true,
      message: "Resume created successfully",
      resume,
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: "Failed to create resume",
      error: errorMessage,
    };
  } finally {
    await prisma.$disconnect();
  }
}