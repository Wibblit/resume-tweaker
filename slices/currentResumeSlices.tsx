import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CurrentResumeState {
  currResumeName: string;
  currResumeId: string;
}

const initialState: CurrentResumeState = {
  currResumeName: "",
  currResumeId: "",
};

export const currentResumeSlice = createSlice({
  name: 'currentResume',
  initialState,
  reducers: {
    setCurrentResume: (state, action: PayloadAction<CurrentResumeState>) => {
      state.currResumeName = action.payload.currResumeName;
      state.currResumeId = action.payload.currResumeId;
    },
    clearCurrentResume: (state) => {
      state.currResumeName = "";
      state.currResumeId = "";
    },
  },
});

export const { setCurrentResume, clearCurrentResume } = currentResumeSlice.actions;

export default currentResumeSlice.reducer;