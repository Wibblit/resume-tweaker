"use client";

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
import { renameCoverLetter } from "@/actions/renameCoverLetter";

export type RecentCoverLetter = {
  id: string;
  userId: string;
  coverName: string;
};

export function RenameDialog({
  children,
  coverId,
  coverName,
  setRecentCoverLetters,
}: {
  children: React.ReactNode;
  coverId: string;
  coverName: string;
  setRecentCoverLetters: React.Dispatch<
    React.SetStateAction<RecentCoverLetter[] | undefined>
  >;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(coverName);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setName(coverName);
    }
  }, [open, coverName]);

  const handleRename = async () => {
    if (name.trim() && name !== coverName) {
      setLoading(true);
      try {
        const response = await renameCoverLetter(name, coverId);
        setOpen(false);
        setRecentCoverLetters((prev) =>
          prev?.map((cover) =>
            cover.id === coverId ? { ...cover, coverName: name } : cover
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
    } else if (name === coverName) {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Cover Letter</DialogTitle>
          <DialogDescription>
            Enter a new name for your cover letter. Try to make it descriptive!
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
            disabled={!name.trim() || name === coverName || loading}
          >
            {loading ? "Renaming..." : "Rename"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
