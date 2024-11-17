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

export default function LetterItem({
  letter,
  setRecentCoverLetters,
}: {
  letter: {
    id: string;
    coverName: string;
    userId: string;
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
          <FileText className="h-6 w-6 mb-2" />
          <span>{letter.coverName}</span>
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
          <FileText className="h-6 w-6 mb-2" />
          <span>{letter.coverName}</span>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  );
}
