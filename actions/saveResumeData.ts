// "use server";

// import { auth } from "@/auth";
// import { ResumeData, ResumeStyles } from "@/types/types";
// import { rateLimiter } from "@/lib/rateLimiter";
// import { headers } from "next/headers";

// import { prisma } from "@/prisma";

// export async function saveResumeData(
//   resumeData: ResumeData,
//   resumeStyles: ResumeStyles,
//   resumeId: string
// ) {
//   const session = await auth();
//   console.log(resumeStyles)
//   console.log("Save data request reached...");

//   try {

//     let ip = headers().get("x-forwarded-for") || "127.0.0.1";
//     ip = ip === "::1" ? "127.0.0.1" : ip;
//     console.log(ip, "ip address");
//     const ratelimit = rateLimiter(session?.user?.id, ip);

//     console.log(ratelimit);
//     if (ratelimit) {
//       console.log("rate limit exceeded");
//       return { message: "Rate limit exceeded.", status: 429 };
//     }

//     const parsedProfiles = JSON.parse(JSON.stringify(resumeData.profiles));
//     const parsedBasics = JSON.parse(JSON.stringify(resumeData.basics));
//     const parsedSummary = JSON.parse(JSON.stringify(resumeData.summary));
//     const parsedSkills = JSON.parse(JSON.stringify(resumeData.skills));
//     const parsedExperience = JSON.parse(JSON.stringify(resumeData.experience));
//     const parsedProjects = JSON.parse(JSON.stringify(resumeData.projects));
//     const parsedCertifications = JSON.parse(JSON.stringify(resumeData.certifications));
//     const parsedEducation = JSON.parse(JSON.stringify(resumeData.education));
//     const parsedAwards = JSON.parse(JSON.stringify(resumeData.awards));
//     const parsedReferences = JSON.parse(JSON.stringify(resumeData.references));
//     const parsedLanguages = JSON.parse(JSON.stringify(resumeData.languages));
//     const parsedPublications = JSON.parse(JSON.stringify(resumeData.publications));
//     const parsedVolunteer = JSON.parse(JSON.stringify(resumeData.volunteer));

//     const result = await prisma.resume.update({
//       where: {
//         id: resumeId,
//         userId: session?.user?.id,
//       },
//       data: {
//         basics: parsedBasics,
//         summary: parsedSummary,
//         profiles: parsedProfiles,
//         skills: parsedSkills,
//         experience: parsedExperience,
//         projects: parsedProjects,
//         certifications: parsedCertifications,
//         education: parsedEducation,
//         awards: parsedAwards,
//         references: parsedReferences,
//         languages: parsedLanguages,
//         publications: parsedPublications,
//         volunteer: parsedVolunteer,
//         styles: JSON.parse(JSON.stringify(resumeStyles)),
//       },
//     });

//     return {
//       success: true,
//       result: result,
//       message: "Resume updated successfully",
//     };
//   } catch (error) {
//     let errorMessage = "An unknown error occurred";

//     if (error instanceof Error) {
//       errorMessage = error.message;
//     }

//     return {
//       success: false,
//       message: "Failed to update resume details",
//       error: errorMessage,
//     };
//   } finally {
//     await prisma.$disconnect();
//   }
// }

"use server";

import { auth } from "@/auth";
import { ResumeData, ResumeStyles } from "@/types/types";
import { prisma } from "@/prisma";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";

export const saveResumeData = asyncHandler(
  async (
    resumeData: ResumeData,
    resumeStyles: ResumeStyles,
    resumeId: string,
  ) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!resumeData || !resumeStyles || !resumeId)
      throw ActionsError.badRequest;

    // Parse the main sections
    const parsedBasics = JSON.parse(JSON.stringify(resumeData.basics || []));
    const parsedSummary = JSON.parse(JSON.stringify(resumeData.summary || []));
    const parsedProfiles = JSON.parse(
      JSON.stringify(resumeData.profiles || []),
    );
    const parsedSkills = JSON.parse(JSON.stringify(resumeData.skills || []));
    const parsedExperience = JSON.parse(
      JSON.stringify(resumeData.experience || []),
    );
    const parsedProjects = JSON.parse(
      JSON.stringify(resumeData.projects || []),
    );
    const parsedCertifications = JSON.parse(
      JSON.stringify(resumeData.certifications || []),
    );
    const parsedEducation = JSON.parse(
      JSON.stringify(resumeData.education || []),
    );
    const parsedAwards = JSON.parse(JSON.stringify(resumeData.awards || []));
    const parsedReferences = JSON.parse(
      JSON.stringify(resumeData.references || []),
    );
    const parsedLanguages = JSON.parse(
      JSON.stringify(resumeData.languages || []),
    );
    const parsedPublications = JSON.parse(
      JSON.stringify(resumeData.publications || []),
    );
    const parsedVolunteer = JSON.parse(
      JSON.stringify(resumeData.volunteer || []),
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

    // Update the resume in the database
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
        custom: parsedCustomData, // Make sure this is included
        styles: JSON.parse(JSON.stringify(resumeStyles)),
      },
    });

    return {
      success: true,
      result,
      message: "Resume updated successfully",
    };
  },
);
