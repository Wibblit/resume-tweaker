import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Job, JobState } from "@/types/job-tracker";
import { addNotification } from "./notification/notification-slice";

// Define the state interface
interface JobsState {
  items: Job[]; // Current state
  initialItems: Job[]; // Original state from the DB
  hasUnsavedChanges: boolean;
}

// Define initial state
const initialState: JobsState = {
  items: [],
  initialItems: [],
  hasUnsavedChanges: false,
};

// Function to check if the current state is different from the initial state
const hasStateChanged = (items: Job[], initialItems: Job[]): boolean => {
  return JSON.stringify(items) !== JSON.stringify(initialItems);
};

// Create the slice
const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    // Set jobs when fetched from the database
    setJobs: (state, action: PayloadAction<Job[]>) => {
      state.items = action.payload;
      state.initialItems = action.payload.map((job) => ({ ...job })); // Deep clone each job
      state.hasUnsavedChanges = false; // Reset unsaved changes
    },

    // Add a new job
    addJob: (state, action: PayloadAction<Job>) => {
      state.items.push(action.payload);
      state.hasUnsavedChanges = hasStateChanged(
        state.items,
        state.initialItems
      );
    },

    // Update a job's state (move it to a different column)
    updateJobState: (
      state,
      action: PayloadAction<{ jobId: string; newState: JobState }>
    ) => {
      const job = state.items.find((job) => job.id === action.payload.jobId);
      if (job) {
        console.log(action.payload.newState);
        job.state = action.payload.newState;
        state.hasUnsavedChanges = hasStateChanged(
          state.items,
          state.initialItems
        );
      }
    },

    // Remove a job
    removeJob: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((job) => job.id !== action.payload);
      state.hasUnsavedChanges = hasStateChanged(
        state.items,
        state.initialItems
      );
    },

    // Reset the hasUnsavedChanges flag (after syncing with the database)
    resetUnsavedChanges: (state, action: PayloadAction<void>) => {
      state.initialItems = state.items.map((job) => ({ ...job })); // Deep clone each job
      state.hasUnsavedChanges = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addNotification, (state, action) => {
      const job: Job = {
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

      state.items.push(job);
      state.hasUnsavedChanges = hasStateChanged(
        state.items,
        state.initialItems
      );
    });
  },
});

// Export actions
export const {
  addJob,
  updateJobState,
  removeJob,
  setJobs,
  resetUnsavedChanges,
} = jobSlice.actions;

// Export reducer
export default jobSlice.reducer;
