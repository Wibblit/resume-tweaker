import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/types";

export const initialState: ResumeData = {
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
      name: "",
      skills: [{ name: "", level: "" }],
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

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    updatePartialProfileData(
      state,
      action: PayloadAction<Partial<ResumeData>>
    ) {
      return { ...state, ...action.payload };
    },
    UpdateProfileData(state, action: PayloadAction<ResumeData>) {
      return { ...action.payload };
    },
    setFullProfileData(state, action: PayloadAction<ResumeData>) {
      return { ...action.payload };
    },
    Reset() {
      return { ...initialState };
    },
  },
});

export const {
  UpdateProfileData,
  Reset,
  setFullProfileData,
  updatePartialProfileData,
} = profileSlice.actions;
export default profileSlice.reducer;
