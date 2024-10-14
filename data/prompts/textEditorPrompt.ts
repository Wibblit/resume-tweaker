import { ResumeData, CoverLetterData } from "@/types/types";

type combinedKeys = keyof ResumeData | keyof CoverLetterData;

const sectionPrompts: { [K in combinedKeys]: string } = {
  basics: ``,
  awards: ``,
  certifications: ``,
  education: ``,
  experience: ``,
  languages: ``,
  profiles: ``,
  projects: ``,
  skills: ``,
  summary: ``,
  volunteer: ``,
  closing: ``,
  culturalFit: ``,
  date: ``,
  recipientInfo: ``,
  interestInPosition: ``,
  keyAchievements: ``,
  opening: ``,
  professionalSummary: ``,
  publications: ``,
  references: ``,
  salutation: ``,
  signOff: ``,
  subject: ``,
};

export function getAISuggestionPrompt(prompt: string, section: string) {
  return `Generate a professional and polished resume entry based on the following input: ${prompt}.

1. Important: If the user input contains irrelevant, inappropriate, or nonsensical information (e.g., any content unrelated to professional achievements or responsibilities), disregard such input. Instead, generate a resume entry based on common professional accomplishments and responsibilities.
2. Ensure the output is concise, clear, and focused on key achievements and responsibilities.
3. Use formal, action-oriented language that highlights results and impact.
4. Structure the content in a resume-friendly format (e.g., bullet points or short paragraphs).
5. Adapt the language and tone to fit a professional context, applicable across industries or roles unless specified otherwise.
6. If specific details (such as achievements, dates, or metrics) are missing, provide reasonable assumptions based on common professional standards.`;
}

export function getAIEnhancementPrompt(content: string, section: string) {
  return ``;
}
