import Editor from "@/components/Editor"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export default async function ResumeBuilder({ resumeId }: { resumeId: string | null }) {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/editor")
  }

  return <Editor />
}