import { reportRules } from "./rules";

export const grammerPrompt = (
  resumeText: string,
) => {
  return `### Resume Measurement and Correction Framework

#### Metrics to Measure (Don't Measure anything else):
- **Grammar:** Check for spelling, punctuation, and syntax errors.
- **Repetitive Language:** Identify nearby or frequent repeated words/phrases, do not check for redundant points or skills, limit only to words or phrases from a gramatical perspective.
- **Tone Consistency:** Ensure a professional, active tone and flag shifts.

Each metric is scored out of 5, starting at full marks. Points are deducted for issues based on severity and frequency.

#### Scoring Guidelines:
- **5/5:** No issues found.
- **4/5:** 1 - 2 minor issues.
- **3/5:** 3 - 5 moderate issues or 1 major issue.
- **2/5:** 6 - 8 moderate issues or 2 - 3 major issues.
- **1/5:** More than 8 moderate issues or 4+ major issues.

#### Breakdown by Metric (with Severity):

1. **Grammar:**
   - **Minor Issues:** Simple spelling or punctuation mistakes.
   - **Moderate Issues:** Misplaced modifiers, awkward sentence structure.
   - **Major Issues:** Run-on sentences, subject-verb agreement errors.

2. **Repetitive Language:**
   - **Minor Issues:** Single repeated word within a paragraph.
   - **Moderate Issues:** Multiple phrases within a section.
   - **Major Issues:** Frequent redundant words and phrases throughout the section.

3. **Tone Consistency:**
   - **Minor Issues:** Slight passive voice usage.
   - **Moderate Issues:** Inconsistent tense or tone shifts across sections.
   - **Major Issues:** Highly casual or unprofessional language.
  
###Report Rules
${reportRules}

  #### example output format (Strictly follow this format):

  '''json
  {
    "results": [
      {
        "selector": "experience[?(@.id=='c5d4a3b2-8190-7654-3210-fedcba987654')].summary",
        "metrics": [
          {
            "type": "Grammar",
            "score": 3,
            "issues": [
              {
                "name": "Weak verb: 'worked on' should be replaced with a stronger verb like 'orchestrated' or 'executed'.",
                "severity": "minor"
              },
              {
                "name": "Passive voice: 'was responsible for' could be changed to an active verb like 'managed' or 'led'.",
                "severity": "moderate"
              }
            ]
          }
        ],
        "correction_logic": "Replace passive and weak verbs with stronger, active alternatives.",
        "final_output": "<ul><li><p>Orchestrated the development of a new CRM system, improving customer retention by 20%.</p></li><li><p>Managed a team of 5 developers to complete the project 2 weeks ahead of schedule.</p></li></ul>"
      },
      {
        "selector": "projects[?(@.id=='12345678-9abc-def0-1234-56789abcdef0')].summary",
        "metrics": [
          {
            "type": "Repetitive Language",
            "score": 3,
            "issues": [
              {
                "name": "Phrase repetition: 'Developed a platform' and 'Built a platform' convey the same idea—consider varying phrasing.",
                "severity": "moderate"
              },
              {
                "name": "Word redundancy: 'using cutting-edge AI models' and 'leveraging AI-driven insights' both emphasize AI in a repetitive manner.",
                "severity": "minor"
              }
            ]
          }
        ],
        "correction_logic": "Refine language by reducing redundancy while preserving clarity and impact.",
        "final_output": "Designed and implemented a scalable platform integrating AI-driven insights for predictive analytics, enhancing operational efficiency."
      },
      {
        "selector": "awards[?(@.id=='12345678-9abc-def0-1234-56789abcdef0')].summary",
        "metrics": [
          {
            "type": "Tone Consistency",
            "score": 4,
            "issues": [
              {
                "name": "Inconsistent tone: 'improved team efficiency' sounds neutral, while 'increased revenue' is highly enthusiastic — align tone for consistency.",
                "severity": "moderate"
              },
              {
                "name": "Mixed formality: 'through strategic upselling initiatives' feels overly formal compared to the rest of the text.",
                "severity": "minor"
              }
            ]
          }
        ],
        "correction_logic": "Adjust language to maintain a consistent tone throughout, balancing enthusiasm and professionalism.",
        "final_output": "Enhanced team efficiency by 30% through streamlined workflows. Boosted revenue by $500,000 within one fiscal year by implementing targeted upselling strategies."
      }
    ]
  }
  '''

  follow the output format strictly, do not return anything else other than the requested json

  INPUT:
  Here is the resume you need to work on 
  ${resumeText}
`
};