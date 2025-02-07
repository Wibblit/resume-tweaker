import { createSlice } from "@reduxjs/toolkit";

interface userAssets {
  credits: number;
  resumeslot: number;
  coverslot: number;
  loading: boolean;
  usedresumes: number;
  usedcoverletters: number;
}

const initialState: userAssets = {
  credits: 0,
  resumeslot: 1,
  coverslot: 1,
  loading: true,
  usedresumes: 0,
  usedcoverletters: 0,
};

const userAssets = createSlice({
  name: "userassets",
  initialState,
  reducers: {
    updateCredits(state, action) {
      console.log(action.payload);
      state.credits = action.payload;
    },
    updateResumeSlot(state, action) {
      state.resumeslot = action.payload;
    },
    updateCoverSlot(state, action) {
      state.coverslot = action.payload;
    },
    updateLoadingTrue(state) {
      state.loading = true;
    },
    updateLoadingFalse(state) {
      state.loading = false;
    },
    updateUsedResumeSlots(state, action) {
      state.usedresumes = action.payload;
    },
    updateUsedCoverLetterSlots(state, action) {
      state.usedcoverletters = action.payload;
    },
  },
});

export const {
  updateCoverSlot,
  updateCredits,
  updateResumeSlot,
  updateLoadingFalse,
  updateLoadingTrue,
  updateUsedCoverLetterSlots,
  updateUsedResumeSlots,
} = userAssets.actions;
export default userAssets.reducer;
