"use client";
import store from "@/store";
import React from "react";
import { Provider } from "react-redux";
import { SocketProvider } from "@/components/job-tracker/SocketProvider";
import AuthWrapper from "./auth/AuthWrapper";

export function ReduxWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SocketProvider>
        <AuthWrapper>{children}</AuthWrapper>
      </SocketProvider>
    </Provider>
  );
}
