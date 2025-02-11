import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/types";
import { merge } from "lodash";
import { v4 as uuidv4 } from "uuid";

export const initialState: ResumeData = {
  basics: [
    {
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
      name: "",
      level: "",
    },
  ],
  volunteer: [
    {
      id: uuidv4(),
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      location: "",
    },
  ],
  awards: [
    {
      id: uuidv4(),
      title: "",
      awarder: "",
      date: "",
      summary: "",
    },
  ],
  publications: [
    {
      id: uuidv4(),
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
      id: uuidv4(),
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
      id: uuidv4(),
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
      return merge({}, state, action.payload);
    },
    UpdateProfileData(state, action: PayloadAction<ResumeData>) {
      return { ...action.payload };
    },
    setFullProfileData(state, action: PayloadAction<ResumeData>) {
      return structuredClone(action.payload);
    },
    Reset() {
      return { ...initialState };
    },
    updateProfileImage(state, action) {
      if (state.basics) state.basics[0].picture = action.payload;
    },
  },
});

export const {
  UpdateProfileData,
  Reset,
  setFullProfileData,
  updatePartialProfileData,
  updateProfileImage,
} = profileSlice.actions;
export default profileSlice.reducer;
