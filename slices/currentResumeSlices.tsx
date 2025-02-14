import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  UpdateLeftBarData,
  AddCustomSection,
  DeleteCustomSection,
  RenameCustomSection,
  Reset,
} from "./leftsidebarSlice";

interface CurrentResumeState {
  currResumeName: string;
  currResumeId: string;
  isSave: boolean;
}

const initialState: CurrentResumeState = {
  currResumeName: "",
  currResumeId: "",
  isSave: true,
};

export const currentResumeSlice = createSlice({
  name: "currentResume",
  initialState,
  reducers: {
    setCurrentResume: (state, action) => {
      state.currResumeName = action.payload.currResumeName;
      state.currResumeId = action.payload.currResumeId;
    },
    clearCurrentResume: (state) => {
      state.currResumeName = "";
      state.currResumeId = "";
    },
    updateResumeIsSave: (state, action) => {
      state.isSave = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(UpdateLeftBarData, (state) => {
        state.isSave = true;
      })
      .addCase(Reset, (state) => {
        state.isSave = true;
      })
      .addCase(RenameCustomSection, (state) => {
        state.isSave = true;
      })
      .addCase(AddCustomSection, (state) => {
        state.isSave = true;
      }).addCase(DeleteCustomSection, (state) => {
        state.isSave = true;
      });
  },
});

export const { setCurrentResume, clearCurrentResume, updateResumeIsSave } =
  currentResumeSlice.actions;

export default currentResumeSlice.reducer;
