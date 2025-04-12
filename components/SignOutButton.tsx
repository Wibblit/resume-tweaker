"use client"

import { Button } from "@/components/ui/button"
import { Loader2, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

interface SignOutButtonProps {
  isCollapsed?: boolean
}

export function SignOutButton({ isCollapsed }: SignOutButtonProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  const handleSignOut = async () => {
    setLoading(true)

    // Small delay to ensure loading state updates visually
    await new Promise((resolve) => setTimeout(resolve, 50))

    try {
      await signOut({ redirect: false })
      router.replace("/")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sign out failed. Try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      className={`w-full justify-start ${isCollapsed ? "px-2" : ""}`}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      {!isCollapsed && <span className="ml-2">{loading ? "Logging out..." : "Logout"}</span>}
    </Button>
  )
}

