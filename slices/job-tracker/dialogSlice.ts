import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DialogState {
  openJobId: string | null;
}

const initialState: DialogState = {
  openJobId: null,
};

const dialogSlice = createSlice({
  name: "dialog",
  initialState,
  reducers: {
    setOpenJobId: (state, action: PayloadAction<string>) => {
      state.openJobId = action.payload;
    },
    resetOpenJobId: (state) => {
      state.openJobId = null;
    },
  },
});

export const { setOpenJobId, resetOpenJobId } = dialogSlice.actions;
export default dialogSlice.reducer;
