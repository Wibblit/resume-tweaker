"use client";

import React, { useEffect } from "react";
import Tracker from "@/components/job-tracker/Tracker";
import { useSocket } from "@/components/job-tracker/SocketProvider";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const JobTracker = () => {
  const socketManager = useSocket();
  const searchParams = useSearchParams();
  const { update } = useSession();

  console.log("JobTracker component mounted");

  useEffect(() => {
    (async () => {
      if (searchParams.get("gmailConnected") === "true" && searchParams.get("email")) {
        const response = await update({
          connectedEmail: searchParams.get("email"),
        });
        console.log(response);
      }

      if (socketManager) {
        const handleNotification = (notification: any) => {
          console.log("🔔 New Notification:", notification);
        };

        socketManager.onNotification(handleNotification);

        return () => {
          socketManager.offNotification(handleNotification);
        };
      }
    })();
  }, [socketManager, searchParams]);

  return <Tracker />;
};

export default JobTracker;
