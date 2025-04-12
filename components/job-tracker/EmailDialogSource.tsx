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
  Link2,
  Mail,
  Calendar,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { JobInfo } from "./JobCard";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { gmailLogo } from "@/lib/client/Urls";
import { formatDate } from "@/lib/client/helperFunctions";

const EmailDialogSource = ({
  job,
  statusColors,
  session,
}: {
  job: Job;
  statusColors: {
    bg: string;
    text: string;
  };
  session: any;
}) => {
  const emailUrl = session?.user.connectedEmail
    ? `https://mail.google.com/mail/u/${session.user.connectedEmail}/#inbox/${job.id}`
    : null;

  const formatMeetingTime = (url: string) => {
    // This is a placeholder - you would typically parse the meeting time from the URL
    // or have it as a separate field in the job object
    return "Scheduled meeting time";
  };

  return (
    <>
      <DialogHeader className="flex flex-col gap-6">
        <div className="flex items-start gap-6">
          <img
            src={gmailLogo}
            alt={`${job.companyName} logo`}
            className="w-24 h-24 rounded-2xl object-cover border shadow-sm"
          />

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
              <JobInfo
                icon={Briefcase}
                text={job.employmentType ?? "Not specified"}
              />
              <JobInfo icon={Clock} text={job.workType ?? "Not specified"} />
              <JobInfo
                icon={DollarSign}
                text={job.salaryRange ?? "Not specified"}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {job.meetingUrl ? (
            <Button
              className="flex-1"
              variant="default"
              onClick={() =>
                window.open(job.meetingUrl, "_blank", "noopener,noreferrer")
              }
            >
              <Video className="w-4 h-4 mr-2" />
              Prepare interview
            </Button>
          ) : (
            <Button className="flex-1">
              <Video className="w-4 h-4 mr-2" />
              Prepare for interview
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1"
            onClick={() =>
              emailUrl && window.open(emailUrl, "_blank", "noopener,noreferrer")
            }
          >
            <Mail className="w-4 h-4 mr-2" />
            View Email
          </Button>
        </div>
      </DialogHeader>
      <Separator className="my-6" />
      <ScrollArea className="flex-1 pr-6">
        <div className="space-y-6">
          {job.meetingUrl && (
            <>
              <div className="bg-accent/40 rounded-lg p-4 border">
                <h4 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Meeting Details
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{formatMeetingTime(job.meetingUrl)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Link2 className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={job.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {job.meetingUrl}
                    </a>
                  </div>
                  <Button
                    variant="secondary"
                    className="w-full mt-2"
                    onClick={() =>
                      window.open(
                        job.meetingUrl,
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Join Video Meeting
                  </Button>
                </div>
              </div>
              <Separator />
            </>
          )}
          <div>
            <h4 className="text-xl font-semibold mb-4">Email snippet</h4>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    job.jobDescription +
                    `....<a href="${emailUrl}" target="_blank" rel="noopener noreferrer">read more</a>`,
                }}
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
                    <img src={gmailLogo} className="w-4 h-4" />
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

export default EmailDialogSource;
