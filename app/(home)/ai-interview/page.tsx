import InterviewSetup from "@/components/interview-setup";
import { redirect } from "next/navigation";

export default function Home() {
  return redirect("/");
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        AI Interview Setup
      </h1>
      <InterviewSetup />
    </main>
  );
}
