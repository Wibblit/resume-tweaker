"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { Job, JobState } from "@/types/job-tracker";
import { r2Url } from "@/lib/client/Urls";

export const updatedAfter = asyncHandler(async (since: string) => {
  const session = await auth();

  if (!session) throw ActionsError.unauthorizedAction;
  if (!since) throw ActionsError.badRequest;
  console.log("since from after", since);
  async function getJobs(): Promise<Job[]> {
    const jobs = await prisma.jD.findMany({
      where: {
        updatedAt: {
          gt: new Date(since),
        },
      },
    });

    console.log("updatedjobs from after sicne", JSON.stringify(jobs));
    return await Promise.all(
      jobs.map(async (jd) => {
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
          isDeleted: jd.isDeleted,
        };
      })
    );
  }

  async function getEmails(): Promise<Job[]> {
    const emails = await prisma.jobEmails.findMany({
      where: {
        isDeleted: true,
        updatedAt: {
          gt: new Date(since),
        },
      },
    });

    return emails.map((mail) => ({
      id: mail.id,
      jobTitle: mail.jobRole,
      location: mail.location,
      companyName: mail.companyName,
      logoSrc: null,
      jobDescription: mail.description,
      employmentType: "",
      workType: mail.workType,
      salaryRange: "",
      state: mail.jobState as JobState,
      addedOn: mail.createdAt.toISOString(),
      url: "",
      source: "email",
      meetingUrl: mail.meetingUrl,
      status: "old" as const,
      isDeleted: mail.isDeleted,
    }));
  }

  const [jobs, emails] = await Promise.all([getJobs(), getEmails()]);

  if (jobs.length === 0 && emails.length === 0) {
    return {
      success: true,
      data: { jobs, emails },
      message: "No updates since last sync",
      status: 200,
    };
  }

  return {
    success: true,
    data: {
      jobs,
      emails,
    },
    message: "Successfully fetched the updates",
    status: 200,
  };
});
