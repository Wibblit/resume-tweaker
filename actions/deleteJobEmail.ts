"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";

export const deleteJobEmail = asyncHandler(async (jobEmailId: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!jobEmailId) throw ActionsError.badRequest;

  // await prisma.jobEmails.delete({
  //   where: {
  //     jobId_userId: {
  //       userId: session?.user?.id,
  //       jobId: jobEmailId,
  //     },
  //   },
  // });

  await prisma.jobEmails.update({
    where: {
      jobId_userId: {
        userId: session.user.id,
        jobId: jobEmailId,
      },
    },
    data: {
      isDeleted: true,
    },
  });

  return {
    success: true,
    message: "Successfully deleted the job email",
    status: 200,
  };
});
