import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateCoverLetter } from "./coverletterSlice";

interface CurrentResumeState {
  currCoverName: string;
  currCoverId: string;
  isSave: boolean;
}

const initialState: CurrentResumeState = {
  currCoverName: "",
  currCoverId: "",
  isSave: true,
};

export const currentResumeSlice = createSlice({
  name: "currentResume",
  initialState,
  reducers: {
    setCurrentCover: (state, action) => {
      state.currCoverName = action.payload.currCoverName;
      state.currCoverId = action.payload.currCoverId;
    },
    clearCurrentCover: (state) => {
      state.currCoverName = "";
      state.currCoverId = "";
    },
    updateCoverLetterIsSave: (state, action) => {
      state.isSave = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateCoverLetter, (state) => {
      state.isSave = true;
    });
  },
});

export const { setCurrentCover, clearCurrentCover, updateCoverLetterIsSave } =
  currentResumeSlice.actions;

export default currentResumeSlice.reducer;
