import ProfileContent from "@/components/profile/ProfileContent"

export default function ProfilePage() {
  return (
    <div className="flex h-screen bg-background text-foreground">
      <main className="flex-1 overflow-auto p-4 md:p-6">
        <h1 className="mb-6 text-3xl font-bold">Profile</h1>
        <ProfileContent />
      </main>
    </div>
  )
}