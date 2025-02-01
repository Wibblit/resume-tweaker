import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import { Session } from "next-auth" // Import the Session type

function Account({ session }: { session: Session }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")

  const handleDeleteAccount = () => {
    console.log("Deleting account...")
    // Implement actual account deletion logic here
    setIsDeleteDialogOpen(false)
    setDeleteConfirmation("")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Profile Picture</h3>
          <p className="text-sm font-light">You look good today!</p>
        </div>
        <Avatar className="h-16 w-16">
          <AvatarImage className="rounded-md" src={session?.user.image ?? "/placeholder.svg"} alt="User" />
          <AvatarFallback>Profile pic</AvatarFallback>
        </Avatar>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Name</h3>
          <p className="text-sm font-light shrink-0">Your good name</p>
        </div>
        <div className="space-y-2">
          <Input id="name" disabled value={session?.user.name} />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-sm font-light shrink-0">Your email address</p>
        </div>
        <div className="space-y-2">
          <Input id="email" disabled value={session?.user.email} />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Auth Provider</h3>
          <p className="text-sm font-light shrink-0">The provider you used to sign in</p>
        </div>
        <div className="space-y-2">
          <Input id="name" disabled value={session?.user.provider} />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm font-light text-destructive">Permanently delete your account and all associated data</p>
        </div>
        <Button variant="destructive" onClick={() => setIsDeleteDialogOpen(true)}>
          Delete Account
        </Button>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4">
            <Input
              placeholder="Type 'delete my account' to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAccount} disabled={deleteConfirmation !== "delete my account"}>
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default Account

