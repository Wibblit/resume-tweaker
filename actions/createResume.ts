"use server";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { ResumeData, ResumeStyles } from "@/types/types";

export const createResume = asyncHandler(async (resumeName: string) => {
  const session = await auth();
  if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
  if (!resumeName) throw ActionsError.badRequest;

  const resume = await prisma.resume.create({
    data: {
      userId: session.user.id,
      resumeName: resumeName,
    },
  });

  revalidatePath("/home", "page");

  return {
    success: true,
    message: "Resume created successfully",
    resume,
    status: 200,
  };
});

const createResumeWithData = asyncHandler(
  async ({
    resumeData,
    resumeStyles,
    resumeName,
  }: {
    resumeData: ResumeData;
    resumeStyles: ResumeStyles;
    resumeName: string;
  }) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!resumeData && !resumeName) throw ActionsError.badRequest;

    const parsedBasics = JSON.parse(JSON.stringify(resumeData.basics || []));
    const parsedSummary = JSON.parse(JSON.stringify(resumeData.summary || []));
    const parsedProfiles = JSON.parse(
      JSON.stringify(resumeData.profiles || [])
    );
    const parsedSkills = JSON.parse(JSON.stringify(resumeData.skills || []));
    const parsedExperience = JSON.parse(
      JSON.stringify(resumeData.experience || [])
    );
    const parsedProjects = JSON.parse(
      JSON.stringify(resumeData.projects || [])
    );
    const parsedCertifications = JSON.parse(
      JSON.stringify(resumeData.certifications || [])
    );
    const parsedEducation = JSON.parse(
      JSON.stringify(resumeData.education || [])
    );
    const parsedAwards = JSON.parse(JSON.stringify(resumeData.awards || []));
    const parsedReferences = JSON.parse(
      JSON.stringify(resumeData.references || [])
    );
    const parsedLanguages = JSON.parse(
      JSON.stringify(resumeData.languages || [])
    );
    const parsedPublications = JSON.parse(
      JSON.stringify(resumeData.publications || [])
    );
    const parsedVolunteer = JSON.parse(
      JSON.stringify(resumeData.volunteer || [])
    );

    // Handle custom sections dynamically
    const customSections = [
      "basics",
      "summary",
      "profiles",
      "skills",
      "experience",
      "projects",
      "certifications",
      "education",
      "awards",
      "references",
      "languages",
      "publications",
      "volunteer",
    ];

    const parsedCustomData = Object.keys(resumeData)
      .filter((key) => !customSections.includes(key))
      .reduce((acc: Record<string, any>, key) => {
        //@ts-ignore
        acc[key] = JSON.parse(JSON.stringify(resumeData[key] || []));
        return acc;
      }, {});

    const updateData: any = {
      userId: session.user.id,
      resumeName: resumeName,
      basics: parsedBasics,
      summary: parsedSummary,
      profiles: parsedProfiles,
      skills: parsedSkills,
      experience: parsedExperience,
      projects: parsedProjects,
      certifications: parsedCertifications,
      education: parsedEducation,
      awards: parsedAwards,
      references: parsedReferences,
      languages: parsedLanguages,
      publications: parsedPublications,
      volunteer: parsedVolunteer,
      custom: parsedCustomData,
      styles: resumeStyles,
    };

    const resume = await prisma.resume.create({
      data: updateData,
    });

    return {
      success: true,
      message: "Resume created successfully",
      resumeId: resume.id,
      status: 200,
    };
  }
);

export { createResumeWithData };
