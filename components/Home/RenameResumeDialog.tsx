'use client'

import { useState, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { renameResume } from "@/actions/renameResume";
import { ResumesProps } from "@/types/types";

export function RenameDialog({
  children,
  resumeId,
  resumeName,
  setRecentResumes
}: {
  children: React.ReactNode;
  resumeId: string;
  resumeName: string;
  setRecentResumes: React.Dispatch<React.SetStateAction<ResumesProps>>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(resumeName);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(resumeName);
    }
  }, [open, resumeName]);

  const handleRename = async () => {
    if (name.trim() && name !== resumeName) {
      setLoading(true);
      try {
        const response = await renameResume(name, resumeId);
         if (response.status === 429) {
           toast({
             title: "Whoa there! You've hit the rate limit.",
             description: "Please slow down and try again in a few minutes.",
             variant: "destructive",
           });
           return;
         }
        setOpen(false);
        setRecentResumes((prev) => 
          prev?.map((resume) => 
            resume.id === resumeId 
              ? { ...resume, resumeName: name } 
              : resume
          )
        );
        toast({
          title: "Success",
          description: response.message,
          variant: "default",
        });
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
    } else if (name === resumeName) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Resume</DialogTitle>
          <DialogDescription>
            Enter a new name for your resume. Try to make it descriptive!
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
            onClick={handleRename}
            disabled={!name.trim() || name === resumeName || loading}
          >
            {loading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}