import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData, ResumeSection } from "@/types/types";
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
      //console.log(sectionName);
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
    updateResumeImage(state, action) {
      if (state.basics) state.basics[0].picture = action.payload;
    },
  },
});

export const {
  UpdateLeftBarData,
  Reset,
  AddCustomSection,
  DeleteCustomSection,
  RenameCustomSection,
  updateResumeImage,
} = leftsidebarSlice.actions;

export default leftsidebarSlice.reducer;
