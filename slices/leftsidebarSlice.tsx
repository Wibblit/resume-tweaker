import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData } from "@/types/types";

const initialState: ResumeData = {
  basics: [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      headLine: "Experienced Software Engineer",
      picture: undefined,
      url: {
        href: "https://johndoe.com",
        label: "Personal Website",
      },
    },
  ],
  summary: [
    {
      content:
        "Passionate software engineer with 5+ years of experience in developing scalable web applications.",
    },
  ],
  profiles: [
    {
      url: {
        href: "https://linkedin.com/in/johndoe",
        label: "LinkedIn",
      },
    },
    {
      url: {
        href: "https://github.com/johndoe",
        label: "GitHub",
      },
    },
  ],
  skills: [
    {
      id: "tech-skills",
      categories: [
        {
          id: "programming-languages",
          name: "Programming Languages",
          skills: [
            { name: "JavaScript", level: "Advanced" },
            { name: "Python", level: "Intermediate" },
            { name: "Java", level: "Beginner" },
          ],
        },
        {
          id: "frameworks",
          name: "Frameworks",
          skills: [
            { name: "React", level: "Advanced" },
            { name: "Node.js", level: "Intermediate" },
            { name: "Django", level: "Beginner" },
          ],
        },
      ],
    },
  ],
  projects: [
    {
      name: "E-commerce Platform",
      summary:
        "Developed a full-stack e-commerce platform using React and Node.js",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
      url: {
        href: "https://github.com/johndoe/ecommerce-platform",
        label: "GitHub Repository",
      },
      keywords: ["React", "Node.js", "MongoDB", "Express"],
    },
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor of Science",
      field: "Computer Science",
      specialization: "Software Engineering",
      startDate: "2015-09-01",
      endDate: "2019-05-31",
      score: "3.8 GPA",
    },
  ],
  experience: [
    {
      organization: "Tech Solutions Inc.",
      role: "Senior Software Engineer",
      startDate: "2019-06-01",
      endDate: "Present",
      location: "New York, NY",
      summary:
        "Lead developer for multiple web applications, mentoring junior developers, and implementing best practices.",
    },
  ],
  languages: [
    {
      name: "English",
      level: "Adavanced",
    },
    {
      name: "Spanish",
      level: "Intermediate",
    },
  ],
  volunteer: [
    {
      organization: "Code for Good",
      role: "Volunteer Developer",
      startDate: "2020-01-01",
      endDate: "Present",
      location: "Remote",
    },
  ],
  awards: [
    {
      title: "Best Innovative Project",
      awarder: "Annual Tech Conference",
      date: "2021-11-15",
      summary:
        "Awarded for developing an AI-powered accessibility tool for websites.",
    },
  ],
  publications: [
    {
      name: "Modern Web Development Techniques",
      publisher: "Tech Journal",
      publishedIn: "Volume 5, Issue 2",
      url: {
        href: "https://techjournal.com/article123",
        label: "Article Link",
      },
      date: "2022-03-01",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer - Associate",
      issuer: "Amazon Web Services",
      date: "2021-08-15",
      url: {
        href: "https://www.youracclaim.com/badges/aws-certified-developer",
        label: "Verify Certification",
      },
    },
  ],
  references: [
    {
      name: "Jane Smith",
      phone: "+1 (555) 987-6543",
      email: "jane.smith@techsolutions.com",
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
  },
});

export const { UpdateLeftBarData } = leftsidebarSlice.actions;
export default leftsidebarSlice.reducer;
