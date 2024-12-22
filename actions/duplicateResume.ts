"use server";
import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const duplicateResume = asyncHandler(async (resumeId: string) => {
  const session = await auth();

  if (!session || !session.user?.id) throw ActionsError.userNotAuthenticated;
  if (!resumeId) throw ActionsError.badRequest;

  const originalResume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId: session.user.id,
    },
  });

  if (!originalResume)
    throw ActionsError.custom(
      "Resume not found or you're not authorized to duplicate this resume.",
      404,
    );

  const parsedProfiles = JSON.parse(JSON.stringify(originalResume.profiles));
  const parsedBasics = JSON.parse(JSON.stringify(originalResume.basics));
  const parsedSummary = JSON.parse(JSON.stringify(originalResume.summary));
  const parsedSkills = JSON.parse(JSON.stringify(originalResume.skills));
  const parsedExperience = JSON.parse(
    JSON.stringify(originalResume.experience),
  );
  const parsedProjects = JSON.parse(JSON.stringify(originalResume.projects));
  const parsedCertifications = JSON.parse(
    JSON.stringify(originalResume.certifications),
  );
  const parsedEducation = JSON.parse(JSON.stringify(originalResume.education));
  const parsedAwards = JSON.parse(JSON.stringify(originalResume.awards));
  const parsedReferences = JSON.parse(
    JSON.stringify(originalResume.references),
  );
  const parsedLanguages = JSON.parse(JSON.stringify(originalResume.languages));
  const parsedPublications = JSON.parse(
    JSON.stringify(originalResume.publications),
  );
  const parsedVolunteer = JSON.parse(JSON.stringify(originalResume.volunteer));
  const parsedStyles = JSON.parse(JSON.stringify(originalResume.styles));
  const parsedCustom = JSON.parse(JSON.stringify(originalResume.custom));

  const duplicatedResume = await prisma.resume.create({
    data: {
      userId: originalResume.userId,
      resumeName: `${originalResume.resumeName} (Copy)`,
      basics: parsedBasics,
      summary: parsedSummary,
      profiles: parsedProfiles,
      skills: parsedSkills,
      projects: parsedProjects,
      education: parsedEducation,
      experience: parsedExperience,
      languages: parsedLanguages,
      volunteer: parsedVolunteer,
      awards: parsedAwards,
      publications: parsedPublications,
      certifications: parsedCertifications,
      references: parsedReferences,
      custom: parsedCustom,
      styles: parsedStyles,
    },
  });
  revalidatePath("/home", "page");
  return { message: "Resume duplicated successfully", duplicatedResume };
});
