"use client";

import { useEffect, useState } from "react";
import { getGoogleAuthURL } from "@/lib/client/gmailAuth";
import { ChevronDown, LogOut, Mail, Loader2 } from "lucide-react";
import { HoverBorderGradient } from "../ui/HoverBoardGradient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "../ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const ConnectGmailButton = () => {
  const [showInitialTooltip, setShowInitialTooltip] = useState(true);
  const { data: session, status, update } = useSession();
  const { toast } = useToast();
  const notificationServiceBaseUrl = (
    process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_BASE_URL || ""
  ).toString();

  useEffect(() => {
    // Hide the initial tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowInitialTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleGmailAuth = () => {
    window.location.href = getGoogleAuthURL();
  };

  const handleDisconnect = async () => {
    const response = await axios.post(
      notificationServiceBaseUrl + "/api/auth/gmail/halt-email-watch",
      {
        userId: session?.user.id,
      },
      { withCredentials: true }
    );

    if (response.status === 200) {
      const previousEmail = session?.user.connectedEmail;
      await update({
        connectedEmail: null,
      });
      toast({
        title: "🔕 Gmail Disconnected!",
        description: (
          <>
            No longer job emails are tracked from{" "}
            <span className="font-bold underline">{previousEmail}</span>.
          </>
        ),
      });
    }
  };

  // Show loader while session is loading
  if (status === "loading") {
    return (
      <Button disabled variant="outline" className="flex items-center gap-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading...</span>
      </Button>
    );
  }

  if (session?.user.connectedEmail) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div>
            <HoverBorderGradient
              className="flex items-center gap-2 text-white pr-2"
              duration={1.5}
            >
              <Mail className="w-4 h-4" />
              <span className="max-w-[200px] truncate">
                {session.user.connectedEmail}
              </span>
              <ChevronDown className="w-4 h-4" />
            </HoverBorderGradient>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2">
          <Button
            variant="ghost"
            className="flex items-center gap-2 text-destructive hover:text-destructive w-full"
            onClick={handleDisconnect}
          >
            <LogOut className="w-4 h-4" />
            Disconnect Gmail
          </Button>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip defaultOpen={showInitialTooltip}>
        <TooltipTrigger asChild>
          <div>
            <HoverBorderGradient
              onClick={handleGmailAuth}
              className="flex items-center gap-2 text-white"
              duration={1.5}
            >
              <Mail className="w-4 h-4" />
              Connect Gmail
            </HoverBorderGradient>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <TooltipArrow className="fill-primary dark:fill-white" />
          <p className="font-semibold">
            Connect your Gmail and track job-related emails
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConnectGmailButton;
