"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { Job } from "@/types/job-tracker";

export const updateJobState = asyncHandler(async (job: Job) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!job) throw ActionsError.badRequest;

  const userId = session.user.id;

  if (job.source === "email") {
    await prisma.jobEmails.update({
      where: {
        jobId_userId: {
          jobId: job.id,
          userId: userId,
        },
      },
      data: {
        jobState: job.state,
      },
    });

    return {
      success: true,
      message: "Successfully updated the job state",
      status: 200,
    };
  }

  console.log("job state", job.state);

  await prisma.jD.update({
    where: { id: job.id },
    data: {
      state: job.state,
    },
  });

  return {
    success: true,
    message: "Successfully updated the job state",
    status: 200,
  };
});
