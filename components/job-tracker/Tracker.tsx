"use client";

import { useEffect, useState } from "react";
import { ExtensionCommunicator } from "@/lib/services/ExtensionCommunicator";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { KanbanBoard } from "./KanbanBoard";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Building2, Loader2, PlusCircle, Save, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { AddJobDialog } from "./AddJobDialog";
import type { Job, JobState } from "@/types/job-tracker";
import { v4 as uuidv4 } from "uuid";
import { JobStorage } from "@/lib/services/JobStorage";
import ConnectGmailButton from "./GmailConnectButton";
import { NotificationBell } from "./NotificationBell";
import { NotificationSheet } from "./NotificationSheet";
import { useSession } from "next-auth/react";
import { useSidebar } from "@/components/ui/sidebar";
import { updateJD } from "@/actions/updateJD";
import { setOpenJobId } from "@/slices/job-tracker/dialogSlice";
import { getUserJobs } from "@/actions/getUserJobs";
import { useRouter } from "next/navigation";
import { updatedAfter } from "@/actions/updatedAfter";
import throttle from "lodash/throttle";
import {
  removeJob,
  addJob,
  setJobs,
  resetUnsavedChanges,
} from "@/slices/job-tracker/job-slice";

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
  const { toast } = useToast();
  const { state: sidebarState } = useSidebar();

async function syncData(extensionData: Job[]) {
  const lastSync = await JobStorage.getLastSync();
  const since = lastSync?.toISOString() ?? "1970-01-01T00:00:00.000Z";
  const updatedJobs = await updatedAfter(since);
  const { jobs, emails } = updatedJobs.data;
  console.log("jobs from syncData: ", jobs);

  // Convert extensionData to a Map for fast lookups
  const extensionDataMap = new Map(extensionData.map((job) => [job.id, job]));

  const deletePromises = [];
  const updatePromises = [];

  // Process both jobs and emails
  for (const job of [...jobs, ...emails]) {
    if (job.isDeleted) {
      console.log("lastsync delete horaha h", job.id);
      // Mark the job for deletion
      deletePromises.push(JobStorage.deleteJob(job.id));
      dispatch(removeJob(job.id));
      extensionDataMap.delete(job.id); // Remove job from map
    } else {
      const { isDeleted, ...rest } = job;
      // Mark the job for update
      updatePromises.push(JobStorage.updateJob(rest));
      dispatch(addJob(job));
      extensionDataMap.set(job.id, job); // Update job in map
    }
  }

  // Wait for all delete and update operations to complete
  await Promise.all([...deletePromises, ...updatePromises]);

  // Set the last sync time after updates and deletions are complete
  await JobStorage.setLastSync(new Date());

  return Array.from(extensionDataMap.values());
}


  const throttleSyncData = throttle(syncData, 30 * 1000);

  useEffect(() => {
    async function getAllJobs() {
      try {
        let indexDbData = await JobStorage.getJobs();
        if (indexDbData.length === 0) {
          const userJobs = await getUserJobs();
          await JobStorage.storeJobs([
            ...userJobs.data.jobData,
            ...userJobs.data.jobEmailData,
          ]);
        }
        const res = await ExtensionCommunicator.updateIndexDB(); //updates any extension data to indexDB
        indexDbData = await JobStorage.getJobs();
        console.log("IndexDB Data", indexDbData);
        dispatch(setJobs(indexDbData));
        const extensionData = await throttleSyncData(res.data);
        const updatedJobs = res.data.filter((job) => job.status === "updated"); //updated jobs from extension
        const newJobs = res.data.filter((job) => job.status === "new"); //new jobs from the extension
        if (res.isChanged) {
          if (updatedJobs.length > 0 || newJobs.length > 0) {
            console.log("Updating JDs");
            await updateJD(updatedJobs, newJobs);
          }
        }
        const formattedData = extensionData.map((job: Job) => ({
          ...job,
          status: "old" as const,
        }));

        await ExtensionCommunicator.updateChanges(formattedData);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setShowSearchDialog((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
      status: "new" as "new",
    };

    dispatch(addJob(newJob));
    await updateJD([], [newJob]);

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

  const handleJobClick = (jobId: string) => {
    setShowSearchDialog(false); // Close the search dialog
    dispatch(setOpenJobId(jobId)); // Open the job dialog
  };

  return (
    <div className="flex-grow overflow-y-auto flex">
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
            {filteredJobs.some((job) => job.source !== "email") ? (
              filteredJobs
                .filter((job) => job.source !== "email")
                .slice(0, 3)
                .map((job) => (
                  <CommandItem
                    key={job.id}
                    value={`${job.companyName} ${job.jobTitle}`}
                    className="flex items-center justify-between cursor-pointer"
                    onSelect={() => handleJobClick(job.id)}
                  >
                    <div className="flex gap-2">
                      {job.logoSrc ? (
                        <img
                          src={job.logoSrc || ""}
                          className="w-10 h-10 rounded-xl"
                          alt="company logo"
                        />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-secondary border shadow-sm">
                          <Building2 className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{job.jobTitle}</p>
                        <p className="text-sm text-muted-foreground">
                          {job.companyName}
                        </p>
                      </div>
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
            {filteredJobs.some((job) => job.source === "email") ? (
              filteredJobs
                .filter((job) => job.source === "email")
                .slice(0, 3)
                .map((job) => (
                  <CommandItem
                    key={job.id}
                    value={`${job.companyName} ${job.jobTitle}`}
                    className="flex items-center justify-between cursor-pointer"
                    onSelect={() => handleJobClick(job.id)}
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

      <div className="py-6 px-3 h-full overflow-hidden">
        <header className="mb-2 px-2 sm:px-6 transition-all duration-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:max-w-md">
              <Button
                variant="outline"
                className="w-full justify-start text-muted-foreground"
                onClick={() => setShowSearchDialog(true)}
              >
                <Search className="mr-2 h-4 w-4" />
                <span className="truncate">Search jobs...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
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
              <ConnectGmailButton />
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-border via-border/80 to-transparent mt-6" />
        </header>

        <ScrollArea className="w-full h-[calc(100vh-140px)]">
          <div
            className={`transition-all duration-200 min-w-0 ${
              sidebarState === "collapsed" ? "pr-0" : "pr-0"
            }`}
          >
            <KanbanBoard />
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
};

export default Tracker;
