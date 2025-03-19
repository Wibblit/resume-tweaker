"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { Job } from "@/types/job-tracker";
import { prisma } from "@/prisma";
import r2Storage from "@/lib/client/r2JD";

export const updateJD = asyncHandler(
  async (updatedJobs: Job[], newJobs: Job[]) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!updatedJobs && !newJobs) throw ActionsError.badRequest; // Ensure at least one of the lists is provided

    const userId = session.user.id;

    // Process both updated and new jobs in a single loop
    const processJobs = async (jobs: Job[], isUpdate: boolean) => {
      for (const job of jobs) {
        if (isUpdate) {
          await prisma.jD.update({
            where: { id: job.id },
            data: {
              userId,
              companyName: job.companyName,
              employmentType: job.employmentType,
              jobTitle: job.jobTitle,
              location: job.location,
              logoSrc: job.logoSrc || "",
              salaryRange: job.salaryRange,
              source: job.source,
              state: job.state,
              workType: job.workType,
              url: job.url || "",
            },
          });
        } else {
          const { fileName: r2FileName } = await r2Storage.uploadText(
            job.jobDescription
          );
          await prisma.jD.create({
            data: {
              id: job.id,
              userId,
              companyName: job.companyName,
              employmentType: job.employmentType,
              jobTitle: job.jobTitle,
              location: job.location,
              logoSrc: job.logoSrc || "",
              salaryRange: job.salaryRange,
              source: job.source,
              state: job.state,
              workType: job.workType,
              url: job.url || "",
              r2FileName,
            },
          });
        }
      }
    };
    const jobPromises: Promise<void>[] = [];

    if (updatedJobs.length > 0) {
      jobPromises.push(processJobs(updatedJobs, true));
    }

    if (newJobs.length > 0) {
      jobPromises.push(processJobs(newJobs, false));
    }

    await Promise.all(jobPromises);
    return {
      success: true,
      message: "Successfully updated the job data",
      status: 200,
    };
  }
);
