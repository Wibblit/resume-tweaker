import { createSlice } from "@reduxjs/toolkit";

interface userAssets {
  credits: number;
  resumeslot: number;
  coverslot: number;
  loading: boolean;
}

const initialState: userAssets = {
  credits: 0,
  resumeslot: 1,
  coverslot: 1,
  loading: true,
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
  },
});

export const {
  updateCoverSlot,
  updateCredits,
  updateResumeSlot,
  updateLoadingFalse,
  updateLoadingTrue,
} = userAssets.actions;
export default userAssets.reducer;
