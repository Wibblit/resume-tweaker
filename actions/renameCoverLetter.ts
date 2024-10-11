"use server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function renameCoverLetter(name: string, coverId: string) {
  try {
    // Retrieve the authenticated user session
    const session = await auth();
    const updatedCoverLetter = await prisma.coverletter.updateMany({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
      data: {
        coverName: name,
      },
    });

    if (updatedCoverLetter.count === 0) {
      throw new Error(
        "Resume not found or you're not authorized to update this resume."
      );
    }

    return { message: "Cover letter renamed successfully", updatedCoverLetter };
  } catch (error) {
    console.error("Error renaming cover letter:", error);
    throw new Error("Failed to rename cover letter. Please try again later.");
  } finally {
    await prisma.$disconnect();
  }
}
