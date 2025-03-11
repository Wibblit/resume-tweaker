"use client";
import React, { useEffect, useState } from "react";
import { ExtensionCommunicator } from "@/lib/services/ExtensionCommunicator";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  setJobs,
  resetUnsavedChanges,
  addJob,
} from "@/slices/job-tracker/job-slice";
import { KanbanBoard } from "./KanbanBoard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Save } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AddJobDialog } from "./AddJobDialog";
import { Job } from "@/types/job-tracker";
import { v4 as uuidv4 } from "uuid";
import { JobStorage } from "@/lib/services/JobStorage";
import ConnectGmailButton from "./GmailConnectButton";
import { NotificationBell } from "./NotificationBell";
import { NotificationSheet } from "./NotificationSheet";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const Tracker = () => {
  const dispatch = useAppDispatch();
  const hasUnsavedChanges = useAppSelector(
    (state) => state.jobs.hasUnsavedChanges
  );
  const jobs = useAppSelector((state) => state.jobs.items);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const searchParams = useSearchParams();
  const { data: session, update } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    async function getAllJobs() {
      try {
        if (searchParams.get("gmailConnected")) {
          update({
            ...session,
            user: {
              ...session?.user,
              connectedEmail: searchParams.get("email"),
            },
          });
        }
        await ExtensionCommunicator.updateIndexDB();
        const indexDbData = await JobStorage.getJobs();
        dispatch(setJobs(indexDbData));
      } catch (error) {
        console.error(error);
      }
    }
    getAllJobs();
  }, [dispatch]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        setShowSaveDialog(true);
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    setSaving(true);
    const response = await ExtensionCommunicator.updateChanges(jobs);
    if (response?.success) {
      setSaving(false);
      dispatch(resetUnsavedChanges());
      toast({
        variant: "default",
        title: "Success",
        description: "Changes saved successfully",
      });
    }
  };

  const handleAddJob = async (
    data: Omit<Job, "id" | "addedOn" | "url" | "source" | "logoSrc">
  ) => {
    const newJob: Job = {
      ...data,
      logoSrc: null,
      addedOn: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      url: null,
      source: "website",
      id: uuidv4() + "-manual",
    };

    dispatch(addJob(newJob));

    JobStorage.addJob(newJob)
      .then(() => {
        toast({
          title: "Success",
          description: "New job has been added to your tracker",
        });
      })
      .catch(console.error);
  };

  return (
    <>
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes. Would you like to save them before
              leaving?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      <AddJobDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={handleAddJob}
      />

      <NotificationSheet />

      <div className="p-6">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Job Tracker
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell />
              <Button
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 transition-all hover:shadow-md"
                variant={hasUnsavedChanges ? "default" : "secondary"}
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Save</span>
              </Button>
              <Button
                variant="default"
                className="flex items-center gap-2 p-2 sm:px-4 sm:py-2 transition-all hover:shadow-md"
                onClick={() => setShowAddDialog(true)}
              >
                <PlusCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Add new</span>
              </Button>
              {!session?.user.connectedEmail && <ConnectGmailButton />}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-border via-border/80 to-transparent mt-6" />
        </header>

        <ScrollArea className="w-full h-[calc(100vh-140px)]">
          <KanbanBoard />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default Tracker;
