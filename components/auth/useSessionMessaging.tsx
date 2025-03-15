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

    if (prevStatus.current !== status) {
      console.log("Status changed:", prevStatus.current, "->", status);

      if (
        typeof window !== "undefined" &&
        typeof chrome !== "undefined" &&
        chrome.runtime
      ) {
        if (status === "authenticated" && session) {
          // User logged in
          const message = {
            type: "LOGIN_SUCCESS",
            user: session.user,
          };

          chrome.runtime.sendMessage(
            process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID || "enjomipibdefinafkiecghmabelfpjio",
            message,
            { includeTlsChannelId: true },
            (response) => {
              if (chrome.runtime.lastError) {
                console.error("Error sending message:", chrome.runtime.lastError);
              } else {
                console.log("Login message sent successfully.", response);
              }
            }
          );
        } else if (status === "unauthenticated") {
          // User logged out
          const message = {
            type: "LOGOUT_SUCCESS",
          };

          chrome.runtime.sendMessage(
            "enjomipibdefinafkiecghmabelfpjio",
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
        }
      } else {
        console.warn("Chrome runtime API is not available.");
      }

      // Update prevStatus to current status
      prevStatus.current = status;
    }
  }, [session, status]); // Depend on session and status only

};

export default useSessionMessaging;
