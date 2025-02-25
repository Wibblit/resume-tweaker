// store.ts
"use client";
// @ts-ignore
import { configureStore } from "@reduxjs/toolkit";
// @ts-ignore
import logger from "redux-logger";
import rightsidebarReducer from "./slices/rightsidebarSlice";
import leftsidebarReducer from "./slices/leftsidebarSlice";
import interviewReducer from "./slices/interviewSlice";
import coverletterReducer from "./slices/coverletterSlice";
import currentResumeReducer from "./slices/currentResumeSlices";
import currentCoverLetterReducer from "./slices/currentCoverSlice";
import profileReducer from "./slices/profileSlice";
import pageReducer from "./slices/addPageSlice";
import userAssets from "./slices/userAssets";

const store = configureStore({
  reducer: {
    rightsidebar: rightsidebarReducer,
    leftsidebar: leftsidebarReducer,
    interview: interviewReducer,
    coverletter: coverletterReducer,
    currentResume: currentResumeReducer,
    currentCoverLetter: currentCoverLetterReducer,
    profile: profileReducer,
    page: pageReducer,
    assets: userAssets,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
