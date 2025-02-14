"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const renameResume = asyncHandler(
  async (name: string, resumeId: string) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!name || !resumeId) throw ActionsError.badRequest;

    const updatedResume = await prisma.resume.updateMany({
      where: {
        id: resumeId,
        userId: session?.user?.id,
      },
      data: {
        resumeName: name,
      },
    });

    if (updatedResume.count === 0)
      throw ActionsError.custom(
        "Resume not found or you're not authorized to update this resume.",
        404,
      );
    revalidatePath("/home", "page");
    return {
      success: true,
      message: "Resume renamed successfully",
      updatedResume,
      status: 200,
    };
  },
);
