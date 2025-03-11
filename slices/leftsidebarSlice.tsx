import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData, ResumeSection } from "@/types/types";

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

const leftsidebarSlice = createSlice({
  name: "leftsidebar",
  initialState,
  reducers: {
    UpdateLeftBarData(state, action: PayloadAction<ResumeData>) {
      return { ...action.payload };
    },
    Reset() {
      return { ...initialState };
    },
    AddCustomSection(state, action: PayloadAction<string>) {
      const sectionName = action.payload.toLowerCase();
      return {
        ...state,
        [sectionName]: [],
      };
    },
    DeleteCustomSection(state, action: PayloadAction<string>) {
      const sectionName = action.payload.toLowerCase();
      console.log(sectionName)
      //@ts-ignore
      const { [sectionName]: deletedSection, ...restState } = state;
      return restState as ResumeData;
    },
    RenameCustomSection(
      state,
      action: PayloadAction<{ oldName: string; newName: string }>
    ) {
      const { oldName, newName } = action.payload;
      if (oldName.toLowerCase() in state && !(newName.toLowerCase() in state)) {
        //@ts-ignore
        const { [oldName.toLowerCase(0)]: oldSection, ...restState } = state;
        return {
          ...restState,
          [newName.toLowerCase()]: oldSection,
        } as ResumeData;
      }
      return state;
    },
  },
});

export const {
  UpdateLeftBarData,
  Reset,
  AddCustomSection,
  DeleteCustomSection,
  RenameCustomSection,
} = leftsidebarSlice.actions;

export default leftsidebarSlice.reducer;
