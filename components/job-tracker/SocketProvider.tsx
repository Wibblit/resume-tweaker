"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { SocketManger } from "@/lib/sockets/socketManager";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";
import {
  addNotification,
  setSheetOpen,
} from "@/slices/job-tracker/notification/notification-slice";
import { useAppDispatch } from "@/hooks/hooks";

const SocketContext = createContext<SocketManger | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const socketManagerRef = useRef<SocketManger | null>(null);
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null);
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();

  // Initialize audio element once
  useEffect(() => {
    // Create audio element only once
    if (!notificationSoundRef.current) {
      notificationSoundRef.current = new Audio("/notification.mp3");

      // Preload the audio
      notificationSoundRef.current.preload = "auto";

      // Add event listeners for debugging
      notificationSoundRef.current.addEventListener("error", (e) => {
        console.error("Audio error:", e);
      });

      notificationSoundRef.current.addEventListener("canplaythrough", () => {
        console.log("Audio ready to play");
      });
    }

    // Cleanup function
    return () => {
      if (notificationSoundRef.current) {
        notificationSoundRef.current.pause();
        notificationSoundRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    async function setUpSocket() {
      if (
        status === "authenticated" &&
        session?.user?.id &&
        session?.user.connectedEmail
      ) {
        if (!socketManagerRef.current) {
          const response = await fetch("/api/auth/token");
          const { token } = await response.json();
          socketManagerRef.current = SocketManger.getInstance(token);
          socketManagerRef.current.registerUser(session.user.id);

          // Set up notification handler just once when initializing
          socketManagerRef.current.onNotification(async (notification) => {
            console.log("🔔 New Notification:", notification);
            notification.message.forEach((job) => {
              dispatch(addNotification(job));
            });

            // Play sound with user interaction context
            if (notificationSoundRef.current) {
              // Reset the audio to the beginning
              notificationSoundRef.current.currentTime = 0;

              // Try to play the sound
              try {
                const playPromise = notificationSoundRef.current.play();

                if (playPromise !== undefined) {
                  playPromise.catch((error) => {
                    console.error("Error playing notification sound:", error);
                  });
                }
              } catch (error) {
                console.error("Error playing notification sound:", error);
              }
            }

            toast({
              title: "🔔 New Job Notification",
              description: `📩 You have received ${notification.message.length} new job notifications!`,
              action: (
                <ToastAction
                  onClick={() => {
                    dispatch(setSheetOpen(true));
                  }}
                  altText="Go to notifications"
                >
                  View
                </ToastAction>
              ),
              duration: Infinity,
            });
          });
        }

        // Handle page unload (but not reloads)
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
          const [navigationEntry] = performance.getEntriesByType(
            "navigation"
          ) as PerformanceNavigationTiming[];
          if (navigationEntry && navigationEntry.type === "reload") {
            return; // Do not disconnect on reload
          }
          socketManagerRef.current?.disconnect();
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        // Cleanup function
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }
      if (status === "unauthenticated") {
        socketManagerRef.current?.disconnect();
      }
    }

    setUpSocket();
  }, [
    session?.user?.id,
    status,
    toast,
    router,
    session?.user.connectedEmail,
    dispatch,
  ]);

  return (
    <SocketContext.Provider value={socketManagerRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
