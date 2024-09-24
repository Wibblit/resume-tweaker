  
export type BlogType = {
    id: number,
    title: string;
    excerpt: string;
    content: string;
    date: string;
    readTime: string;
    category: string;
    image: string;
}

// // export interface Education {
// //     university_name: string
// //     joined_year: number
// //     passed_out_year: number
// //     cgpa_or_marks: string
// //   }
  
//   // export interface Project {
//   //   project_name: string
//   //   description: string
//   //   StartDate: string
//   //   EndDate: string
//   //   project_url: string
//   // }
  
//   // export interface Experience {
//   //   company_name: string
//   //   role: string
//   //   description: string
//   //   StartDate: string
//   //   EndDate: string
//   // }
  
//   export interface SocialMediaLink {
//     platform: string
//     url: string
//   }
  
//   // export interface Reference {
//   //   name: string
//   //   contact: string
//   //   relationship: string
//   // }
  
//   export interface UserData {
//     id: number
//     user_id: number
//     fullname: string
//     contact_number: string
//     email: string
//     address: string
//     bio: string
//     links: string[]
//     skills: string[]
//     role: string
//     experience_years: number
//     education_level: Education[]
//     certifications: string[]
//     languages: string[]
//     projects: Project[]
//     Experience: Experience[]
//     achievements: string[]
//     social_media_links: SocialMediaLink[]
//     references: Reference[]
//     updated_at: Date
//     credits: number
//     max_credits: number
//   }

//   type URL = {
//     href: string;
//     label: string;
//   };

//   type Skill = {
//     name: string;
//     level?: 1 | 2 | 3 | 4 | 5 | ("Beginner" | "Intermediate" | "Advanced");
//   }

//   type MonthYear = {
//     month: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12; 
//     year: number;
//   };

  type Template = {
    readonly id: string;
    name: string;
  }


//   //leftSideBar 
//   export type Basics = {
//     url?: URL;
//     name: string;
//     email: string;
//     phone?: string;
//     location?: string;
//     headLine: string;
//     picture?: File | string;
//   }

//   export type Summary = {
//     content: string;
//   }

//   export type Profile = {
//     url: URL;
//     icon?: Element;
//   }

//   export type SkillCatergory = {
//     categoryName?: string;
//     skills: Skill[];
//   }

//   export type Project = {
//     url?: URL;
//     name: string;
//     summary: string;
//     startDate?: MonthYear;
//     endDate?: MonthYear;
//     keywords?: string[];
//   }

//   export type Education = {
//     institution: string;
//     degree: string;
//     field: string;
//     specialization?: string;
//     startDate: MonthYear;
//     endDate: MonthYear;
//     score?: number;
//   }

//   export type Experience = {
//     organization: string;
//     role: string;
//     startDate: MonthYear;
//     endDate?: MonthYear | "Present";
//     location?: string;
//     summary: string;
//   }

//   export type Language = Skill;

//   export type Volunteering = {
//     organization: string;
//     role: string;
//     location?: string;
//     startDate: MonthYear;
//     endDate: MonthYear;
// }

// export type Award = {
//     title: string;
//     awarder?: string;
//     date?: MonthYear;
//     summary?: string;
// }

// export type Publication = {
//     name: string;
//     publisher: string;
//     publishedIn: string;
//     url?: URL;
//     date?: MonthYear;
// }

// export type Certification  = {
//     name: string;
//     issuer: string;
//     date?: MonthYear;
//     url?: URL;
// }

// export type Reference = {
//     name: string;
//     phone?: string;
//     email?: string;
// }

// // & Profile & SkillCatergory & Project & Reference & Certifications & Publications & 
// // Award & Volunteering & Language & Experience & Education
// export type ResumeData = {
//   basics?: Basics;
//   summary?: Summary;
//   profile?: Profile[];
//   skills?: SkillCatergory[];
//   projects?: Project[];
//   references?: Reference[];
//   certifications?: Certification[];
//   publications?: Publication[];
//   awards?: Award[];
//   volunteerings?: Volunteering[];
//   languages?: Language[];
//   experiences?: Experience[];
//   education?: Education[];
// }

//RightSideBar
export type ResumeStyles = Template & {
  font: string;
  fontSize: 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20;
  lineHeight: number;
  margin: 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30;
  paperFormat: "a4" | "letter";
  baseColor: string;
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
  picture?: File;
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

export interface ResumeData {
  basics: Basics[];
  summary: Summary[];
  profiles: Profile[];
  skills: {
    id: string; //i added this
    categories: SkillCategory[]
  }[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  languages: Language[];
  volunteer: Volunteer[];
  awards: Award[];
  publications: Publication[];
  certifications: Certification[];
  references: Reference[];
}
