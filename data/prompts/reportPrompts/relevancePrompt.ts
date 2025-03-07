import { reportRules } from "./rules";

export const relevancePrompt = (
  resumeText: string,
  jobDescription: string
) => {
  return `### Resume Measurement and Correction Framework
  
  #### Metrics to Measure (Don't Measure anything else):
  - **Keyword Alignment:** Match content to job descriptions/industry keywords.
  - **Skill Matching:** Compare listed skills against job requirements or industry standards.
  - **Experience Hierarchy:** Verify that the most relevant experiences appear prominently.
  
  Each metric is scored out of 5, starting at full marks. Points are deducted for issues based on severity and frequency.
  
  #### Scoring Guidelines:
  - **5/5:** Perfect alignment.
  - **4/5:** Minor gaps (1-2 missing keywords or skills).
  - **3/5:** Moderate misalignment (3-5 gaps or one major issue).
  - **2/5:** Significant misalignment (6-8 gaps or multiple major issues).
  - **1/5:** Severe misalignment (more than 8 gaps or missing key experiences).
  
  #### Breakdown by Metric (with Severity):
  
  1. **Keyword Alignment:**
     - **Minor Issues:** 1-2 missing but non-critical keywords.
     - **Moderate Issues:** 3-5 missing essential keywords.
     - **Major Issues:** Missing core industry terms or role-specific phrases.
  
  2. **Skill Matching:**
     - **Minor Issues:** A single missing or outdated skill.
     - **Moderate Issues:** Several missing skills or mismatches.
     - **Major Issues:** Lacking key required skills entirely.
  
  3. **Experience Hierarchy:**
     - **Major Issues:** Experience is not in reverse chronological order.
     - Do not check anything else in this metric, do not use this metric in combination with any other metric
     - Make it a point to always check this metric, ifs it proper dont report, else correct it
###Report Rules
${reportRules}

  #### example output format (Strictly follow this format):
  
  '''json
  {
    "results": [
      {
        "selector": "experience[?(@.id=='exp-123')].summary",
        "metrics": [
          {
            "type": "Keyword Alignment",
            "score": 3,
            "issues": [
              {
                "name": "Missing keyword: 'CRM optimization' found in job description but not in resume.",
                "severity": "moderate"
              },
              {
                "name": "Partial match: 'lead generation' mentioned, but missing 'B2B lead generation'.",
                "severity": "minor"
              }
            ]
          }
        ],
        "correction_logic": "Merged the suggestions into the 'summary' field, added missing keywords and refined existing terms for better alignment.",
        "final_output": "<ul><li><p>Managed client outreach and lead generation, with a focus on <b>CRM optimization</b> and <b>B2B lead generation</b> strategies.</p></li><li><p>Designed email marketing campaigns that achieved a 35% increase in open rates and a 20% boost in click-through rates.</p></li><li><p>Coordinated events and trade shows, driving attendee engagement and generating over $200,000 in sales leads.</p></li><li><p>Conducted customer surveys and focus groups to gather insights that shaped marketing strategies.</p></li></ul>"
      },
      {
        "selector": "projects[?(@.id=='proj-456')].summary",
        "metrics": [
          {
            "type": "Keyword Alignment",
            "score": 4,
            "issues": [
              {
                "name": "Generic phrase: 'assisted with' could be replaced with 'spearheaded' for impact.",
                "severity": "minor"
              }
            ]
          },
          {
            "type": "Skill Matching",
            "score": 3,
            "issues": [
              {
                "name": "Missing skill: 'SQL' is listed in the job description but not in your resume.",
                "severity": "moderate"
              }
            ],
          }
        ],
        "correction_logic": "Updated the project summary to use stronger verbs, incorporated missing skills",
        "final_output": "<ul><li><p><b>Spearheaded</b> data migration projects, leveraging <b>SQL</b> for database optimization.</p></li><li><p>Positioned the project as a core highlight to align with job priorities.</p></li></ul>"
      },
      {
  "selector": "experience",
  "metrics": [
    {
      "type": "Experience Hierarchy",
      "score": 4,
      "issues": [
        {
          "name": "Experience not in reverse chronological order: The most recent role should be listed first.",
          "severity": "major"
        }
      ]
      }
    ],
    "correction_logic": "Reordered experiences to follow reverse chronological order, starting with the most recent position.",
    "final_output": [
      {
        "id": "a3b2c1d0-6543-2109-8765-43210fedcba98",
        "role": "Marketing Director",
        "endDate": "2025-02-13T18:30:00.000Z",
        "summary": "<ul><li><p>Spearheaded the company's transition to digital-first marketing, increasing online sales by 45% within 18 months. </p></li><li><p>Designed and executed multi-channel marketing campaigns that resulted in a 30% growth in customer acquisition.</p></li><li><p>Analysed market trends to identify new opportunities, leading to the launch of 3 successful product lines. </p></li><li><p>Managed a $2M annual marketing budget, achieving a 20% improvement in ROI year-over-year.</p></li><li><p>Built and led a team of 12 marketing professionals, fostering a collaborative and innovative work environment.</p></li></ul>",
        "location": "New York, NY",
        "startDate": "2018-05-01T18:30:00.000Z",
        "organization": "Brightwave Global"
      },
      {
        "id": "b4a39281-7654-3210-fedcba98-76543210",
        "role": "Senior Marketing Manager",
        "endDate": "2018-04-30T18:30:00.000Z",
        "summary": "<ul><li><p>Directed digital advertising efforts across Google Ads, Facebook, and LinkedIn, driving a 25% increase in lead generation.</p></li><li><p>Orchestrated content marketing initiatives that boosted website traffic by 60% in 2 years.</p></li><li><p>Developed and maintained brand guidelines to ensure consistency across all customer touchpoints.</p></li><li><p>Collaborated with the product team to successfully launch 5 new products, achieving an average market penetration of 15% within the first year.</p></li><li><p>Conducted regular competitor analyses to refine positioning and maintain market competitiveness.</p></li></ul>",
        "location": "Chicago, IL",
        "startDate": "2014-06-01T18:30:00.000Z",
        "organization": "Spark Innovations"
      },
      {
        "id": "c5d4a3b2-8190-7654-3210-fedcba987654",
        "role": "Marketing Specialist",
        "endDate": "2014-05-31T18:30:00.000Z",
        "summary": "<ul><li><p>Designed email marketing campaigns that achieved a 35% increase in open rates and a 20% boost in click-through rates.</p></li><li><p>Supported the implementation of SEO strategies that elevated website ranking from page 5 to page 1 on Google. </p></li><li><p>Coordinated events and trade shows, driving attendee engagement and generating over $200,000 in sales leads. </p></li><li><p>Conducted customer surveys and focus groups to gather insights that shaped marketing strategies.</p></li></ul>",
        "location": "San Francisco, CA",
        "startDate": "2012-08-31T18:30:00.000Z",
        "organization": "Visionary Ventures"
      }
    ]
  }
    ]
  }
  '''
  
  follow the output format strictly, do not return anything else other than the requested json
  

  INPUT:
  Here is the resume you need to work on:
  ${resumeText}
  
  Here is the job description to match against:
  ${jobDescription}
  `
};
