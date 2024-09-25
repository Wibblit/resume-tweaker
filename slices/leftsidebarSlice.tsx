import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/types";
//left sidebar

const initialState: ResumeData = {
  basics: [
    {
      name: "Vanamuthu V",
      email: "1h21sdsa@gmail.com",
      phone: "34234234",
      location: "BLR",
      headLine: "Software Engineer",
      url: {
        href: "https://resumetweaker.wibblit.com",
        label: "Wibblit",
      },
    },
  ],
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
