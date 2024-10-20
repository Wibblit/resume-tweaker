import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/types";

const initialState: ResumeData = {
  basics: [
    {
      name: "",
      email: "",
      phone: "",
      location: "",
      headLine: "",
      picture: undefined,
      url: {
        href: "",
        label: "",
      },
    },
  ],
  summary: [
    {
      content: "",
    },
  ],
  profiles: [
    {
      url: {
        href: "",
        label: "",
      },
    },
  ],
  skills: [
    {
      id: "",
      categories: [
        {
          id: "",
          name: "",
          skills: [{ name: "", level: "" }],
        },
      ],
    },
  ],
  projects: [
    {
      name: "",
      summary: "",
      startDate: "",
      endDate: "",
      url: {
        href: "",
        label: "",
      },
      keywords: [""],
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      specialization: "",
      startDate: "",
      endDate: "",
      score: "",
    },
  ],
  experience: [
    {
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
      summary: "",
    },
  ],
  languages: [
    {
      name: "",
      level: "",
    },
  ],
  volunteer: [
    {
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
    },
  ],
  awards: [
    {
      title: "",
      awarder: "",
      date: "",
      summary: "",
    },
  ],
  publications: [
    {
      name: "",
      publisher: "",
      publishedIn: "",
      url: {
        href: "",
        label: "",
      },
      date: "",
    },
  ],
  certifications: [
    {
      name: "",
      issuer: "",
      date: "",
      url: {
        href: "",
        label: "",
      },
    },
  ],
  references: [
    {
      name: "",
      phone: "",
      email: "",
    },
  ],
};


const leftsidebarSlice = createSlice({
  name: "leftsidebar",
  initialState,
  reducers: {
    UpdateLeftBarData(state, action: PayloadAction<ResumeData>) {
      return { ...action.payload };
    },
    Reset() {
      return {...initialState}
    }
  },
});

export const { UpdateLeftBarData, Reset } = leftsidebarSlice.actions;
export default leftsidebarSlice.reducer;
