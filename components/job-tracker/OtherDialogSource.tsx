import React from "react";
import { DialogHeader, DialogTitle } from "../ui/dialog";
import { Job } from "@/types/job-tracker";
import {
  Building2,
  ExternalLink,
  Video,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  CalendarIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { getSourceIcon, JobInfo } from "./JobCard";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { formatDate } from "@/lib/client/helperFunctions";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/hooks/hooks";

const OtherDialogSource = ({
  job,
  statusColors,
}: {
  job: Job;
  statusColors: {
    bg: string;
    text: string;
  };
}) => {
  const router = useRouter();
  const jobs = useAppSelector((state) => state.jobs.items);

  const handleInterview = (jobId: string) => {
    const job = jobs.find((job) => job.id === jobId);
    if (job) {
      const jobParam = new URLSearchParams({
        jobTitle: job.jobTitle,
        jobDescription: job.jobDescription,
        companyName: job.companyName,
        fromKanban: "true",
      }).toString();
      router.push(`/home/ai-interview?${jobParam}`);
    }
  };

  return (
    <>
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
              <JobInfo icon={MapPin} text={job.location ?? "Not specified"} />
              <JobInfo icon={Briefcase} text={job.employmentType} />
              <JobInfo icon={Clock} text={job.workType ?? "Not specified"} />
              <JobInfo
                icon={DollarSign}
                text={job.salaryRange ?? "Not specified"}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleInterview(job.id)} className="flex-1">
            <Video className="w-4 h-4 mr-2" />
            Prepare for interview yoji
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
            <h4 className="text-xl font-semibold mb-4">Job Description</h4>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{ __html: job.jobDescription }}
                className="job-description"
              />
            </div>
          </div>
          <Separator />
          <div>
            <h4 className="text-xl font-semibold mb-4">Application Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Added on:</span>
                <span>{formatDate(job.addedOn)}</span>
              </div>
              {job.source && (
                <div className="flex items-center gap-3 text-sm">
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Source:</span>
                  <span className="flex gap-x-2 items-center">
                    {job.source}
                    {getSourceIcon(job.source)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </>
  );
};

export default OtherDialogSource;
