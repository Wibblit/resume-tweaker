"use server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";

export const createCover = asyncHandler(async (coverName: string) => {
  const session = await auth();

  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!coverName) throw ActionsError.badRequest;

  const cover = await prisma.coverletter.create({
    data: {
      userId: session.user.id.toString(),
      coverName: coverName.toString(),
    },
  });

  revalidatePath("/home", "page");
  return {
    success: true,
    message: "Resume created successfully",
    cover,
    status: 200,
  };
});
