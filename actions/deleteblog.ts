"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";

export const deleteBlog = asyncHandler(async (slug: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!slug) throw ActionsError.badRequest;
  if (session.user.email !== process.env.ADMIN_EMAIL)
    throw ActionsError.unauthorizedAction;
  await prisma.blog.deleteMany({
    where: {
      slug: slug,
    },
  });
  return { success: true, message: "Successfully deleted the resume" };
});
