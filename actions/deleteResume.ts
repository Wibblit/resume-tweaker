"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const deleteResume = asyncHandler(async (resumeId: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!resumeId) throw ActionsError.badRequest;
  await prisma.resume.deleteMany({
    where: {
      id: resumeId,
      userId: session?.user?.id,
    },
  });
  revalidatePath("/home", "page");
  return { success: true, message: "Successfully deleted the resume" };
});
