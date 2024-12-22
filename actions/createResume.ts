"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";

export const createResume = asyncHandler(async (resumeName: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!resumeName) throw ActionsError.badRequest;

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      resumeName: resumeName,
    },
  });

  revalidatePath("/home", "page");

  return {
    success: true,
    message: "Resume created successfully",
    resume,
  };
});
