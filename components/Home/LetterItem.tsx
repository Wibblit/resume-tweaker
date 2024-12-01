"use client";

import { useMediaQuery } from "react-responsive";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Pencil, Copy, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { setCurrentCover } from "@/slices/currentCoverSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { deleteCoverLetter } from "@/actions/deleteCoverLetter";
import { useToast } from "@/hooks/use-toast";
import { RenameDialog } from "./RenameCoverLetterDialog";
import { LetterProps } from "@/types/types";
import { duplicateCoverLetter } from "@/actions/duplicateCoverLetter";
import { formatDistanceToNow } from "date-fns";

export default function LetterItem({
  letter,
  setRecentCoverLetters,
}: {
  letter: {
    id: string;
    coverName: string;
    userId: string;
    updatedOn : Date
  };
  setRecentCoverLetters: React.Dispatch<
    React.SetStateAction<LetterProps>
  >;
}) {
  const isPhone = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleOpen = () => {
    dispatch(
      setCurrentCover({
        currCoverId: letter.id,
        currCoverName: letter.coverName,
      })
    );
    router.push(`/covereditor`);
  };

  const handleDuplicate = async () => {
    try {
      const response = await duplicateCoverLetter(letter.id);
       if (response.status === 429) {
         toast({
           title: "Whoa there! You've hit the rate limit.",
           description: "Please slow down and try again in a few minutes.",
           variant: "destructive",
         });
         return;
       }
     setRecentCoverLetters((prev) => {
       if (!prev || !response.duplicatedCoverLetter) return prev;
       return [
         {
           id: response.duplicatedCoverLetter.id,
           userId: response.duplicatedCoverLetter.userId,
           coverName: response.duplicatedCoverLetter.coverName,
           updatedOn : response.duplicatedCoverLetter.updatedOn
         },
         ...prev,
       ];
     });
      toast({
        title: "Success",
        description: response.message,
      });
    } catch (error) {
      console.error("Failed to duplicate cover letter:", error);
      toast({
        title: "Error",
        description: "Failed to duplicate the cover letter :(",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { success, message, status } = await deleteCoverLetter(letter.id);
       if (status === 429) {
         toast({
           title: "Whoa there! You've hit the rate limit.",
           description: "Please slow down and try again in a few minutes.",
           variant: "destructive",
         });
         return;
       }
      if (success) {
        setRecentCoverLetters((prev) =>
          prev?.filter((item) => item.id !== letter.id)
        );
        toast({
          title: "Success",
          description: message,
          variant: "default",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to delete the cover letter",
        variant: "destructive",
      });
    }
  };

  const menuItems = (
    <>
      <ContextMenuItem onSelect={handleOpen}>
        <FileText className="mr-2 h-4 w-4" />
        Open
      </ContextMenuItem>
      <RenameDialog
        setRecentCoverLetters={setRecentCoverLetters}
        coverId={letter?.id}
        coverName={letter.coverName}
      >
        <ContextMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil className="mr-2 h-4 w-4" />
          Rename
        </ContextMenuItem>
      </RenameDialog>
      <ContextMenuItem onSelect={handleDuplicate}>
        <Copy className="mr-2 h-4 w-4" />
        Duplicate
      </ContextMenuItem>
      <Separator />
      <ContextMenuItem className="text-destructive" onSelect={handleDelete}>
        <Trash2 className="mr-2 h-4 w-4" />
        Delete
      </ContextMenuItem>
    </>
  );

  return isPhone ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-auto flex-col items-start p-4 w-full"
        >
          <div className="flex-col items-start justify-start w-full">
            <div className="flex w-full items-center justify-between">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <span className="text-xs text-muted-foreground ml-2">
                Edited{" "}
                {formatDistanceToNow(new Date(letter.updatedOn.toISOString()), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="w-full items-start justify-start flex">
              <p className="text-sm pt-2 font-medium text-left">
                {letter.coverName}
              </p>
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleOpen}>
          <FileText className="mr-2 h-4 w-4" />
          Open
        </DropdownMenuItem>
        <RenameDialog
          setRecentCoverLetters={setRecentCoverLetters}
          coverId={letter?.id}
          coverName={letter.coverName}
        >
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Pencil className="mr-2 h-4 w-4" />
            Rename
          </DropdownMenuItem>
        </RenameDialog>
        <DropdownMenuItem onSelect={handleDuplicate}>
          <Copy className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-destructive border-t"
          onSelect={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ) : (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <Button
          variant="outline"
          onClick={handleOpen}
          className="h-auto flex-col items-start p-4 w-full hover:bg-secondary"
        >
          <div className="flex-col items-start justify-start w-full">
            <div className="flex w-full items-center justify-between">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <span className="text-xs text-muted-foreground ml-2">
                Edited{" "}
                {formatDistanceToNow(new Date(letter.updatedOn.toISOString()), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="w-full items-start justify-start flex">
              <p className="text-sm pt-2 font-medium text-left">
                {letter.coverName}
              </p>
            </div>
          </div>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  );
}
