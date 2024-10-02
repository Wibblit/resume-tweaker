import Editor from "@/components/Editor"
import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function ResumeBuilder() {
  const session = await auth()
  console.log(session)
  if (!session?.user) {
    redirect("/login?callbackUrl=/editor")
  }
  return <Editor />
}