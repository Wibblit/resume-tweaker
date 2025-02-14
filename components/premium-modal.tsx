"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Unlock {name}
          </DialogTitle>
          <DialogDescription className="text-center">
            Access premium interview features to enhance your job search
            experience
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-4 py-4">
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-md backdrop-blur-sm shadow-sm text-sm">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
            <span className="font-medium text-amber-700 dark:text-amber-400">
              {credits} Credits Required
            </span>
          </div>
          <Separator className="my-2" />
          <div className="flex w-full flex-col gap-2">
            <Button variant="default" className="w-full" asChild>
              <Link href="/pricing">Get Credits</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/pricing/#features">Explore Features</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}