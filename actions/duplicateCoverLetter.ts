"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";

export const duplicateCoverLetter = asyncHandler(async (coverId: string) => {
  const session = await auth();

  if (!session || !session?.user || !session?.user?.id)
    ActionsError.userNotAuthenticated;
  if (!coverId) ActionsError.badRequest;

  const originalCoverLetter = await prisma.coverletter.findFirst({
    where: {
      id: coverId,
      userId: session?.user?.id,
    },
  });

  if (!originalCoverLetter)
    throw ActionsError.custom(
      "Cover letter not found or you're not authorized to duplicate this cover letter.",
      404,
    );

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
      senderInfo: originalCoverLetter.senderInfo,
      signOff: originalCoverLetter.signOff,
      subject: originalCoverLetter.subject,
      styles: parsedStyles,
    },
  });

  revalidatePath("/home", "page");

  return {
    message: "Cover Letter duplicated successfully",
    duplicatedCoverLetter,
  };
});
