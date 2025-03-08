import { reportRules } from "./rules";

export const impactPrompt = (
  resumeText: string,
) => {
  return `### Resume Measurement and Correction Framework
  
  #### Metrics to Measure (Don't Measure anything else):
  - **actionWordsUsage:** Count and assess the strength of action verbs per line.
  - **Quantifiability:** Detect numbers, percentages, or measurable results.
  - **contentRepetition:** Catch redundant achievements or skills across sections.
  
  Each metric is scored out of 5, starting at full marks. Points are deducted based on severity and frequency.
  
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
  
###Report Rules
${reportRules}
When removing a duplicate skill or a whole entry, make sure to select the immediate parent and rewrite it completely without the thing to be removed, instead of targetting the thing to be removed(never do that).

  #### example output format (Strictly follow this format):
  '''json
{
  "results": [
    {
      "selector": "experience[?(@.id=='c5d4a3b2-8190-7654-3210-fedcba987654')].summary",
      "metrics": [
        {
          "type": "Action Words usage",
          "score": 3,
          "issues": [
            {
              "name": "Weak verb: 'worked on' should be replaced with a stronger verb like 'orchestrated' or 'executed'.",
              "severity": "minor"
            },
            {
              "name": "Passive voice: 'was responsible for' could be changed to an active verb like 'managed' or 'led'.",
              "severity": "moderate"
            },
            {
              "name": "Duplicate achievement: 'Increased customer satisfaction by 15%' appears twice in different projects.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Replaced weak verbs with stronger alternatives, converted passive voice to active, and consolidated duplicate achievements.",
      "final_output": "Orchestrated the development of a new CRM system, improving customer retention by 20%. Managed a team of 5 developers to complete the project 2 weeks ahead of schedule. Emphasized customer satisfaction improvement in a unified entry."
    },
    {
      "selector": "projects[?(@.id=='38ed886f-7cbb-4119-ace4-c8a6a5764449')].summary",
      "metrics": [
        {
          "type": "Action Words usage",
          "score": 3,
          "issues": [
            {
              "name": "Generic action word: 'helped' can be replaced with a more impactful verb like 'facilitated' or 'accelerated'.",
              "severity": "minor"
            }
          ]
        },
        {
          "type": "Quantifiability",
          "score": 4,
          "issues": [
            {
              "name": "Missing measurable result: Add specific metrics to show impact.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Replaced generic verbs with impactful ones and added measurable results to showcase impact. Couldn't find exact number so considered experience and role to make up believable quantifiers",
      "final_output": "Facilitated the launch of a marketing campaign that reached 10,000 users within the first month. This campaign led to a 25% increase in social media engagement and generated 300 qualified leads."
    },
    {
      "selector": "awards[?(@.id=='12345678-9abc-def0-1234-56789abcdef0')].summary",
      "metrics": [
        {
          "type": "Quantifiability",
          "score": 4,
          "issues": [
            {
              "name": "Unquantified achievement: 'improved team efficiency' — add a percentage or measurable impact.",
              "severity": "moderate"
            },
            {
              "name": "Unclear outcome: 'increased revenue' — specify the amount or percentage.",
              "severity": "major"
            }
          ]
        }
      ],
      "correction_logic": "Added specific metrics or percentages to quantify achievements and clarify outcomes. Couldn't find exact number so considered experience and role to make up believable quantifiers",
      "final_output": "Improved team efficiency by 30% through workflow automation. Increased revenue by $500,000 within one fiscal year through strategic upselling initiatives."
    },
    {
      "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')]",
      "metrics": [
        {
          "type": "Content Repetition",
          "score": 2,
          "issues": [
            {
              "name": "Repeated skill: 'SEO' appears in both the 'Marketing' and 'Digital Strategy' sections.",
              "severity": "moderate"
            }
          ]
        }
      ],
      "correction_logic": "Removed 'SEO' from Marketing",
      "final_output": "{
              "id": "e7f8d9c0-a4b5-6789-0123-456789abcdef",
              "name": "Marketing",
              "skills": [
                {
                  "name": "HubSpot",
                  "level": "Beginner"
                },
                {
                  "name": "Marketo",
                  "level": "Intermediate"
                },
                {
                  "name": "Salesforce",
                  "level": "Beginner"
                },
                {
                  "name": "Google Ads",
                  "level": "Intermediate"
                },
                {
                  "name": "Social Media Marketing (Facebook, LinkedIn, etc.)",
                  "level": "Intermediate"
                }
              ]
            },"
    },
    {
  "selector": "awards",
  "metrics": [
    {
      "type": "Content Repetition",
      "score": 2,
      "issues": [
        {
          "name": "Duplicate award detected: Multiple awards have identical titles and summaries.",
          "severity": "major"
        }
      ]
    }
  ],
  "correction_logic": "Removed duplicate award entry by omitting it from the final output.",
  "final_output": [
    {
      "id": "90876543-2109-8765-4321-0fedcba98765",
      "date": "2022",
      "title": "One of the employees ever, 2020",
      "awarder": "Brightwave Global",
      "summary": "Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%"
    },
    {
      "id": "78654321-0987-6543-2109-876543210fed",
      "date": "2017",
      "title": "Employee of the Year, 2017",
      "awarder": "Spark Innovations",
      "summary": "Recognized for conceptualizing a holiday campaign that increased seasonal sales by 50%"
    }
  ]
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

