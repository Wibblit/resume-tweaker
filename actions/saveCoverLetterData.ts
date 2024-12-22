"use server";

import { auth } from "@/auth";
import { CoverLetterData, CoverLetterState } from "@/types/types";
import { ResumeStyles as CoverStyle } from "@/types/types";
import { prisma } from "@/prisma";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";

export const savecoverData = asyncHandler(
  async (
    coverData: CoverLetterData,
    coverStyles: CoverStyle,
    coverId: string,
  ) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!coverData || !coverStyles || !coverId) throw ActionsError.badRequest;

    const result = await prisma.coverletter.update({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
      data: {
        salutation: coverData.salutation,
        closing: coverData.closing,
        culturalFit: coverData.culturalFit,
        date: coverData.date,
        interestInPosition: coverData.interestInPosition,
        keyAchievements: coverData.keyAchievements,
        opening: coverData.opening,
        professionalSummary: coverData.professionalSummary,
        senderInfo: coverData.senderInfo,
        recipientInfo: coverData.recipientInfo,
        signOff: coverData.signOff,
        subject: coverData.subject,
        styles: JSON.parse(JSON.stringify(coverStyles)),
      },
    });

    if (!result) throw ActionsError.internalServerError;

    return {
      success: true,
      result: result,
      message: "Cover Letter updated successfully",
    };
  },
);
