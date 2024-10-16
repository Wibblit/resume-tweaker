import { ResumeData } from "@/types/types"

export const emptyResumeData: ResumeData = {
  basics: [
    {
      name: "",
      email: "",
      phone: "",
      location: "",
      headLine: "",
      url: { href: "", label: "" },
      picture: undefined,
    },
  ],
  summary: [{ content: "" }],
  profiles: [],
  skills: [{ id: "", categories: [] }],
  projects: [],
  education: [],
  experience: [],
  languages: [],
  volunteer: [],
  awards: [],
  publications: [],
  certifications: [],
  references: [],
}