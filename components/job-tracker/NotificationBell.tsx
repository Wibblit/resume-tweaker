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
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => dispatch(setSheetOpen(true))}
    >
      <Bell className="h-5 w-5" />
      {hasNotifications && (
        <span
          className={cn(
            "absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500",
            "animate-pulse"
          )}
        />
      )}
    </Button>
  );
};
