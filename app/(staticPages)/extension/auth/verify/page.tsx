"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function VerificationPage() {
  const { data: session, status } = useSession();
  const [message, setMessage] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "error"
  >("loading");
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") {
      setVerificationStatus("loading");
      return;
    }

    if (!session) {
      router.push("/login?callbackUrl=/extension/auth/verify");
      return;
    }

    if (session.user) {
      try {
        chrome.runtime.sendMessage(
          process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID ||
            "pkghmhfhkloagakddedgpccekgapifje",
          {
            type: "LOGIN_SUCCESS",
            user: session.user,
          },
          { includeTlsChannelId: true },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError);
              setMessage(
                "Failed to communicate with the extension. Please ensure it's installed and try again."
              );
              setVerificationStatus("error");
            } else {
              setMessage(
                "Authentication successful! You can close this window."
              );
              setVerificationStatus("success");
            }
          }
        );
      } catch (error) {
        setMessage(
          "Failed to communicate with the extension. Please ensure it's installed and try again."
        );
        setVerificationStatus("error");
      }
    }
  }, [session, status, router]);

  const statusConfig = {
    loading: {
      icon: Loader2,
      text: "Verifying your authentication...",
      className: "text-primary animate-spin",
    },
    success: {
      icon: CheckCircle2,
      text: message || "Authentication verified!",
      className: "text-green-500",
    },
    error: {
      icon: XCircle,
      text: message || "Authentication failed",
      className: "text-red-500",
    },
  };

  const StatusIcon = statusConfig[verificationStatus].icon;

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-secondary p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <StatusIcon
            className={`w-16 h-16 ${statusConfig[verificationStatus].className}`}
          />
          <h1 className="text-2xl font-semibold tracking-tight">
            Authentication Verification
          </h1>
          <p className="text-muted-foreground">
            {statusConfig[verificationStatus].text}
          </p>
        </div>
      </Card>
    </div>
  );
}
