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
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteResume } from "@/actions/deleteResume";
import { useToast } from "@/hooks/use-toast";
import { RenameDialog } from "./RenameResumeDialog";
import { ResumesProps } from "@/types/types";
import { duplicateResume } from "@/actions/duplicateResume";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { updateUsedResumeSlots } from "@/slices/userAssets";

export default function ResumeItem({
  resume,
  setRecentResumes,
}: {
  resume: {
    id: string;
    resumeName: string;
    userId: string;
    updatedOn: Date;
  };
  setRecentResumes: React.Dispatch<React.SetStateAction<ResumesProps>>;
}) {
  const isPhone = useMediaQuery({ maxWidth: 767 });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const usedresumeslots = useAppSelector(state => state?.assets?.usedresumes)


  const handleOpen = () => {
    dispatch(
      setCurrentResume({
        currResumeId: resume.id,
        currResumeName: resume.resumeName,
      }),
    );
    router.push(`/home/editor`);
  };

  const handleDuplicate = async () => {

    const verifier = await axios.get("/api/verify-resume-slots");

    if (verifier.data?.slotVerify) {
      return toast({
        title: "No Slots Available",
        description:
          "Your slots are full. Please purchase more to save resumes.",
        variant: "destructive",
      });
    }

    const response = await duplicateResume(resume.id);
    if (response && response.success) {
      setRecentResumes((prev) => {
        if (!prev || !response.duplicatedResume) return prev;
        return [
          {
            id: response.duplicatedResume.id,
            userId: response.duplicatedResume.userId,
            resumeName: response.duplicatedResume.resumeName,
            updatedOn: response.duplicatedResume.updatedOn,
          },
          ...prev,
        ];
      });

      toast({
        title: "Success",
        description: response.message,
      });
      dispatch(updateUsedResumeSlots(usedresumeslots + 1));
    } else {
      toast({
        title: `Error ${response.status}`,
        description: response.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    const { success, message, status } = await deleteResume(resume.id);

    if (success) {
      setRecentResumes((prev) => prev?.filter((item) => item.id !== resume.id));
      toast({
        title: "Success",
        description: message,
        variant: "default",
      });
      dispatch(updateUsedResumeSlots(usedresumeslots - 1))
    } else {
      toast({
        title: `Error ${status}`,
        description: message,
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
          <div className="flex-col items-start justify-start w-full">
            <div className="flex w-full items-center justify-between">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <span className="text-xs text-muted-foreground ml-2">
                Edited{" "}
                {formatDistanceToNow(new Date(resume.updatedOn.toISOString()), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="w-full items-start justify-start flex">
              <p className="text-sm pt-2 font-medium text-left">
                {resume.resumeName}
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
          className="h-auto w-full p-4 hover:bg-secondary transition-colors"
        >
          <div className="flex-col items-start justify-start w-full">
            <div className="flex w-full items-center justify-between">
              <FileText className="h-5 w-5 mr-3 text-primary" />
              <span className="text-xs text-muted-foreground ml-2">
                Edited{" "}
                {formatDistanceToNow(new Date(resume.updatedOn.toISOString()), {
                  addSuffix: true,
                })}
              </span>
            </div>
            <div className="w-full items-start justify-start flex">
              <p className="text-sm pt-2 font-medium text-left">
                {resume.resumeName}
              </p>
            </div>
          </div>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent>{menuItems}</ContextMenuContent>
    </ContextMenu>
  );
}
