"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const deleteCoverLetter = asyncHandler(async (coverId: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!coverId) throw ActionsError.badRequest;

  await prisma.coverletter.deleteMany({
    where: {
      id: coverId,
      userId: session?.user?.id,
    },
  });
  revalidatePath("/home", "page");
  return {
    success: true,
    message: "Successfully deleted the cover letter",
    status: 200,
  };
});
