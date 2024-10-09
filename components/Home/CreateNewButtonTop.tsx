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
import { PlusCircle } from "lucide-react";
import { createResume } from "@/actions/createResume";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch } from "@/hooks/hooks";
import { setCurrentResume } from "@/slices/currentResumeSlices";

export default function CreateNewButtonTop() {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch()

  const handleCreate = async () => {
    if (name.trim()) {
      setLoading(true);
      try {
        const response = await createResume(name);

        if (response && response.success) {
          localStorage.setItem("currResumeId", response?.resume?.id as string)
          dispatch(setCurrentResume({
            currResumeId: response?.resume?.id as string,
            currResumeName: response?.resume?.resumeName as string,
          }))
          setOpen(false);
          router.push("/editor");
        } else {
          toast({
            title: "Error",
            description: response.message || "Failed to create resume",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("An error occurred:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          <span>Create New</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Resume/Letter</DialogTitle>
          <DialogDescription>
            Enter a name for your new resume or letter. Try to make it descriptive!
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
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}