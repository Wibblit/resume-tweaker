"use server";
import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function duplicateCoverLetter(coverId: string) {
  const session = await auth();

  try {
    if (!session || !session.user?.id) {
      throw new Error("Unauthorized");
    }

    const originalCoverLetter = await prisma.coverletter.findFirst({
      where: {
        id: coverId,
        userId: session.user.id,
      },
    });

    if (!originalCoverLetter) {
      throw new Error(
        "Cover letter not found or you're not authorized to duplicate this cover letter."
      );
    }

    const parsedStyles = JSON.parse(JSON.stringify(originalCoverLetter.styles));

    const duplicatedCoverLetter = await prisma.coverletter.create({
      data: {
        userId: originalCoverLetter.userId,
        coverName: `${originalCoverLetter.coverName} (Copy)`,
        closing: originalCoverLetter.closing,
        culturalFit: originalCoverLetter.culturalFit,
        date: originalCoverLetter.date,
        interestInPosition: originalCoverLetter.interestInPosition,
        keyAchievements: originalCoverLetter.keyAchievements,
        opening: originalCoverLetter.opening,
        professionalSummary: originalCoverLetter.professionalSummary,
        recipientInfo: originalCoverLetter.recipientInfo,
        salutation: originalCoverLetter.salutation,
        signOff: originalCoverLetter.signOff,
        subject: originalCoverLetter.subject,
        styles: parsedStyles,
      },
    });

    return { message: "Cover Letter duplicated successfully", duplicatedCoverLetter };
  } catch (error) {
    console.error("Error duplicating cover letter:", error);
    throw new Error("Failed to duplicate cover letter. Please try again later.");
  } finally {
    await prisma.$disconnect();
  }
}
