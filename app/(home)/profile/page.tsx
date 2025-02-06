import Profile from "@/components/ProfilePage";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { cache } from "react";
import { ResumeData } from "@/types/types";
import { getPaymentStatus } from "@/actions/payments/getPaymentStatus";

export async function generateStaticParams() {
  // Fetch the profile data for the authenticated user
  const profileData = (await getProfileData()) as ResumeData;

  if (!profileData) {
    return [];
  }

  // Map the profile data to the required structure
  return [
    {
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
  ];
}

export default async function ProfilePage() {
  const profileData = (await getProfileData()) as ResumeData;
  return <Profile profData={profileData} />;
}

const getProfileData = cache(async () => {
  const session = await auth();

  if (!session?.user?.id) {
    return null; // Return null if the user is not authenticated
  }

  const result = await prisma.profile.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  await prisma.$disconnect();

  return result || {};
});
