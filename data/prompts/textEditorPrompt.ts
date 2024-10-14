import { ResumeData, CoverLetterData } from "@/types/types";

type CombinedKeys = keyof ResumeData | keyof CoverLetterData;

const sectionPrompts: { [K in CombinedKeys]: string } = {
  basics: ``,
  awards: `{
        "sentence_count": "2-3 bullet points",
        "format": "bullet points",
        "focus": "Award name, organization, and context",
        "tone": "Concise and professional",
        "specifics": "Highlight achievements that led to recognition."
    }`,
  certifications: ``,
  education: ``,
  experience: `{
        "sentence_count": "4-6 bullet points",
        "format": "bullet points",
        "focus": "Key achievements and responsibilities in professional roles",
        "tone": "Formal and professional",
        "specifics": "Quantify achievements and utilize action verbs."
    }`,
  languages: ``,
  profiles: ``,
  projects: `{
        "sentence_count": "2-3 bullet points",
        "format": "bullet points",
        "focus": "Overview of personal projects showcasing skills, technologies used, and outcomes achieved",
        "tone": "Action-oriented",
        "specifics": "Emphasize the skills demonstrated and results obtained in each project."
    }`,
  skills: ``,
  summary: `{
        "sentence_count": "2-3 sentences",
        "format": "paragraph",
        "focus": "Key skills, experiences, and career objectives",
        "tone": "Clear and impactful",
        "specifics": "Reflect the candidate's unique value proposition."
    }`,
  volunteer: ``,
  closing: ``,
  culturalFit: `{
        "sentence_count": "2-3 sentences",
        "format": "short paragraph",
        "focus": "How your values align with the company’s culture, followed by a polite request for an interview or further discussion",
        "tone": "Personal, confident, and enthusiastic"
    }`,
  date: ``,
  recipientInfo: ``,
  interestInPosition: `{
        "sentence_count": "2-3 sentences",
        "format": "short paragraph",
        "focus": "Why you’re interested in the position and the company",
        "tone": "Personalized and enthusiastic"
    }`,
  keyAchievements: `{
        "sentence_count": "2-3 bullet points or sentences",
        "format": "bullet points or short paragraph",
        "focus": "Achievements relevant to the position, keep them quantifiable and results-oriented",
        "tone": "Results-oriented"
    }`,
  opening: `{
        "sentence_count": "2-3 sentences",
        "format": "short paragraph",
        "focus": "Introduction, purpose of letter, expression of interest",
        "tone": "Engaging and professional"
    }`,
  professionalSummary: `{
        "sentence_count": "2-3 sentences",
        "format": "paragraph",
        "focus": "Key qualifications, skills, relevant experience",
        "tone": "Confident and concise"
    }`,
  publications: ``,
  references: ``,
  salutation: `{
        "sentence_count": "1 sentence",
        "format": "formal greeting",
        "focus": "Recipient's name, or 'Hiring Manager' if not available",
        "tone": "Formal and respectful"
    }`,
  signOff: `{
        "sentence_count": "1 sentence",
        "format": "formal closing",
        "focus": "Sign off with name and optional contact info",
        "tone": "Professional and courteous"
    }`,
  subject: `{
        "sentence_count": "1 sentence",
        "format": "subject line",
        "focus": "Job title and your name",
        "tone": "Direct and professional"
    }`,
};

export function getAISuggestionPrompt(prompt: string, section: CombinedKeys) {

  const isSection = (section: string): section is CombinedKeys =>
    section in sectionPrompts;

  const prompts = isSection(section)
    ? `Generate a professional and polished cover letter section based on the following input: ${prompt}.

Write the content following these rules: ${sectionPrompts[section]}

Important: If the user input contains irrelevant, inappropriate, or nonsensical information, disregard such input. Instead, generate a cover letter section based on common professional practices relevant to the specified section.

ONLY REPLY IN PLAIN TEXT

Ensure the output is concise and clear. Adapt the language and tone to fit a professional and formal cover letter format, applicable across industries or roles unless specified otherwise.
If specific details (such as job title, recipient’s name, or company) are missing, provide reasonable assumptions based on common professional standards. 
PROVIDE ONLY REQUESTED INFORMATION, NO ADDITIONAL EXPLANATIONS OR COMMENTS.`
    : `Generate a professional and polished resume entry based on the following input: "${prompt}".

Write the content following these rules: ${sectionPrompts[section]}

Important: If the user input contains irrelevant, inappropriate, or nonsensical information, disregard such input. Instead, generate a resume entry based on common professional accomplishments and responsibilities relevant to the specified section.

ONLY REPLY IN PLAIN TEXT

1) Ensure the output is clear, concise and without redundancy or repetition.
Adapt the language and tone to fit a professional context, applicable across industries or roles unless specified otherwise.
2) If specific details (such as achievements, dates, or metrics) are missing, provide reasonable assumptions based on common professional standards.
PROVIDE ONLY REQUESTED INFORMATION, NO ADDITIONAL EXPLANATIONS OR COMMENTS.
`;
  
  return prompts
}

export function getAIEnhancementPrompt(
  content: string,
  section: CombinedKeys | string
) {
  const isSection = (section: string): section is CombinedKeys =>
    section in sectionPrompts;

  const getSectionPrompt = (section: CombinedKeys) => sectionPrompts[section];

  const prompt = isSection(section)
    ? `Enhance the following cover letter section based on the input provided: ${content}.

Write the content following these rules: ${getSectionPrompt(section)}

IMPROVE THE CLARITY, CONCISENESS, AND PROFESSIONALISM of the content while preserving the original meaning and intent.
ENSURE THE LANGUAGE IS FORMAL, action-oriented, and fits the tone of a professional cover letter.
REMOVE ANY IRRELEVANT, INAPPROPRIATE, OR NONSENSICAL INFORMATION while maintaining the focus on the section's purpose (e.g., interest in the position, key achievements).
Adapt the content to a professional context that is applicable across industries or roles unless otherwise specified.
ONLY REPLY IN PLAIN TEXT, WITH NO ADDITIONAL EXPLANATIONS OR COMMENTS.
PROVIDE ONLY THE ENHANCED VERSION OF THE INPUT. DO NOT INTRODUCE NEW INFORMATION OR SIGNIFICANTLY ALTER THE STRUCTURE UNLESS NECESSARY TO IMPROVE READABILITY AND FLOW.`
    : `Enhance the following resume section based on the input provided: ${content}".
Write the content following these rules: ${
        sectionPrompts[section as keyof typeof sectionPrompts] || ""
      }
IMPROVE THE CLARITY, CONCISENESS, AND PROFESSIONALISM of the content while preserving the original meaning and intent.
ENSURE THE LANGUAGE IS FORMAL, action-oriented, and focused on achievements and responsibilities relevant to the resume.
REMOVE ANY IRRELEVANT, INAPPROPRIATE, OR NONSENSICAL INFORMATION while maintaining the focus on the section's purpose (e.g., professional summary, experience description, key achievements).
Adapt the content to a professional context that is applicable across industries or roles unless otherwise specified.
ONLY REPLY IN PLAIN TEXT, WITH NO ADDITIONAL EXPLANATIONS OR COMMENTS.
PROVIDE ONLY THE ENHANCED VERSION OF THE INPUT. DO NOT INTRODUCE NEW INFORMATION OR SIGNIFICANTLY ALTER THE STRUCTURE UNLESS NECESSARY TO IMPROVE READABILITY AND FLOW.`;

  return prompt;
}