import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
  },
});

export const { setSheetOpen, addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;
