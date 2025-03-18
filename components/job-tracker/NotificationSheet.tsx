import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  setSheetOpen,
  removeNotification,
} from "@/slices/job-tracker/notification/notification-slice";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Mail, ExternalLink, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const jobStateColors = {
  bookmark: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  applied: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
  },
  shortlisted: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
  },
  interviewing: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
  negotiation: {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-700 dark:text-orange-300",
  },
};

export const NotificationSheet = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.notifications.isSheetOpen);
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const { data: session } = useSession();

  const getJobStateColors = (jobState: string) => {
    const state = jobState?.toLowerCase() as keyof typeof jobStateColors;
    return jobStateColors[state] || jobStateColors.bookmark;
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => dispatch(setSheetOpen(open))}>
      <SheetContent className="w-full sm:max-w-[400px] p-0">
        <div className="p-4 border-b sticky top-0 z-10 bg-background flex items-center justify-between">
          <SheetTitle className="text-lg font-semibold">
            Notifications
          </SheetTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => dispatch(setSheetOpen(false))}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {session?.user.connectedEmail && (
          <div className="px-4 py-2 border-b bg-muted/30">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Connected to:
              </span>
              <span className="text-sm font-medium truncate">
                {session.user.connectedEmail}
              </span>
            </div>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-64px)]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Bell className="h-10 w-10 text-muted-foreground mb-3 opacity-30" />
              <p className="text-muted-foreground text-sm">No notifications</p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => {
                const colors = getJobStateColors(notification.jobState);
                return (
                  <div
                    key={notification.id}
                    className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/30 transition-colors relative group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-sm truncate">
                            {notification.jobRole} at {notification.companyName}
                          </h3>
                          <Badge
                            className={cn(
                              "text-[10px] px-1.5 py-0 h-4 font-medium",
                              colors.bg,
                              colors.text
                            )}
                          >
                            {notification.jobState}
                          </Badge>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-1 mb-1">
                          {notification.snippet}
                        </p>

                        <div className="flex items-center text-xs text-muted-foreground gap-2">
                          <span className="truncate">
                            {notification.location}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-muted-foreground/50"></span>
                          <span className="truncate">
                            {notification.workType}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-7 text-xs px-2 rounded-md"
                            asChild
                          >
                            <a
                              href={`https://mail.google.com/mail/u/${
                                session?.user.connectedEmail || ""
                              }/#inbox/${notification.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </a>
                          </Button>
                          {notification.meetingUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2 rounded-md"
                              asChild
                            >
                              <a
                                href={notification.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Join Meeting
                              </a>
                            </Button>
                          )}

                          <span className="text-xs text-muted-foreground ml-auto">
                            {new Date(notification.date).toLocaleString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "numeric",
                                minute: "numeric",
                                hour12: true,
                              }
                            )}
                          </span>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          dispatch(removeNotification(notification.id))
                        }
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
