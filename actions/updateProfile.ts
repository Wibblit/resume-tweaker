"use server";

import { auth } from "@/auth";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const updateProfiles = asyncHandler(
  async (profileData: {
    basics?: {
      name: string;
      email: string;
      phone: string;
      location: string;
      headLine: string;
      picture: string;
      website: string;
    }[];
    summary?: { content: string }[];
    profiles?: { url: { href: string; label: string } }[];
    skills?: [
      {
        id: string;
        categories: {
          id: string;
          name: string;
          skills: { name: string; level: string }[];
        };
      },
    ];
    projects?: [
      {
        name: string;
        summary: string;
        startDate: string;
        endDate: string;
        url: { href: string; label: string };
        keywords: string[];
      },
    ];
    education?: [
      {
        institution: string;
        degree: string;
        field: string;
        specialization: string;
        startDate: string;
        endDate: string;
        score: string;
      },
    ];
    experience?: [
      {
        organization: string;
        role: string;
        startDate: string;
        endDate: string;
        location: string;
        summary: string;
      },
    ];
    languages?: [{ name: string; level: string }];
    volunteer?: [
      {
        organization: string;
        role: string;
        startDate: string;
        endDate: string;
        location: string;
      },
    ];
    awards?: [
      { title: string; awarder: string; date: string; summary: string },
    ];
    publications?: [
      {
        name: string;
        publisher: string;
        publishedIn: string;
        url: { href: string; label: string };
        date: string;
      },
    ];
    certifications?: [
      {
        name: string;
        issuer: string;
        date: string;
        url: { href: string; label: string };
      },
    ];
    references?: [{ name: string; phone: string; email: string }];
  }) => {
    const session = await auth();
    if (!session || !session?.user?.id) throw ActionsError.userNotAuthenticated;
    if (!profileData) throw ActionsError.badRequest;

    const userId = session.user.id;

    let profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const updateData = Object.fromEntries(
      Object.entries(profileData).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]),
    );

    if (profile) {
      profile = await prisma.profile.update({
        where: { userId },
        data: {
          userId: userId,
          basics: profileData.basics,
          summary: profileData.summary,
          profiles: profileData.profiles,
          skills: profileData.skills,
          projects: profileData.projects,
          education: profileData.education,
          experience: profileData.experience,
          languages: profileData.languages,
          volunteer: profileData.volunteer,
          awards: profileData.awards,
          publications: profileData.publications,
          certifications: profileData.certifications,
          references: profileData.references,
        },
      });
    } else {
      profile = await prisma.profile.create({
        data: {
          userId: userId,
          basics: profileData.basics,
          summary: profileData.summary,
          profiles: profileData.profiles,
          skills: profileData.skills,
          projects: profileData.projects,
          education: profileData.education,
          experience: profileData.experience,
          languages: profileData.languages,
          volunteer: profileData.volunteer,
          awards: profileData.awards,
          publications: profileData.publications,
          certifications: profileData.certifications,
          references: profileData.references,
        },
      });
    }
    revalidatePath("/profile", "page");
    return {
      success: true,
      message: profile
        ? "Profile updated successfully"
        : "Profile created successfully",
      profile,
    };
  },
);
