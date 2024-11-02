"use server";

import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";

export async function updateProfiles(profileData: {
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
    }
  ];
  projects?: [
    {
      name: string;
      summary: string;
      startDate: string;
      endDate: string;
      url: { href: string; label: string };
      keywords: string[];
    }
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
    }
  ];
  experience?: [
    {
      organization: string;
      role: string;
      startDate: string;
      endDate: string;
      location: string;
      summary: string;
    }
  ];
  languages?: [{ name: string; level: string }];
  volunteer?: [
    {
      organization: string;
      role: string;
      startDate: string;
      endDate: string;
      location: string;
    }
  ];
  awards?: [{ title: string; awarder: string; date: string; summary: string }];
  publications?: [
    {
      name: string;
      publisher: string;
      publishedIn: string;
      url: { href: string; label: string };
      date: string;
    }
  ];
  certifications?: [
    {
      name: string;
      issuer: string;
      date: string;
      url: { href: string; label: string };
    }
  ];
  references?: [{ name: string; phone: string; email: string }];
}) {
  console.log("yop", profileData);
  try {
    const session = await auth();
    let ip = headers().get("x-forwarded-for") || "127.0.0.1";
    ip = ip === "::1" ? "127.0.0.1" : ip;
    console.log(ip, "ip address");
    const ratelimit = rateLimiter(session?.user?.id, ip);

    console.log(ratelimit);
    if (ratelimit) {
      console.log("rate limit exceeded");
      return { message: "Rate limit exceeded.", status: 429 };
    }
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    const userId = session.user.id;

    let profile = await prisma.profile.findUnique({
      where: { userId },
    });

    const updateData = Object.fromEntries(
      Object.entries(profileData).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ])
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

    console.log("Profile updated/created:", profile);

    return {
      success: true,
      message: profile
        ? "Profile updated successfully"
        : "Profile created successfully",
      profile,
    };
  } catch (error) {
    console.error("Error updating/creating profile:", error);
    return {
      success: false,
      message: "Failed to update/create profile",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    await prisma.$disconnect();
  }
  console.log(profileData);
}
