export type JobState =
  | "bookmark"
  | "applied"
  | "shortlisted"
  | "interviewing"
  | "negotiation";

export interface Job {
  id: string;
  jobTitle: string;
  location: string;
  companyName: string;
  logoSrc: string | null;
  jobDescription: string;
  employmentType: string;
  workType: string;
  salaryRange: string;
  state: JobState;
  addedOn: string;
  readonly url: string | null;
  source: "extension" | "website" | "mail";
}
