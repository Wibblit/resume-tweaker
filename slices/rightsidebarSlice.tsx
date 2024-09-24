// redux/rightsidebarSlice.ts
// @ts-ignore
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeStyles } from "@/types/types";

// Define the initial state using that type
const initialState: ResumeStyles = {
  id: "",
  name: "",
  font: "Roboto",
  fontSize: 12,
  lineHeight: 1,
  margin: 10,
  paperFormat: "a4",
  baseColor: "#000",
};

const rightsidebarSlice = createSlice({
  name: "rightsidebar",
  initialState,
  reducers: {
    UpdateName(state, action) {
      state.name = action.payload;
    },
    UpdateFont(state, action) {
      state.font = action.payload;
    },
    UpdateFontSize(state, action) {
      state.fontSize = action.payload;
    },
    UpdateLineHeight(state, action) {
      state.lineHeight = action.payload;
    },
    UpdateMargin(state, action) {
      state.margin = action.payload;
    },
    UpdatePaperFormat(state, action) {
      state.paperFormat = action.payload;
    },
    UpdateBaseColor(state, action) {
      state.baseColor = action.payload;
    },
  },
});

// Export the actions
export const {
  UpdateBaseColor,
  UpdateFont,
  UpdateFontSize,
  UpdateLineHeight,
  UpdateMargin,
  UpdateName,
  UpdatePaperFormat,
} = rightsidebarSlice.actions;

// Export the reducer
export default rightsidebarSlice.reducer;
