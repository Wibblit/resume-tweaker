import AIReview from "@/components/AIReview/AiReview";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AIReviewPage() {
  const session = await auth()
  console.log("session user",session?.user)
  if (!session?.user) return   redirect("/login?callbackUrl=/ai-review");
  return <AIReview />;
}
