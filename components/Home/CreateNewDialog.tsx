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
import { Coins, FileText, Loader, Loader2 } from "lucide-react";
import axios from "axios";
import { useAppSelector } from "@/hooks/hooks";
import { PremiumModal } from "../premium-modal";
import { creditList } from "@/utils/credits";
import { cn } from "@/lib/utils";
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New {type}</DialogTitle>
            <DialogDescription>
              Enter a name for your new {type.toLowerCase()}. Try to make it
              descriptive!
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleCreate}
              disabled={!name.trim() || loading}
            >
              {loading ? (
                <div className="flex">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold">
              Buy {type === RESUME ? "Resume" : "Coverletter"} Slot
            </DialogTitle>
            <DialogDescription className="text-base">
              Spend{" "}
              <span className="font-semibold text-primary">
                {creditList.get(slot)} credits
              </span>{" "}
              to store one more {type === RESUME ? "resume" : "coverletter"}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-6 py-6">
            <div className="relative flex items-center justify-center">
              <FileText className="h-24 w-24 text-muted-foreground" />
              <div className="absolute -bottom-4 -right-4 bg-background rounded-full p-2 shadow-md">
                <Coins className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                New {type === RESUME ? "Resume" : "Coverletter"} Slot
              </p>
              <p className="text-sm text-muted-foreground">
                Store an additional {type === RESUME ? "resume" : "coverletter"}
              </p>
            </div>
          </div>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handlePurchase}
              disabled={buyloading}
              className={cn(
                "w-full sm:w-auto transition-all duration-200 ease-in-out",
                loading && "opacity-80"
              )}
            >
              {buyloading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </div>
              ) : (
                <>
                  <Coins className="mr-2 h-4 w-4" />
                  Buy Slot for 50 Credits
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
