'use client'

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

export function SignOutButton() {
  const handleSignOut = async () => {
    try {
      await signOut({
        redirectTo: "/"
      })
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  return (
    <Button onClick={handleSignOut} variant="destructive" className="w-full justify-start">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}