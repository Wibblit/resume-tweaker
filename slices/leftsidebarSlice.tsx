import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/types";
//left sidebar

const initialState: ResumeData = {
  basics: [],
  summary: [],
  profiles: [],
  skills: [],
  projects: [],
  education: [],
  experience: [],
  languages: [],
  volunteer: [],
  awards: [],
  publications: [],
  certifications: [],
  references: [],
};

const leftsidebarSlice = createSlice({
  name: "leftsidebar",
  initialState,
  reducers: {
    UpdateLeftBarData(state, action: PayloadAction<ResumeData>) {
      return { ...action.payload };
    },
  },
});

export const { UpdateLeftBarData } = leftsidebarSlice.actions;
export default leftsidebarSlice.reducer;
