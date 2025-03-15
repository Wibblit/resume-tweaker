"use client";

import React, { useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { setSheetOpen } from "@/slices/job-tracker/notification/notification-slice";
import { cn } from "@/lib/utils";

export const NotificationBell = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    (state) => state.notifications.notifications
  );
  const hasNotifications = notifications.length > 0;

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "relative h-10 w-10 rounded-full",
        "hover:bg-primary hover:text-primary-foreground",
        "transition-colors duration-200",
        hasNotifications && "ring-2 ring-primary ring-offset-2"
      )}
      onClick={() => dispatch(setSheetOpen(true))}
    >
      <Bell className="h-5 w-5" />
      {hasNotifications && (
        <span
          className={cn(
            "absolute -top-2 -right-2",
            "min-w-[1.25rem] h-5 px-1",
            "flex items-center justify-center",
            "rounded-full text-xs font-medium",
            "bg-primary text-primary-foreground",
            "shadow-sm"
          )}
        >
          {notifications.length > 99 ? "99+" : notifications.length}
        </span>
      )}
    </Button>
  );
};
