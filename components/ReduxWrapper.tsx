'use client'
import store from "@/store";
import React from "react";
import { Provider } from "react-redux";

export function ReduxWrapper({children}:{children:React.ReactNode}) {
    return <Provider store={store}>{children}</Provider>
}