// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// interface URL {
//   href: string;
//   label: string;
// }

// interface Profile {
//   url: URL;
// }

// interface Skill {
//   name: string;
//   level: string;
// }

// interface SkillCategory {
//   id: string;
//   name: string;
//   skills: Skill[];
// }

// interface Experience {
//   organization: string;
//   role: string;
//   startDate: string;
//   endDate: string;
//   location: string;
//   summary: string;
// }

// interface Education {
//   institution: string;
//   degree: string;
//   field: string;
//   specialization: string;
//   startDate: string;
//   endDate: string;
//   score: string;
// }

// interface Project {
//   name: string;
//   summary: string;
//   startDate: string;
//   endDate: string;
//   url: URL;
//   keywords: string[];
// }

// interface Language {
//   name: string;
//   level: string;
// }

// interface Volunteer {
//   organization: string;
//   role: string;
//   startDate: string;
//   endDate: string;
//   location: string;
// }

// interface Award {
//   title: string;
//   awarder: string;
//   date: string;
//   summary: string;
// }

// interface Publication {
//   name: string;
//   publisher: string;
//   publishedIn: string;
//   url: URL;
//   date: string;
// }

// interface Certification {
//   name: string;
//   issuer: string;
//   date: string;
//   url: URL;
// }

// interface Reference {
//   name: string;
//   phone: string;
//   email: string;
// }

// export interface ResumeData {
//   basics: {
//     name: string;
//     email: string;
//     phone: string;
//     location: string;
//     headLine: string;
//     picture?: string;
//     url: URL;
//   }[];
//   summary: { content: string }[];
//   profiles: Profile[];
//   skills: { id: string; categories: SkillCategory[] }[];
//   projects: Project[];
//   education: Education[];
//   experience: Experience[];
//   languages: Language[];
//   volunteer: Volunteer[];
//   awards: Award[];
//   publications: Publication[];
//   certifications: Certification[];
//   references: Reference[];
// }

// const initialState: ResumeData = {
//   basics: [
//     {
//       name: "",
//       email: "",
//       phone: "",
//       location: "",
//       headLine: "",
//       picture: undefined,
//       url: { href: "", label: "" },
//     },
//   ],
//   summary: [{ content: "" }],
//   profiles: [],
//   skills: [{ id: "", categories: [] }],
//   projects: [],
//   education: [],
//   experience: [],
//   languages: [],
//   volunteer: [],
//   awards: [],
//   publications: [],
//   certifications: [],
//   references: [],
// };

// const profileSlice = createSlice({
//   name: "profile",
//   initialState,
//   reducers: {
//     updateBasics: (
//       state,
//       action: PayloadAction<{ field: string; value: any }>
//     ) => {
//       const { field, value } = action.payload;
//       state.basics[0] = { ...state.basics[0], [field]: value };
//     },
//     updateProfileSection: (
//       state,
//       action: PayloadAction<{ section: keyof ResumeData; data: any }>
//     ) => {
//       const { section, data } = action.payload;
//       state[section] = data;
//     },
//     updateNestedField: (
//       state,
//       action: PayloadAction<{
//         section: keyof ResumeData;
//         index: number;
//         field: string;
//         value: any;
//       }>
//     ) => {
//       const { section, index, field, value } = action.payload;
//       if (Array.isArray(state[section])) {
//         (state[section] as any[])[index] = {
//           ...(state[section] as any[])[index],
//           [field]: value,
//         };
//       }
//     },
//     addItemToSection: (
//       state,
//       action: PayloadAction<{ section: keyof ResumeData; item: any }>
//     ) => {
//       const { section, item } = action.payload;
//       if (Array.isArray(state[section])) {
//         (state[section] as any[]).push(item);
//       }
//     },
//     removeItemFromSection: (
//       state,
//       action: PayloadAction<{ section: keyof ResumeData; index: number }>
//     ) => {
//       const { section, index } = action.payload;
//       if (Array.isArray(state[section])) {
//         (state[section] as any[]).splice(index, 1);
//       }
//     },
//     updateSkillCategory: (
//       state,
//       action: PayloadAction<{
//         categoryIndex: number;
//         field: string;
//         value: any;
//       }>
//     ) => {
//       const { categoryIndex, field, value } = action.payload;
//       state.skills[0].categories[categoryIndex] = {
//         ...state.skills[0].categories[categoryIndex],
//         [field]: value,
//       };
//     },
//     addSkillToCategory: (
//       state,
//       action: PayloadAction<{ categoryIndex: number; skill: Skill }>
//     ) => {
//       const { categoryIndex, skill } = action.payload;
//       state.skills[0].categories[categoryIndex].skills.push(skill);
//     },
//     removeSkillFromCategory: (
//       state,
//       action: PayloadAction<{ categoryIndex: number; skillIndex: number }>
//     ) => {
//       const { categoryIndex, skillIndex } = action.payload;
//       state.skills[0].categories[categoryIndex].skills.splice(skillIndex, 1);
//     },
//     addSkillCategory: (state, action: PayloadAction<SkillCategory>) => {
//       state.skills[0].categories.push(action.payload);
//     },
//     removeSkillCategory: (state, action: PayloadAction<number>) => {
//       state.skills[0].categories.splice(action.payload, 1);
//     },
//     addProfile: (state, action: PayloadAction<Profile>) => {
//       state.profiles.push(action.payload);
//     },
//     updateProfile: (
//       state,
//       action: PayloadAction<{ index: number; url: URL }>
//     ) => {
//       const { index, url } = action.payload;
//       state.profiles[index].url = url;
//     },
//     removeProfile: (state, action: PayloadAction<number>) => {
//       state.profiles.splice(action.payload, 1);
//     },
//     setFullProfileData: (state, action: PayloadAction<ResumeData>) => {
//       return action.payload;
//     },
//     resetProfileData: () => initialState,
//   },
// });

// export const {
//   updateBasics,
//   updateProfileSection,
//   updateNestedField,
//   addItemToSection,
//   removeItemFromSection,
//   updateSkillCategory,
//   addSkillToCategory,
//   removeSkillFromCategory,
//   addSkillCategory,
//   removeSkillCategory,
//   addProfile,
//   updateProfile,
//   removeProfile,
//   setFullProfileData,
//   resetProfileData,
// } = profileSlice.actions;

// export default profileSlice.reducer;

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

export const { UpdateProfileData, Reset, setFullProfileData } = profileSlice.actions;
export default profileSlice.reducer;