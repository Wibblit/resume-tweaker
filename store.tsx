// store.ts
"use client";
// @ts-ignore
import { configureStore, GetDefaultMiddleware } from "@reduxjs/toolkit";
// @ts-ignore
import logger from "redux-logger";
import rightsidebarReducer from "./slices/rightsidebarSlice";
import leftsidebarReducer from "./slices/leftsidebarSlice";
import interviewReducer from "./slices/interviewSlice";
import coverletterReducer from "./slices/coverletterSlice";

const store = configureStore({
  reducer: {
    rightsidebar: rightsidebarReducer,
    leftsidebar: leftsidebarReducer,
    interview: interviewReducer,
    coverletter: coverletterReducer,
  },
  middleware: (getDefaultMiddleware: GetDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
