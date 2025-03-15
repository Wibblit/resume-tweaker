"use client";

import type React from "react";
import { Draggable } from "react-beautiful-dnd";
import type { Job, JobState } from "@/types/job-tracker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Building2,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  ExternalLink,
  Briefcase,
  Mail,
  Video,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "../ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface JobCardProps {
  job: Job;
  index: number;
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
                      <Badge
                        variant="secondary"
                        className="flex-shrink-0 text-xs"
                      >
                        {job.employmentType}
                      </Badge>
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
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] h-[85vh] max-h-[800px] flex flex-col">
            <DialogHeader className="flex flex-col gap-6">
              <div className="flex items-start gap-6">
                {job.logoSrc ? (
                  <img
                    src={job.logoSrc}
                    alt={`${job.companyName} logo`}
                    className="w-24 h-24 rounded-2xl object-cover border shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-2xl bg-muted border shadow-sm">
                    <Building2 className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <DialogTitle className="text-2xl font-bold">
                        {job.jobTitle}
                      </DialogTitle>
                      <p className="text-lg text-muted-foreground mt-1">
                        {job.companyName}
                      </p>
                    </div>
                    <Badge
                      className={`${statusColors.bg} ${statusColors.text} text-sm px-3 py-1`}
                    >
                      {job.state}
                    </Badge>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 mt-4">
                    <JobInfo
                      icon={MapPin}
                      text={job.location ?? "Not specified"}
                    />
                    <JobInfo icon={Briefcase} text={job.employmentType} />
                    <JobInfo
                      icon={Clock}
                      text={job.workType ?? "Not specified"}
                    />
                    <JobInfo
                      icon={DollarSign}
                      text={job.salaryRange ?? "Not specified"}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1">
                  <Video className="w-4 h-4 mr-2" />
                  Prepare for interview
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() =>
                    window.open(job.url!, "_blank", "noopener,noreferrer")
                  }
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View External
                </Button>
              </div>
            </DialogHeader>
            <Separator className="my-6" />
            <ScrollArea className="flex-1 pr-6">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xl font-semibold mb-4">
                    Job Description
                  </h4>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div
                      dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                      className="job-description"
                    />
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="text-xl font-semibold mb-4">
                    Application Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Added on:</span>
                      <span>{job.addedOn}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        Last updated:
                      </span>
                      <span>March 18, 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </Draggable>
  );
};

function JobInfo({ icon: Icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-md bg-muted">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm">{text}</span>
    </div>
  );
}
