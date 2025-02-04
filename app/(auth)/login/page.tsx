import { SignIn } from "@/components/auth/SignIn";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | ResumeTweaker",
  description:
    "Login to Resumetweaker, Supercharge your job search with AI resume builder, review, and personalised interviews.",
  alternates: {
    canonical: "https://resumetweaker.wibblit.com/login",
  },
  keywords: [
    "AI resume builder",
    "AI resume review",
    "AI interview preparation",
    "mock interview service",
    "personalized interview coaching",
    "interview practice platform",
    "job interview simulator",
    "AI-powered interview questions",
    "AI-driven interview feedback",
    "job readiness training",
    "resume optimization tools",
    "AI career assistant",
    "interview techniques and strategies",
    "job application enhancement",
    "AI-powered job search tools"
  ],
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    return redirect("/home");
  }
  return (
    <div className={`min-h-screen flex items-center justify-center p-4`}>
      <SignIn />
    </div>
  );
}
