import ProfileSetupContent from "@/components/profile/ProfileSetupContent";
import { redirect } from "next/navigation";

export default function ProfileSetupPage() {
  return redirect("/");
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto py-8">
        <h1 className="mb-6 text-3xl font-bold text-center">
          Complete Your Profile
        </h1>
        <ProfileSetupContent />
      </main>
    </div>
  );
}
