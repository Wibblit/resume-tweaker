"use client";

import { useEffect, useState } from "react";
import { getGoogleAuthURL } from "@/lib/client/gmailAuth";
import { Mail } from "lucide-react";
import { HoverBorderGradient } from "../ui/HoverBoardGradient";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  TooltipArrow,
} from "../ui/tooltip";

const ConnectGmailButton = () => {
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
