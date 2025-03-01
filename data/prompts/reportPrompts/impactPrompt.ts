export const actionMetricsPrompt = (
    resumeText: string,
  ) => {
    return `### Resume Measurement and Correction Framework
  
  #### Metrics to Measure:
  - **actionWordsUsage:** Count and assess the strength of action verbs per line.
  - **Quantifiability:** Detect numbers, percentages, or measurable results.
  - **contentRepetition:** Catch redundant achievements or skills across sections.
  
  Each metric is scored out of 5, starting at full marks. Points are deducted based on severity and frequency. A total score (out of 5) is calculated as the average of all three metrics.
  
  #### Scoring Guidelines:
  - **5/5:** No issues found.
  - **4/5:** 1 - 2 minor issues.
  - **3/5:** 3 - 5 moderate issues or 1 major issue.
  - **2/5:** 6 - 8 moderate issues or 2 - 3 major issues.
  - **1/5:** More than 8 moderate issues or 4+ major issues.
  
  #### Breakdown by Metric (with Severity):
  
  1. **Action Words Usage:**
     - **Minor Issues:** Weak or vague verbs (e.g., "helped," "worked on").
     - **Moderate Issues:** Missing action words in some lines.
     - **Major Issues:** Lack of action words in most lines or passive voice dominance.
  
  2. **Quantifiability:**
     - **Minor Issues:** Missing quantifiers in a few relevant achievements.
     - **Moderate Issues:** Multiple achievements lack measurable results.
     - **Major Issues:** Little to no use of measurable outcomes across sections.
  
  3. **Repetition (Content-Level):**
     - **Minor Issues:** Small skill or achievement repetitions across sections.
     - **Moderate Issues:** Repeated achievements in different sections.
     - **Major Issues:** Excessive redundancy, making sections feel duplicated.
  
  #### Commenting Rules:
  - Be specific and actionable.
  - No generic feedback — comments should precisely describe the issue.
  - Never modify dates, URLs, or HTML structure.
  
  #### Correction Process:
  - Use a JSON selector to point to the exact issue.
  - Provide the complete value of the field selected, don't fill partia values
  
  #### Example Output format:
  
  '''json
  {
  "metrics": {
    "actionWordsUsage": {
      "score": 3,
      "comments": [
        {
          "selector": "experience[?(@.id=='c5d4a3b2-8190-7654-3210-fedcba987654')].summary",
          "issue": [
            {
              "name": "Weak verb: 'worked on' should be replaced with a stronger verb like 'orchestrated' or 'executed'.",
              "severity": "minor"
            },
            {
              "name": "Passive voice: 'was responsible for' could be changed to an active verb like 'managed' or 'led'.",
              "severity": "moderate"
            }
          ],
          "correction": "Orchestrated the development of a new CRM system, improving customer retention by 20%. Managed a team of 5 developers to complete the project 2 weeks ahead of schedule."
        },
        {
          "selector": "projects[?(@.id=='38ed886f-7cbb-4119-ace4-c8a6a5764449')].summary",
          "issue": [
            {
              "name": "Generic action word: 'helped' can be replaced with a more impactful verb like 'facilitated' or 'accelerated'.",
              "severity": "minor"
            }
          ],
          "correction": "Facilitated the launch of a marketing campaign that reached 10,000 users within the first month."
        }
      ]
    },
    "Quantifiability": {
      "score": 4,
      "comments": [
        {
          "selector": "projects[?(@.id=='38ed886f-7cbb-4119-ace4-c8a6a5764449')].summary",
          "issue": [
            {
              "name": "Missing measurable result: Add specific metrics to show impact.",
              "severity": "moderate"
            }
          ],
          "correction": "This campaign led to a 25% increase in social media engagement and generated 300 qualified leads."
        },
        {
          "selector": "achievements[?(@.id=='12345678-9abc-def0-1234-56789abcdef0')].details",
          "issue": [
            {
              "name": "Unquantified achievement: 'improved team efficiency' — add a percentage or measurable impact.",
              "severity": "moderate"
            },
            {
              "name": "Unclear outcome: 'increased revenue' — specify the amount or percentage.",
              "severity": "major"
            }
          ],
          "correction": "Improved team efficiency by 30% through workflow automation. Increased revenue by $500,000 within one fiscal year through strategic upselling initiatives."
        }
      ]
    },
    "contentRepetition": {
      "score": 2,
      "comments": [
        {
          "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')]",
          "issue": [
            {
              "name": "Repeated skill: 'SEO' appears in both the 'Marketing' and 'Digital Strategy' sections.",
              "severity": "moderate"
            }
          ],
          "correction": "Remove the redundant 'SEO' entry in the 'Digital Strategy' section to avoid repetition."
        },
        {
          "selector": "experience[?(@.id=='c5d4a3b2-8190-7654-3210-fedcba987654')].summary",
          "issue": [
            {
              "name": "Duplicate achievement: 'Increased customer satisfaction by 15%' appears twice in different projects.",
              "severity": "moderate"
            }
          ],
          "correction": "Consolidate the repeated achievement into one entry, emphasizing the context of customer satisfaction improvement."
        }
      ]
    }
  },
  "total_score": 3
}
  '''
  
  INPUT:
  Here is the resume you need to work on 
  ${resumeText}
  `
  };
  
  