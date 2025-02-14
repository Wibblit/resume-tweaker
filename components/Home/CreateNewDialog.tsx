"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createResume } from "@/actions/createResume";
import { setCurrentCover } from "@/slices/currentCoverSlice";
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { useAppDispatch } from "@/hooks/hooks";
import { useToast } from "@/hooks/use-toast";
import { UpdateId } from "@/slices/rightsidebarSlice";
import { createCover } from "@/actions/createCover";
import { Coins, Loader, Sparkles } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/hooks/hooks";
import { PremiumModal } from "../premium-modal";
import { creditList } from "@/utils/credits";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  updateCredits,
  updateCoverSlot,
  updateResumeSlot,
} from "@/slices/userAssets";

const RESUME = "Resume";
const COVER = "Cover Letter";

export function CreateNewDialog({
  children,
  template,
  templateId,
  type,
}: {
  children: React.ReactNode;
  template: boolean;
  templateId?: number;
  type: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const onClose = () => {
    setOpen(false);
  };

  const credits = useAppSelector((state) => state?.assets?.credits);
  const resumeslots = useAppSelector((state) => state?.assets?.resumeslot);
  const coverslots = useAppSelector((state) => state?.assets?.coverslot);
  const usedresumeslot = useAppSelector((state) => state?.assets?.usedresumes);
  const [buyloading, setBuyLoading] = useState<boolean>(false);
  const usedcoverslot = useAppSelector(
    (state) => state?.assets?.usedcoverletters
  );

  const handlePurchase = async () => {
    setBuyLoading(true);
    try {
      const response = await axios.patch("/api/credit-detector", {
        type: type === RESUME ? "resumeslot" : "coverslot",
      });
      toast({
        title: "Success!",
        description:
          response?.data?.message ||
          "Your slot has been successfully purchased.",
      });
      dispatch(updateCredits(response?.data?.data?.credits));
      dispatch(updateResumeSlot(response?.data?.data?.resumeslot));
      dispatch(updateCoverSlot(response?.data?.data?.coverslot));
      setOpen(false);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description:
          "We couldn't process your slot purchase. Please try again later.",
        variant: "destructive",
      });
    }
    setBuyLoading(false);
  };

  const handleCreate = async () => {
    if (template) {
      dispatch(UpdateId(templateId));
    } else {
      dispatch(UpdateId(1));
    }
    setLoading(true);
    if (name.trim()) {
      if (type === RESUME) {
        const verifier = await axios.get("/api/verify-resume-slots");

        if (verifier.data?.slotVerify) {
          setLoading(false);
          return toast({
            title: "No Slots Available",
            description:
              "Your slots are full. Please purchase more to save resumes.",
            variant: "destructive",
          });
        }
        const response = await createResume(name);
        if (response && response.success) {
          localStorage.setItem("currResumeId", response?.resume?.id as string);
          dispatch(
            setCurrentResume({
              currResumeId: response?.resume?.id as string,
              currResumeName: response?.resume?.resumeName as string,
            })
          );

          router.push("/home/editor");
        } else {
          toast({
            title: `Error ${response.status}`,
            description: response.message || "Failed to create resume",
            variant: "destructive",
          });
          setLoading(false);
        }
      } else {
        const verifier = await axios.get("/api/verify-cover-slots");

        if (verifier.data?.slotVerify) {
          setLoading(false);
          return toast({
            title: "No Slots Available",
            description:
              "Your slots are full. Please purchase more to save cover letter.",
            variant: "destructive",
          });
        }
        const response = await createCover(name);
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }

        if (response && response.success) {
          localStorage.setItem("currCoverId", response?.cover?.id as string);
          dispatch(
            setCurrentCover({
              currCoverId: response?.cover?.id as string,
              currCoverName: response?.cover?.coverName as string,
            })
          );
          router.push("/home/covereditor");
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to create resume",
            variant: "destructive",
          });
          setLoading(false);
        }
      }
    }
  };

  const slot = type === RESUME ? "resumeslot" : "coverslot";
  const usedslots = type === RESUME ? usedresumeslot : usedcoverslot;
  const availableslots = type === RESUME ? resumeslots : coverslots;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {usedslots < availableslots ? (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Create New {type}
            </DialogTitle>
            <DialogDescription className="text-center">
              Give your {type.toLowerCase()} a descriptive name to help you identify it later
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-md backdrop-blur-sm shadow-sm text-sm">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  Slot {usedslots + 1} of {availableslots}
                </span>
              </div>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
                placeholder={`Enter ${type.toLowerCase()} name`}
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleCreate}
              disabled={!name.trim() || loading}
              className="w-full sm:w-auto"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </div>
              ) : (
                "Create"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      ) : credits < (creditList.get(slot) ?? 0) ? (
        <PremiumModal
          credits={creditList.get(slot) ?? 0}
          name={type === RESUME ? "Resume slot" : "Cover letter slot"}
          onClose={onClose}
          open={open}
        />
      ) : (
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-semibold">
              Buy {type === RESUME ? "Resume" : "Cover Letter"} Slot
            </DialogTitle>
            <DialogDescription className="text-center">
              Expand your storage capacity with an additional slot
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-md backdrop-blur-sm shadow-sm text-sm">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              <span className="font-medium text-amber-700 dark:text-amber-400">
                {creditList.get(slot)} Credits Required
              </span>
            </div>
            
            <Separator className="my-2" />
            
            <Button
              onClick={handlePurchase}
              disabled={buyloading}
              className="w-full"
            >
              {buyloading ? (
                <div className="flex items-center justify-center">
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Purchase Slot
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}