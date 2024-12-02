export type BlogType = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
};

type Template = {
  id: number;
  name: string;
};

//RightSideBar
// In your types file (e.g., @/types/types.ts)
export type SectionName =
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "profiles"
  | "basics"
  | "references"
  | "volunteer"
  | "publications"
  | "awards"
  | string;
  
export type ResumeStyles = Template & {
  font: string;
  fontSize: 0 | 10 | 11 | 12 | 13 | 14 | 15 | 16;
  lineHeight: number;
  margin: 0 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15;
  paperFormat: "a4" | "letter";
  baseColor: string;
  icons: boolean;
  separator: boolean;
  sectionOrder: {
    sections: [{ column1: SectionName[]; column2: SectionName[] }];
    column3: SectionName[];
  };
  sections: string[];
};

export interface CoverLetterState {
  salutation: string; // Plain text input for greeting
  date: string; // Date input
  senderInfo: string;
  recipientInfo: string; // Plain text input for recipient details
  subject: string; // Plain text input for subject line
  opening: string; // Rich text input for opening paragraph
  interestInPosition: string; // Rich text input for interest in the position
  professionalSummary: string; // Rich text input for professional summary
  keyAchievements: string; // Rich text input for key achievements
  culturalFit: string; // Rich text input for cultural fit
  closing: string; // Rich text input for closing paragraph
  signOff: string; // Plain text input for sign-off message
}

export interface URL {
  href: string;
  label: string;
}

export interface Skill {
  name: string;
  level?: "Beginner" | "Intermediate" | "Advanced" | string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Basics {
  name: string;
  email: string;
  phone: string;
  location: string;
  headLine: string;
  picture?: string;
  url: URL;
}

export interface Summary {
  content: string;
}

export interface Profile {
  url: URL;
}

export interface Project {
  name: string;
  summary: string;
  startDate: string;
  endDate: string;
  url: URL;
  keywords: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  specialization: string;
  startDate: string;
  endDate: string;
  score: string;
}

export interface Experience {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
  summary: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface Volunteer {
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  location: string;
}

export interface Award {
  title: string;
  awarder: string;
  date: string;
  summary: string;
}

export interface Publication {
  name: string;
  publisher: string;
  publishedIn: string;
  url: URL;
  date: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  url: URL;
}

export interface Reference {
  name: string;
  phone: string;
  email: string;
}

export interface Custom {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  url: URL;
  summary: string;
}

export interface ResumeData {
  basics?: Basics[];
  summary?: Summary[];
  profiles?: Profile[];
  skills?: SkillCategory[];
  projects?: Project[];
  education?: Education[];
  experience?: Experience[];
  languages?: Language[];
  volunteer?: Volunteer[];
  awards?: Award[];
  publications?: Publication[];
  certifications?: Certification[];
  references?: Reference[];
}

export interface ResumeDataTemp {
  basics?: Basics[];
  summary?: Summary[];
  profiles?: Profile[];
  skills?: SkillCategory[];
  projects?: Project[];
  education?: Education[];
  experience?: Experience[];
  languages?: Language[];
  volunteer?: Volunteer[];
  awards?: Award[];
  publications?: Publication[];
  certifications?: Certification[];
  references?: Reference[];

  // Update the index signature to match possible types
  [key: string]:
    | Custom
    | Basics[]
    | Summary[]
    | Profile[]
    | SkillCategory[]
    | Project[]
    | Education[]
    | Experience[]
    | Language[]
    | Volunteer[]
    | Award[]
    | Publication[]
    | Certification[]
    | Reference[]
    | undefined;
}




export type CoverLetterData = {
  salutation: string;
  date: string;
  senderInfo: string;
  recipientInfo: string;
  subject: string;
  opening: string;
  interestInPosition: string;
  professionalSummary: string;
  keyAchievements: string;
  culturalFit: string;
  closing: string;
  signOff: string;
};

export type ResumeSection = {
  id: keyof ResumeData | string;
  icon: React.ReactNode;
  title: string;
  fields: string[];
};
export type PageData = {
  id: string;
  userId: string;
  resumeName: string;
  styles: ResumeStyles;
} & ResumeData;

export type CPageData = {
  id: string;
  userId: string;
  coverName: string;
  styles: ResumeStyles;
} & CoverLetterData;

export type RecentResume = {
  id: string;
  userId: string;
  resumeName: string;
  updatedOn: Date;
};

export type RecentCoverLetter = {
  id: string;
  userId: string;
  coverName: string;
  updatedOn: Date;
};

export type ResumesProps =
  | {
      id: string;
      userId: string;
    resumeName: string;
      updatedOn : Date
    }[]
  | [];

export type LetterProps =
  | {
      id: string;
      userId: string;
    coverName: string;
      updatedOn : Date
    }[]
  | [];
