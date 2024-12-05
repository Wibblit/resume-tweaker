import InterviewSetup from "@/components/Interview/interview-setup";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth()
  if (!session?.user) return   redirect("/login?callbackUrl=/ai-interview");
  return <InterviewSetup />;
}
