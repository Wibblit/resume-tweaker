"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";

export const deleteJD = asyncHandler(async (jobId: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!jobId) throw ActionsError.badRequest;

  const { jdUrl } = await prisma.jD.delete({
    where: {
      id: jobId,
      userId: session?.user?.id,
    },
    select:{
        jdUrl: true,
    }
  });

  //delete the JD from r2 using jdUrl

  return {
    success: true,
    message: "Successfully deleted the job email",
    status: 200,
  };
});
