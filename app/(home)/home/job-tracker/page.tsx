// "use client";

// import React, { useEffect } from "react";
// import Tracker from "@/components/job-tracker/Tracker";
// import { useSocket } from "@/components/job-tracker/SocketProvider";
// import { useSession } from "next-auth/react";
// import { useSearchParams } from "next/navigation";

// const JobTracker = () => {
//   const socketManager = useSocket();
//   const searchParams = useSearchParams();
//   const { update } = useSession();

//   console.log("JobTracker component mounted");

//   useEffect(() => {
//     (async () => {
//       if (searchParams.get("gmailConnected") === "true" && searchParams.get("email")) {
//         const response = await update({
//           connectedEmail: searchParams.get("email"),
//         });
//         console.log(response);
//       }

//       if (socketManager) {
//         const handleNotification = (notification: any) => {
//           console.log("🔔 New Notification:", notification);
//         };

//         socketManager.onNotification(handleNotification);

//         return () => {
//           socketManager.offNotification(handleNotification);
//         };
//       }
//     })();
//   }, [socketManager, searchParams]);

//   return <Tracker />;
// };

// export default JobTracker;

"use client";

import React, { useEffect, useRef } from "react";
import Tracker from "@/components/job-tracker/Tracker";
import { useSocket } from "@/components/job-tracker/SocketProvider";
import { useSession } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

const JobTracker = () => {
  const socketManager = useSocket();
  const searchParams = useSearchParams();
  const { data: session, update, } = useSession();
  const router = useRouter();
  const hasUpdatedRef = useRef(false);

  console.log("JobTracker component mounted");

  // Handle Gmail connection
  useEffect(() => {
    const handleGmailConnection = async () => {
      // Check if parameters exist and haven't been processed yet
      if (
        searchParams.get("gmailConnected") === "true" &&
        searchParams.get("email") &&
        session &&
        !hasUpdatedRef.current
      ) {
        const email = searchParams.get("email");
        console.log("Gmail connected with email:", email);

        // Mark as processed
        hasUpdatedRef.current = true;

        try {
          // Update session directly
          await update({
            connectedEmail: email,
          });

        } catch (error) {
          console.error("Failed to update session:", error);
        }
      }
    };

    handleGmailConnection();
  }, [searchParams, session, update, router]);

  // Log session changes
  useEffect(() => {
    if (session) {
      console.log("Current session:", JSON.stringify(session, null, 2));
    }
  }, [session]);

  // Socket notification setup
  useEffect(() => {
    if (!socketManager) return;

    const handleNotification = (notification: any) => {
      console.log("🔔 New Notification:", notification);
    };

    socketManager.onNotification(handleNotification);

    return () => {
      socketManager.offNotification(handleNotification);
    };
  }, [socketManager]);

  return <Tracker />;
};

export default JobTracker;
