"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";

export const getUserData = asyncHandler(async () => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const coverLetters = await prisma.coverletter.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return {
    resumes: resumes || [],
    coverLetters: coverLetters || [],
  };
});
