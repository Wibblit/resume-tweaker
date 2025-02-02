"use client"

import { useState } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import type { Session } from "next-auth"
import { Loader } from "lucide-react"
import { deleteAccount } from "@/actions/deleteAccount"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"

function Account({ session }: { session: Session }) {
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)

    const { success, message } = await deleteAccount()

    if (success) {
      toast({
        title: "Account deletion success",
        description: message,
      })

      await signOut({ redirectTo: "/" })
      setDeleteConfirmation("")
    }

    setDeleteLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">You look good today!</p>
        </div>
        <Avatar className="h-16 w-16 rounded-lg">
          <AvatarImage className="object-cover" src={session?.user.image ?? "/placeholder.svg"} alt="User" />
          <AvatarFallback>Profile pic</AvatarFallback>
        </Avatar>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Name</h3>
          <p className="text-sm text-muted-foreground shrink-0">Your good name</p>
        </div>
        <div className="space-y-2">
          <Input id="name" disabled value={session?.user.name} />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Email</h3>
          <p className="text-sm text-muted-foreground shrink-0">Your email address</p>
        </div>
        <div className="space-y-2">
          <Input id="email" disabled value={session?.user.email} />
        </div>
      </div>
      <Separator />
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-medium">Auth Provider</h3>
          <p className="text-sm text-muted-foreground shrink-0">The provider you used to sign in</p>
        </div>
        <div className="space-y-2">
          <Input id="name" disabled value={session?.user.provider} />
        </div>
      </div>
      <Separator />
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-destructive">Danger Zone</h3>
          <p className="text-sm text-destructive">Permanently delete your account and all associated data</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account and remove your data from our
                servers. To confirm, please type <strong>"delete my account"</strong>.
              </DialogDescription>
            </DialogHeader>
            <div className="my-4">
              <Input
                placeholder="Type 'delete my account' to confirm"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmation !== "delete my account" || deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    Deleting your account <Loader className="animate-spin w-4 h-4 ml-2" />
                  </>
                ) : (
                  "Delete Account"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Account

