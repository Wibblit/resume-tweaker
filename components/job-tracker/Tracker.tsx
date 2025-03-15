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
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Loader2, PlusCircle, Save, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AddJobDialog } from "./AddJobDialog";
import { Job, JobState } from "@/types/job-tracker";
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
  const [showSearchDialog, setShowSearchDialog] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
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

  const filteredJobs = jobs.filter(
    (job) =>
      job.companyName.toLowerCase().includes(search.toLowerCase()) ||
      job.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      job.state.toLowerCase().includes(search.toLowerCase())
  );

  const getStateColor = (state: JobState) => {
    const colors = {
      bookmark: "bg-yellow-50 dark:bg-yellow-950",
      applied: "bg-blue-50 dark:bg-blue-950",
      shortlisted: "bg-purple-50 dark:bg-purple-950",
      interviewing: "bg-green-50 dark:bg-green-950",
      negotiation: "bg-orange-50 dark:bg-orange-950",
    };
    return colors[state];
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

      <CommandDialog open={showSearchDialog} onOpenChange={setShowSearchDialog}>
        <CommandInput
          placeholder="Search jobs..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList>
          <CommandGroup heading="Jobs">
            {filteredJobs.some((job) => job.source !== "mail") ? (
              filteredJobs
                .filter((job) => job.source !== "mail")
                .slice(0, 3)
                .map((job) => (
                  <CommandItem
                    key={job.id}
                    value={`${job.companyName} ${job.jobTitle}`}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{job.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.companyName}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStateColor(
                        job.state
                      )}`}
                    >
                      {job.state}
                    </span>
                  </CommandItem>
                ))
            ) : (
              <CommandEmpty>No jobs found.</CommandEmpty>
            )}
          </CommandGroup>

          <CommandGroup heading="Emails">
            {filteredJobs.some((job) => job.source === "mail") ? (
              filteredJobs
                .filter((job) => job.source === "mail")
                .slice(0, 3)
                .map((job) => (
                  <CommandItem
                    key={job.id}
                    value={`${job.companyName} ${job.jobTitle}`}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{job.jobTitle}</p>
                      <p className="text-sm text-muted-foreground">
                        {job.companyName}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStateColor(
                        job.state
                      )}`}
                    >
                      {job.state}
                    </span>
                  </CommandItem>
                ))
            ) : (
              <CommandEmpty>No emails found.</CommandEmpty>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

      <NotificationSheet />

      <div className="py-6 px-3">
        <header className="mb-2 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 flex-1 max-w-md">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground"
                onClick={() => setShowSearchDialog(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                Search jobs...
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
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
             <ConnectGmailButton session={session!} />
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-border via-border/80 to-transparent mt-6" />
        </header>

        <ScrollArea className="w-full h-[calc(100vh-120px)]">
          <KanbanBoard />
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </>
  );
};

export default Tracker;
