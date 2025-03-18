"use client";

import type React from "react";
import { Draggable } from "react-beautiful-dnd";
import type { Job, JobState } from "@/types/job-tracker";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Building2, MapPin, Mail, FileEdit } from "lucide-react";
import { Separator } from "../ui/separator";
import { Badge } from "@/components/ui/badge";
import EmailDialogSource from "./EmailDialogSource";
import OtherDialogSource from "./OtherDialogSource";
import { useSession } from "next-auth/react";

interface JobCardProps {
  job: Job;
  index: number;
}

function getSourceIcon(source: string) {
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
                <JobEmailCard job={job} statusColors={statusColors} />
              ) : (
                <OtherSourceJobCard job={job} statusColors={statusColors} />
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
              <OtherDialogSource
                job={job}
                statusColors={statusColors}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </Draggable>
  );
};

export function JobInfo({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-md bg-muted">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function OtherSourceJobCard({
  job,
  statusColors,
}: {
  job: Job;
  statusColors: { bg: string; text: string };
}): JSX.Element {
  return (
    <div>
      <div className="flex items-start gap-4">
        <div className="relative">
          {job.logoSrc ? (
            <img
              src={job.logoSrc}
              alt={`${job.companyName} logo`}
              className="w-12 h-12 rounded-xl object-cover border shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-muted border shadow-sm">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
          )}
          <div
            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${statusColors.bg} ${statusColors.text}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">
              {job.jobTitle}
            </h3>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex-shrink-0 text-xs">
                {job.employmentType}
              </Badge>
            </div>
          </div>
          <div className="space-y-1.5 mt-2">
            <div className="flex items-center text-muted-foreground text-xs gap-2">
              <Building2 className="w-3.5 h-3.5" />
              <span className="truncate">{job.companyName}</span>
            </div>
            <div className="flex items-center text-muted-foreground text-xs gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span className="truncate">{job.location}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {getSourceIcon(job.source)}
          <span className="text-xs">{job.source}</span>
        </div>
        <Separator orientation="vertical" className="my-2" />
        <div className="text-xs">{job.addedOn}</div>
      </div>
    </div>
  );
}

function JobEmailCard({
  job,
  statusColors,
}: {
  job: Job;
  statusColors: { bg: string; text: string };
}): JSX.Element {
  return (
    <>
      <div>
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={
                "https://raw.githubusercontent.com/github/explore/8f19e4dbbf13418dc1b1d58bb265953553c15a46/topics/gmail/gmail.png"
              }
              alt={`${job.companyName} logo`}
              className="w-12 h-12 rounded-xl object-cover border shadow-sm"
            />
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${statusColors.bg} ${statusColors.text}`}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-sm mb-1 truncate group-hover:text-primary transition-colors">
                {job.jobTitle}
              </h3>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="flex-shrink-0 text-xs">
                  {job.employmentType}
                </Badge>
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center text-muted-foreground text-xs gap-2">
                <Building2 className="w-3.5 h-3.5" />
                <span className="truncate">{job.companyName}</span>
              </div>
              <div className="flex items-center text-muted-foreground text-xs gap-2">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{job.location}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <img
              src="https://raw.githubusercontent.com/github/explore/8f19e4dbbf13418dc1b1d58bb265953553c15a46/topics/gmail/gmail.png"
              alt="gmail image"
              className="w-4 h-4"
            />
            <span className="text-xs">{job.source}</span>
          </div>
          <Separator orientation="vertical" className="my-2" />
          <div className="text-xs">
            {new Date(job.addedOn).toLocaleString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </div>
        </div>
      </div>
    </>
  );
}
