import Editor from "@/components/Editor"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata : Metadata = {
    title: "Resume Editor"
}

export default async function ResumeBuilder() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login?callbackUrl=/home/editor")
    }

    return <Editor />
}