const sectionPrompts: any = {
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
        "specifics": "Quantify achievements and utilize action verbs. use STAR method"
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
        "focus": "How your values align with the company's culture, followed by a polite request for an interview or further discussion",
        "tone": "Personal, confident, and enthusiastic"
    }`,
  date: ``,
  recipientInfo: ``,
  interestInPosition: `{
        "sentence_count": "2-3 sentences",
        "format": "short paragraph",
        "focus": "Why you're interested in the position and the company",
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

export function getAISuggestionPrompt(prompt: string, section: string) {
  const isSection =
    section === "salutation" ||
    section === "date" ||
    section === "recipientInfo" ||
    section === "subject" ||
    section === "opening" ||
    section === "interestInPosition" ||
    section === "professionalSummary" ||
    section === "keyAchievements" ||
    section === "culturalFit" ||
    section === "closing" ||
    section === "signOff";

  const prompts = isSection
    ? `You are tasked with generating professional and polished cover letter content for the section "${section}". To perform this effectively:
    
1. **Input Validation**:
   - Analyze the input : ${prompt} 
   - If it contains gibberish, offensive content, or lacks coherence (e.g., "asdfasdf"), respond with "Invalid Input."

2. **Generate Content**:
   - Based on the valid input and section-specific rules, create concise, professional, and relevant content:
     ${sectionPrompts[section]}

3. **Reasoning**:
   - Ensure the response aligns with the section's intent (e.g., interest in position, achievements, or cultural fit).
   - If no tone or audience is specified, default to professional and industry-agnostic language.

4. **Readability**:
   - Ensure the content is clear, concise, and easy to read. Avoid overly complex sentences or jargon unless relevant to the context.

5. **Length Control**:
   - Adhere to the section's guidelines (e.g., 2-3 sentences for summaries, 4-6 bullet points for experience).
   - Avoid exceeding the specified length or introducing redundancy.

6. IMPORTANT**Respond Only in Plain Text**:
   - Provide the requested content without additional explanations, comments, or formatting.

ULTRA IMPORTANT: Do not attempt to hallucinate content if the input is unclear, irrelevant, or inappropriate. In such cases, respond with "Invalid Input."`
    : `You are tasked with generating professional and polished resume content for the section "${section}". To perform this effectively:
    
1. **Input Validation**:
   - Analyze the input  : ${prompt} 
   - If it contains gibberish, offensive content, or lacks coherence (e.g., "asdfasdf"), respond with "Invalid Input."

2. **Generate Content**:
   - Based on the valid input and section-specific rules, create concise, professional, and relevant content:
     ${sectionPrompts[section]}

3. **Reasoning**:
   - Ensure the response aligns with the section's intent (e.g., achievements, responsibilities, or summary).
   - If no tone or audience is specified, default to professional and industry-agnostic language.

4. **Readability**:
   - Ensure the content is clear, concise, and easy to read. Avoid overly complex sentences or jargon unless relevant to the context.

5. **Length Control**:
   - Adhere to the section's guidelines (e.g., 4-6 bullet points for experience, 2-3 sentences for summaries).
   - Avoid exceeding the specified length or introducing redundancy.

6. IMPORTANT**Respond Only in Plain Text**:
   - Provide the requested content without additional explanations, comments, or formatting.

ULTRA IMPORTANT: Do not attempt to hallucinate content if the input is unclear, irrelevant, or inappropriate. In such cases, respond with "Invalid Input."`;

  return prompts;
}

export function getAIEnhancementPrompt(content: string, section: string) {
  const isSection =
    section === "salutation" ||
    section === "date" ||
    section === "recipientInfo" ||
    section === "subject" ||
    section === "opening" ||
    section === "interestInPosition" ||
    section === "professionalSummary" ||
    section === "keyAchievements" ||
    section === "culturalFit" ||
    section === "closing" ||
    section === "signOff";

  const prompt = isSection
    ? `You are tasked with enhancing professional and polished cover letter content for the section "${section}". To perform this effectively:

1. **Input Validation**:
   - Analyze the input : ${content} 
   - If it contains gibberish, offensive content, or lacks coherence, respond with "Invalid Input."

2. **Enhance Content**:
   - Based on the valid input and section-specific rules, improve the clarity, conciseness, and professionalism:
     ${sectionPrompts[section]}

3. **Reasoning**:
   - Ensure the enhanced content aligns with the section's intent (e.g., achievements, interest, or cultural fit).
   - If no tone or audience is specified, default to professional and industry-agnostic language.

4. **Readability**:
   - Ensure the content is clear, concise, and easy to read. Avoid overly complex sentences or jargon unless relevant to the context.

5. **Length Control**:
   - Adhere to the section's guidelines (e.g., 2-3 sentences for summaries, 4-6 bullet points for experience).
   - Avoid introducing redundancy or altering the meaning unnecessarily.

6. IMPORTANT**Respond Only in Plain Text**:
   - Provide the enhanced content without additional explanations, comments, or formatting.

ULTRA IMPORTANT: Do not attempt to hallucinate improvements if the input is unclear, irrelevant, or inappropriate. In such cases, respond with "Invalid Input."`
    : `You are tasked with enhancing professional and polished resume content for the section "${section}". To perform this effectively:

1. **Input Validation**:
   - Analyze the input : ${content} 
   - If it contains gibberish, offensive content, or lacks coherence, respond with "Invalid Input."

2. **Enhance Content**:
   - Based on the valid input and section-specific rules, improve the clarity, conciseness, and professionalism:
     ${sectionPrompts[section]}

3. **Reasoning**:
   - Ensure the enhanced content aligns with the section's intent (e.g., achievements, responsibilities, or summary).
   - If no tone or audience is specified, default to professional and industry-agnostic language.

4. **Readability**:
   - Ensure the content is clear, concise, and easy to read. Avoid overly complex sentences or jargon unless relevant to the context.

5. **Length Control**:
   - Adhere to the section's guidelines (e.g., 4-6 bullet points for experience, 2-3 sentences for summaries).
   - Avoid introducing redundancy or altering the meaning unnecessarily.

6. IMPORTANT: **Respond Only in Plain Text**:
   - Provide the enhanced content without additional explanations, comments, or formatting.

ULTRA IMPORTANT: Do not attempt to hallucinate improvements if the input is unclear, irrelevant, or inappropriate. In such cases, respond with "Invalid Input."`;

  return prompt;
}

