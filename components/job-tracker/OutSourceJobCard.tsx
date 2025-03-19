import { Separator } from "@/components/ui/separator";
import { Building2, MapPin, MoreVertical, Trash2, Eye } from "lucide-react";
import { Job } from "@/types/job-tracker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { getSourceIcon } from "./JobCard";
import { formatDate } from "@/lib/client/helperFunctions";

export function OtherSourceJobCard({
  job,
  statusColors,
  onDelete,
  onView,
}: {
  job: Job;
  statusColors: { bg: string; text: string };
  onDelete: () => Promise<void>;
  onView: () => void;
}): JSX.Element {
  return (
    <div className="group relative">
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-muted -mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-40 p-1"
                align="end"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView();
                  }}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete Job Application
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this job application?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async (e) => {
                          e.stopPropagation();
                          await onDelete();
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-1.5 mt-1">
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
        <div className="text-xs">{formatDate(job.addedOn)}</div>
      </div>
    </div>
  );
}
