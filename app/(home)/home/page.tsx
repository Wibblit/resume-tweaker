import Home from "@/components/Home/Home";
import { auth } from "@/auth";
import { prisma } from "@/prisma";
import { rateLimiter } from "@/lib/rateLimiter";
import { cache } from "react";

export async function generateStaticParams() {
  const [resumes, letters] = await Promise.all([getResumes(), getLetters()]);
  const data = [...resumes, ...letters];
  return data.map((item) => ({
    id: item.id,
    userId: item.userId,
    name: "resumeName" in item ? item.resumeName : item.coverName,
  }));
}

export default async function HomePage() {
  const session = await auth();

  const [resumes, letters] = await Promise.all([getResumes(), getLetters()]);

  if (!session?.user) return <div>Loading</div>;

  return <Home resumes={resumes} letters={letters} />;
}

const getResumes = cache(async () => {
  const session = await auth();
  let result = null;

  result = await prisma.resume.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      id: "desc",
    },
    take: 3,
    select: {
      id: true,
      userId: true,
      resumeName: true,
    },
  });
  await prisma.$disconnect();
  return result || [];
});

const getLetters = cache(async () => {
  const session = await auth();
  let result = null;

  result = await prisma.coverletter.findMany({
    where: {
      userId: session?.user?.id,
    },
    orderBy: {
      id: "desc",
    },
    take: 3,
    select: {
      id: true,
      userId: true,
      coverName: true,
    },
  });
  await prisma.$disconnect();
  return result || [];
});
