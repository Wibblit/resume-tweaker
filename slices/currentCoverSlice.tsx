import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CurrentResumeState {
  currCoverName: string;
  currCoverId: string;
}

const initialState: CurrentResumeState = {
  currCoverName: "",
  currCoverId: "",
};

export const currentResumeSlice = createSlice({
  name: "currentResume",
  initialState,
  reducers: {
    setCurrentCover: (state, action: PayloadAction<CurrentResumeState>) => {
      state.currCoverName = action.payload.currCoverName;
      state.currCoverId = action.payload.currCoverId;
    },
    clearCurrentCover: (state) => {
      state.currCoverName = "";
      state.currCoverId = "";
    },
  },
});

export const { setCurrentCover, clearCurrentCover } =
  currentResumeSlice.actions;

export default currentResumeSlice.reducer;