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
import { setCurrentResume } from "@/slices/currentResumeSlices";
import { useAppDispatch } from "@/hooks/hooks";
import { deleteResume } from "@/actions/deleteResume";
import { useToast } from "@/hooks/use-toast";
import { RenameDialog } from "./RenameResumeDialog";
import { RecentResume } from "@/types/types";
import { duplicateResume } from "@/actions/duplicateResume";

export default function ResumeItem({
  resume,
  setRecentResumes,
}: {
  resume: {
    id: string;
    resumeName: string;
    userId: string;
  };
  setRecentResumes: React.Dispatch<
    React.SetStateAction<RecentResume[] | undefined>
  >;
}) {
  const isPhone = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();

  const handleOpen = () => {
    dispatch(
      setCurrentResume({
        currResumeId: resume.id,
        currResumeName: resume.resumeName,
      })
    );
    router.push(`/editor`);
  };

  const handleDuplicate = async () => {
    try {
      const response = await duplicateResume(resume.id);
       if (response.status === 429) {
         toast({
           title: "Whoa there! You've hit the rate limit.",
           description: "Please slow down and try again in a few minutes.",
           variant: "destructive",
         });
         return;
       }
      setRecentResumes((prev) => {
        if (!prev || !response.duplicatedResume) return prev;
        return [
          {
            id: response.duplicatedResume.id,
            userId: response.duplicatedResume.userId,
            resumeName: response.duplicatedResume.resumeName,
          },
          ...prev,
        ];
      });

      toast({
        title: "Success",
        description: response.message,
      });
    } catch (error) {
      console.error("Failed to duplicate resume:", error);
      toast({
        title: "Success",
        description: "Failed to duplicate the resume :(",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const { success, message, status } = await deleteResume(resume.id);
      if (status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }
      if (success) {
        setRecentResumes((prev) =>
          prev?.filter((item) => item.id !== resume.id)
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
        description: "Failed to delete the resume",
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
        setRecentResumes={setRecentResumes}
        resumeId={resume?.id}
        resumeName={resume.resumeName}
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
          <span>{resume.resumeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={handleOpen}>
          <FileText className="mr-2 h-4 w-4" />
          Open
        </DropdownMenuItem>
        <RenameDialog
          setRecentResumes={setRecentResumes}
          resumeId={resume?.id}
          resumeName={resume.resumeName}
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
          <span>{resume.resumeName}</span>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  );
}
