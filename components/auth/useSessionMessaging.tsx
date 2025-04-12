"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

const useSessionMessaging = () => {
  const { data: session, status } = useSession();
  const prevStatus = useRef(status); // Store previous status

  useEffect(() => {
    // Only trigger if the status changes from unauthenticated to authenticated, or vice versa
    if (status === "loading") {
      return; // Do nothing if the status is loading
    }

    // Check if the status has changed from authenticated to unauthenticated
    if (
      prevStatus.current === "authenticated" &&
      status === "unauthenticated"
    ) {
      console.log("User logged out");

      if (
        typeof window !== "undefined" &&
        typeof chrome !== "undefined" &&
        chrome.runtime
      ) {
        // Send logout message
        const message = {
          type: "LOGOUT_SUCCESS",
        };

        chrome.runtime.sendMessage(
          (process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID || "").toString() ,
          message,
          { includeTlsChannelId: true },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError);
            } else {
              console.log("Logout message sent successfully.", response);
            }
          }
        );
      } else {
        console.warn("Chrome runtime API is not available.");
      }
    }

    // Update prevStatus to current status
    prevStatus.current = status;
  }, [session, status]); // Depend on session and status only
};

export default useSessionMessaging;
