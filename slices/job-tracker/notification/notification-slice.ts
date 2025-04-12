import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JobStorage } from "@/lib/services/JobStorage";
import { JobState } from "@/types/job-tracker";
import { addJob } from "../job-slice";

interface NotificationState {
  isSheetOpen: boolean;
  notifications: Array<{
    id: string;
    jobState: "Applied" | "Shortlisted" | "Interviewing" | "Negotiation";
    snippet: string;
    jobRole: string;
    companyName: string;
    location: string;
    workType: string;
    meetingUrl: string;
    date: string;
  }>;
}

const initialState: NotificationState = {
  isSheetOpen: false,
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setSheetOpen: (state, action: PayloadAction<boolean>) => {
      state.isSheetOpen = action.payload;
    },
    addNotification: (
      state,
      action: PayloadAction<{
        id: string;
        jobState: "Applied" | "Shortlisted" | "Interviewing" | "Negotiation";
        snippet: string;
        jobRole: string;
        companyName: string;
        location: string;
        workType: string;
        meetingUrl: string;
        date: string;
      }>
    ) => {
      state.notifications.unshift({
        ...action.payload,
      });
      const job = {
        id: action.payload.id,
        jobTitle: action.payload.jobRole,
        location: action.payload.location,
        companyName: action.payload.companyName,
        logoSrc: null,
        jobDescription: action.payload.snippet,
        workType: action.payload.workType,
        employmentType: "",
        meetingUrl: action.payload.meetingUrl,
        state: action.payload.jobState.toLowerCase() as JobState,
        addedOn: action.payload.date,
        source: "email",
        salaryRange: "",
        url: "",
      };
      JobStorage.addJob(job);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const {
  setSheetOpen,
  addNotification,
  removeNotification,
  clearNotifications,
} = notificationSlice.actions;
export default notificationSlice.reducer;
