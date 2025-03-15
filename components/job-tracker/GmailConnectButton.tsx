"use client";

import { useEffect, useState } from "react";
import { getGoogleAuthURL } from "@/lib/client/gmailAuth";
import { ChevronDown, LogOut, Mail } from "lucide-react";
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
import { type Session } from "next-auth";
import { Button } from "@/components/ui/button";

const ConnectGmailButton = ({ session }: { session: Session }) => {
  const [showInitialTooltip, setShowInitialTooltip] = useState(true);

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
    // Add your disconnect logic here
    // For example: signOut() from next-auth or a custom disconnect function
  };

  if (session.user.connectedEmail) {
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
