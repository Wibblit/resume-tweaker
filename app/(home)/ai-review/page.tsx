import AIReview from "@/components/AIReview/AiReview";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

export default async function AIReviewPage() {
  const session = await auth();
  if (!session?.user) return redirect("/login?callbackUrl=/ai-review");

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
