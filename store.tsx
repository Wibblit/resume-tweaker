"use client";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
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
import jobReducer from "./slices/job-tracker/job-slice";
import notificationReducer from "./slices/job-tracker/notification/notification-slice";

// Persist config for notifications only
const notificationPersistConfig = {
  key: "notifications",
  storage,
  whitelist: ["notifications"], // Persist only the `notifications` state
};

const rootReducer = combineReducers({
  rightsidebar: rightsidebarReducer,
  leftsidebar: leftsidebarReducer,
  interview: interviewReducer,
  coverletter: coverletterReducer,
  currentResume: currentResumeReducer,
  currentCoverLetter: currentCoverLetterReducer,
  profile: profileReducer,
  page: pageReducer,
  assets: userAssets,
  jobs: jobReducer,
  notifications: persistReducer(notificationPersistConfig, notificationReducer), // Persisted
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check for redux-persist
    }).concat(logger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
