import AIReview from "@/components/AIReview/AiReview";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

import { Metadata } from "next";
export const metadata : Metadata = {
  title: "AI Review"
}

export default async function AIReviewPage() {
  const session = await auth();
  if (!session?.user) return redirect("/login?callbackUrl=/home/ai-review");

  const result = await prisma.resume.findMany({
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
      updatedOn: true,
    },
  });
  await prisma.$disconnect();

  return <AIReview recentResumes={result} />;
}
