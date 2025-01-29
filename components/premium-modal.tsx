"use client";

import { useState, useEffect } from "react";
import { X, FileText, Briefcase, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PremiumModalProps {
  open: boolean;
  credits: number;
  name: string;
  onClose: () => void;
}

export function PremiumModal({
  open,
  credits,
  name,
  onClose,
}: PremiumModalProps) {
  const [isOpen, setIsOpen] = useState(open);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleClose = () => {
    setIsOpen(false);
    // Remove modal-related query parameters
    const url = new URL(window.location.href);
    url.searchParams.delete("modal");
    url.searchParams.delete("credits");
    url.searchParams.delete("featureName");
    router.replace(url.toString());
    // Call the onClose prop
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with increased transparency */}
      <div
        className="absolute inset-0 bg-background/30 backdrop-blur-[2px]"
        onClick={handleClose}
      />

      {/* Modal Card with semi-transparent background */}
      <Card className="relative z-50 w-full max-w-md overflow-hidden rounded-lg border bg-card/80 backdrop-blur-md p-0 shadow-lg animate-in fade-in-0 zoom-in-95">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Content */}
        <div className="px-6 py-12">
          {/* Illustration */}
          <div className="mb-6 flex justify-center">
            <div className="relative h-32 w-32">
              {/* Animated icons */}
              <div className="absolute inset-0">
                <FileText
                  className="absolute left-0 top-0 h-8 w-8 text-primary/80 animate-bounce"
                  style={{ animationDelay: "0s" }}
                />
                <Briefcase
                  className="absolute right-0 bottom-0 h-8 w-8 text-primary/80 animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                />
                <Star
                  className="absolute left-1/2 top-1/2 h-8 w-8 text-primary/80 animate-pulse"
                  style={{ animationDelay: "0.25s" }}
                />
              </div>
              {/* Main icon with glass effect */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-primary/5 backdrop-blur-sm p-4 animate-spin-slow">
                  <div className="rounded-full bg-primary/10 backdrop-blur-sm p-4">
                    <div className="h-12 w-12 rounded-full bg-primary/80 backdrop-blur-sm flex items-center justify-center">
                      <FileText className="h-6 w-6 text-background" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Text content */}
          <div className="text-center">
            <h2 className="mb-2 text-2xl font-semibold tracking-tight">
              Unlock {name}
            </h2>
            <p className="mb-6 text-sm text-muted-foreground">
              You need {credits} credits to access this premium interview
              feature. Enhance your job search experience now!
            </p>
          </div>

          {/* Buttons with glass effect */}
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
            <Button
              variant="ghost"
              className="w-full sm:w-auto backdrop-blur-sm"
              asChild
            >
              <Link href="/features">Explore Features</Link>
            </Button>
            <Button
              className="w-full sm:w-auto bg-gradient-to-r from-primary/90 to-primary/70 hover:from-primary/80 hover:to-primary/60 backdrop-blur-sm"
              asChild
            >
              <Link href="/pricing">Get Credits</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
