"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";

export const renameCoverLetter = asyncHandler(
  async (name: string, coverId: string) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!name || !coverId) throw ActionsError.badRequest;

    const updatedCoverLetter = await prisma.coverletter.updateMany({
      where: {
        id: coverId,
        userId: session?.user?.id,
      },
      data: {
        coverName: name,
      },
    });

    if (updatedCoverLetter.count === 0)
      throw ActionsError.custom(
        "Resume not found or you're not authorized to update this resume.",
        404,
      );
    revalidatePath("/home", "page");
    return {
      message: "Cover letter renamed successfully",
      updatedCoverLetter,
      status: 200,
    };
  },
);
