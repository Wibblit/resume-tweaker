import { reportRules } from "./rules";

export const readabilityClarityPrompt = (resumeText: string) => {
  return `### Resume Measurement and Correction Framework
  
  #### Metrics to Measure (Don't Measure anything else):
  - **Readability:** Assess sentence length, passive voice, and complexity.
  - **Conciseness & Clarity:** Flag wordiness, redundancies, and ambiguous phrases.
  
  Each metric is scored out of 5, starting at full marks. Points are deducted for issues based on severity and frequency.
  
  #### Scoring Guidelines:
  - **5/5:** No issues found.
  - **4/5:** 1 - 2 minor issues.
  - **3/5:** 3 - 5 moderate issues or 1 major issue.
  - **2/5:** 6 - 8 moderate issues or 2 - 3 major issues.
  - **1/5:** More than 8 moderate issues or 4+ major issues.
  
  #### Breakdown by Metric (with Severity):
  
  1. **Readability:**
     - **Minor Issues:** Slightly long sentences, light passive voice.
     - **Moderate Issues:** Frequent passive voice, hard-to-follow sentences.
     - **Major Issues:** Very long, complex, or convoluted sentences.
  
  2. **Conciseness & Clarity:**
     - **Minor Issues:** Mild wordiness or a few redundant words.
     - **Moderate Issues:** Frequent unnecessary words or ambiguous phrases.
     - **Major Issues:** Overly verbose sections or consistently unclear writing.
  
###Report Rules
${reportRules}

  #### example output format (Strictly follow this format):
  
  '''json
    {
      "results": [
        {
          "selector": "experience[?(@.id=='abcd1234')].summary",
          "metrics": [
            {
              "type": "Readability",
              "score": 3,
              "issues": [
                {
                  "name": "Sentence too long: 'Managed multiple simultaneous marketing campaigns to enhance brand awareness and generate leads through various digital channels resulting in increased customer engagement.'",
                  "severity": "moderate"
                },
                {
                  "name": "Passive voice detected: 'The project was completed by the team within the deadline.' Should be 'The team completed the project within the deadline.'",
                  "severity": "moderate"
                }
              ]
            }
          ],
          "correction_logic": "Split long sentences for better readability and replaced passive voice with active voice.",
          "final_output": "<ul><li><p>Managed multiple marketing campaigns to enhance brand awareness and generate leads. This resulted in increased customer engagement.</p></li><li><p>The team completed the project within the deadline.</p></li></ul>"
        },
        {
          "selector": "experience[?(@.id=='123-2bfd')].summary",
          "metrics": [
            {
              "type": "Readability",
              "score": 3,
              "issues": [
                {
                  "name": "Sentence too vague: 'The team completed the project.'",
                  "severity": "moderate"
                }
              ]
            }
          ],
          "correction_logic": "Clarifed vague statements to provide more specific details.",
          "final_output": "<ul><li><p>Managed multiple marketing campaigns to enhance brand awareness and generate warm leads. This resulted in increased customer retention.</p></li><li><p>The team completed the project within the deadline.</p></li></ul>"
        },
        {
          "selector": "summary.content",
          "metrics": [
            {
              "type": "Conciseness & Clarity",
              "score": 2,
              "issues": [
                {
                  "name": "Redundant phrase: 'Collaborated together with team members' — 'together' is unnecessary.",
                  "severity": "minor"
                },
                {
                  "name": "Wordy sentence: 'Utilized effective strategies to optimize and improve the overall performance of the system.' Could be: 'Optimized system performance through effective strategies.'",
                  "severity": "moderate"
                },
                {
                  "name": "Ambiguous phrase: 'Worked on various tasks related to project management.' Be more specific about the tasks.",
                  "severity": "major"
                }
              ]
            }
          ],
          "correction_logic": "Trimmed redundant phrases, simplified wordy sentences, and specified vague descriptions.",
          "final_output": "Innovative and results-driven marketing professional with 10 years of experience. Collaborated with team members, optimized system performance through effective strategies, and handled project management tasks like scheduling, budgeting, and team coordination."
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

