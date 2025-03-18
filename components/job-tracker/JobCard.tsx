"use client";

import type React from "react";
import { Draggable } from "react-beautiful-dnd";
import type { Job, JobState } from "@/types/job-tracker";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Mail, FileEdit } from "lucide-react";
import EmailDialogSource from "./EmailDialogSource";
import OtherDialogSource from "./OtherDialogSource";
import { useSession } from "next-auth/react";
import { JobEmailCard } from "./JobEmailCard";
import { OtherSourceJobCard } from "./OutSourceJobCard";
interface JobCardProps {
  job: Job;
  index: number;
}

export function getSourceIcon(source: string) {
  switch (source.toLowerCase()) {
    case "linkedin":
      return (
        <img
          src={"https://tpc.googlesyndication.com/simgad/14778439095016119154"}
          alt="linkedin logo"
          className="w-4 h-4"
        />
      );
    case "email":
      return <Mail className="w-3.5 h-3.5" />;
    case "manual":
      return <FileEdit className="w-3.5 h-3.5" />;
    default:
      return <FileEdit className="w-3.5 h-3.5" />;
  }
}

const getStatusColor = (status: JobState) => {
  const statusMap: Record<string, { bg: string; text: string }> = {
    bookmark: {
      bg: "bg-yellow-50 dark:bg-yellow-950",
      text: "text-yellow-700 dark:text-yellow-300",
    },
    applied: {
      bg: "bg-blue-50 dark:bg-blue-950",
      text: "text-blue-700 dark:text-blue-300",
    },
    shortlisted: {
      bg: "bg-purple-50 dark:bg-purple-950",
      text: "text-purple-700 dark:text-purple-300",
    },
    interviewing: {
      bg: "bg-green-50 dark:bg-green-950",
      text: "text-green-700 dark:text-green-300",
    },
    negotiation: {
      bg: "bg-orange-50 dark:bg-orange-950",
      text: "text-orange-700 dark:text-orange-300",
    },
  };
  return (
    statusMap[status] || {
      bg: "bg-gray-50 dark:bg-gray-950",
      text: "text-gray-700 dark:text-gray-300",
    }
  );
};

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const statusColors = getStatusColor(job.state as JobState);
  const { data: session } = useSession();
  return (
    <Draggable draggableId={job.id} index={index}>
      {(provided) => (
        <Dialog>
          <DialogTrigger asChild>
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              className="group bg-card p-4 rounded-lg shadow-sm mb-3 hover:shadow-md transition-all cursor-pointer border hover:border-primary/20 hover:bg-accent/50"
            >
              {job.source === "email" ? (
                <JobEmailCard
                  onView={() => {}}
                  onDelete={() => {}}
                  job={job}
                  statusColors={statusColors}
                />
              ) : (
                <OtherSourceJobCard
                  onDelete={() => {}}
                  onView={() => {}}
                  job={job}
                  statusColors={statusColors}
                />
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[85vh] max-h-[800px] flex flex-col">
            {job.source === "email" ? (
              <EmailDialogSource
                session={session}
                job={job}
                statusColors={statusColors}
              />
            ) : (
              <OtherDialogSource job={job} statusColors={statusColors} />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Draggable>
  );
};

export function JobInfo({ icon: Icon, text }: { icon: any; text?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-md bg-muted">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm">{text?.trim() ? text : "Not specified"}</span>
    </div>
  );
}
