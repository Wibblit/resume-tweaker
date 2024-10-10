"use server";

import { auth } from "@/auth";
import { ResumeData, ResumeStyles } from "@/types/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function saveResumeData(
  resumeData: ResumeData,
  resumeStyles: ResumeStyles,
  resumeId: string
) {
  const session = await auth();
  console.log("Save data request reached...");

  try {
 
    const parsedProfiles = JSON.parse(JSON.stringify(resumeData.profiles));
    const parsedBasics = JSON.parse(JSON.stringify(resumeData.basics));
    const parsedSummary = JSON.parse(JSON.stringify(resumeData.summary));
    const parsedSkills = JSON.parse(JSON.stringify(resumeData.skills));
    const parsedExperience = JSON.parse(JSON.stringify(resumeData.experience));
    const parsedProjects = JSON.parse(JSON.stringify(resumeData.projects));
    const parsedCertifications = JSON.parse(JSON.stringify(resumeData.certifications));
    const parsedEducation = JSON.parse(JSON.stringify(resumeData.education));
    const parsedAwards = JSON.parse(JSON.stringify(resumeData.awards));
    const parsedReferences = JSON.parse(JSON.stringify(resumeData.references));
    const parsedLanguages = JSON.parse(JSON.stringify(resumeData.languages));
    const parsedPublications = JSON.parse(JSON.stringify(resumeData.publications));
    const parsedVolunteer = JSON.parse(JSON.stringify(resumeData.volunteer));

    const result = await prisma.resume.update({
      where: {
        id: resumeId,
        userId: session?.user?.id,
      },
      data: {
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
        styles: JSON.parse(JSON.stringify(resumeStyles)),
      },
    });

    return {
      success: true,
      result: result,
      message: "Resume updated successfully",
    };
  } catch (error) {
    let errorMessage = "An unknown error occurred";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return {
      success: false,
      message: "Failed to update resume details",
      error: errorMessage,
    };
  } finally {
    await prisma.$disconnect();
  }
}