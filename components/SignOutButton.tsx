// 'use client'

// import { Button } from "@/components/ui/button"
// import { LogOut } from "lucide-react"
// import { signOut } from "next-auth/react"

// export function SignOutButton() {
//   const handleSignOut = async () => {
//     try {
//       await signOut({
//         redirectTo: "/"
//       })
//     } catch (error) {
//       console.error("Sign out error:", error)
//     }
//   }

//   return (
//     <Button onClick={handleSignOut} variant="destructive" className="w-full justify-start">
//       <LogOut className="mr-2 h-4 w-4" />
//       Logout
//     </Button>
//   )
// }

"use client";

import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export function SignOutButton() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignOut = async () => {
    setLoading(true);

    // Small delay to ensure loading state updates visually
    await new Promise((resolve) => setTimeout(resolve, 50));

    try {
      const response = await signOut({ redirect: false });
      router.replace("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sign out failed. Try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="destructive"
      className="w-full justify-start"
      disabled={loading}
    >
      {loading ? (
        <div className="flex">
          <Loader2 className="mr-4 h-4 w-4 animate-spin" />
          Logging out...
        </div>
      ) : (
        <div className="flex">
          <LogOut className="mr-4 h-4 w-4" />
          Logout
        </div>
      )}
    </Button>
  );
}
