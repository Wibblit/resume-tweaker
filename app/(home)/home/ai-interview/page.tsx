import Interview from "@/components/Interview/InterviewPage";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/prisma";

export default async function AIInterviewPage() {
  const session = await auth();
  console.log("session:KJDSKJGFJSHDF",session)
  if (!session?.user) return redirect("/login?callbackUrl=/home/ai-interview");

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

  return <Interview recentResumes={result} />;
}
