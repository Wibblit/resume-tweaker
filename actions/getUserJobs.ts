"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { r2Url } from "@/lib/client/Urls";
import { prisma } from "@/prisma";
import { Job, JobState } from "@/types/job-tracker";

export const getUserJobs = asyncHandler(async () => {
  const session = await auth();
  if (!session) throw ActionsError.unauthorizedAction;
  const userId = session?.user.id;

  const [jds, jobEmails] = await Promise.all([
    prisma.jD.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    }),
    prisma.jobEmails.findMany({
      where: {
        userId: userId,
        isDeleted: false,
      },
    }),
  ]);

  async function getJobData() {
    const jobData: Job[] = await Promise.all(
      jds.map(async (jd) => {
        const res = await fetch(r2Url + jd.r2FileName);
        const jobDescription = await res.text();

        return {
          id: jd.id,
          jobTitle: jd.jobTitle,
          location: jd.location,
          companyName: jd.companyName,
          logoSrc: jd.logoSrc || null,
          jobDescription,
          employmentType: jd.employmentType,
          workType: jd.workType,
          salaryRange: jd.salaryRange,
          state: jd.state as JobState,
          addedOn: jd.addedOn,
          url: jd.url,
          source: jd.source,
          status: "old" as const,
        };
      })
    );

    return jobData;
  }
  async function getEmailData() {
    return jobEmails.map((mail) => ({
      id: mail.jobId,
      jobTitle: mail.jobRole,
      location: mail.location,
      companyName: mail.companyName,
      logoSrc: null,
      jobDescription: mail.description,
      employmentType: "",
      workType: mail.workType,
      salaryRange: "",
      addedOn: mail.createdAt.toString(),
      meetingUrl: mail.meetingUrl,
      url: "",
      source: "email",
      state: mail.jobState as JobState,
      status: "old" as const,
    }));
  }

  const [jobData, jobEmailData] = await Promise.all([
    getJobData(),
    getEmailData(),
  ]);

  return {
    success: true,
    message: "Successfully fetch the user backup data",
    data: {
      jobData,
      jobEmailData,
    },
    status: 200,
  };
});
