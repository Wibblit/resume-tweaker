export const arelevancePrompt = (
    resumeText: string,
    jobDescription: string
  ) => {
    return `### Resume Measurement and Correction Framework
  
  #### Metrics to Measure:
  - **Keyword Alignment:** Match content to job descriptions/industry keywords.
  - **Skill Matching:** Compare listed skills against job requirements or industry standards.
  - **Experience Hierarchy:** Verify that the most relevant experiences appear prominently.
  
  Each metric is scored out of 5, starting at full marks. Points are deducted for issues based on severity and frequency. A total score (out of 5) is calculated as the average of all three metrics.
  
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
     - **Minor Issues:** Slight misplacement of relevant experiences.
     - **Moderate Issues:** Important experiences buried deep in sections.
     - **Major Issues:** Critical experiences missing or severely misplaced.
  
  #### Commenting Rules:
  - Be specific and actionable.
  - No generic feedback — comments should precisely describe the issue.
  - Never modify dates, URLs, or HTML structure(you can fox content, but strictly maintain structure).
  
  #### Correction Process:
  - Use a JSON selector to point to the exact issue.
  - Provide the complete value of the field selected, don't fill partial values

  #### Example Output format:
  
  '''json
  {
    "metrics": {
      "Keyword Alignment": {
        "score": 3,
        "comments": [
          {
            "selector": "experience[?(@.id=='exp-123')].summary",
            "issue": [
              {
                "name": "Missing keyword: 'CRM optimization' found in job description but not in resume.",
                "severity": "moderate"
              },
              {
                "name": "Partial match: 'lead generation' mentioned, but missing 'B2B lead generation'.",
                "severity": "minor"
              }
            ],
            "correction": "Consider adding 'CRM optimization' and specifying 'B2B lead generation' to align more closely with the job description."
          },
          {
            "selector": "projects[?(@.id=='proj-456')].summary",
            "issue": [
              {
                "name": "Generic phrase: 'assisted with' could be replaced with 'contributed to' or 'spearheaded' for more impact.",
                "severity": "minor"
              }
            ],
            "correction": "Replace 'assisted with' in your project summary with a stronger verb, like 'spearheaded' or 'facilitated'."
          }
        ]
      },
      "Skill Matching": {
        "score": 4,
        "comments": [
          {
            "selector": "skills",
            "issue": [
              {
                "name": "Outdated skill: 'Adobe Flash' is rarely relevant for modern roles.",
                "severity": "moderate"
              }
            ],
            "correction": "Replace 'Adobe Flash' with a more current tool, like 'Figma' or 'Adobe XD', depending on your role."
          },
          {
            "selector": "skills",
            "issue": [
              {
                "name": "Missing skill: 'SQL' is listed in the job description but not in your resume.",
                "severity": "moderate"
              }
            ],
            "correction": "Add 'SQL' to your skills section to align with the job requirements."
          }
        ]
      },
      "Experience Hierarchy": {
        "score": 2,
        "comments": [
          {
            "selector": "experience",
            "issue": [
              {
                "name": "Relevant role placed too low: 'Marketing Manager' should appear before 'Sales Associate' for a digital marketing position.",
                "severity": "major"
              }
            ],
            "correction": "Rearrange sections to highlight your 'Marketing Manager' experience first, as it's most relevant to the target role."
          },
          {
            "selector": "achievements[?(@.id=='achv-789')].details",
            "issue": [
              {
                "name": "Unquantified achievement: 'Improved team efficiency' — add a percentage or measurable impact.",
                "severity": "moderate"
              }
            ],
            "correction": "Improved team efficiency by 30% through workflow automation."
          }
        ]
      }
    },
    "total_score": 3
  }
  '''
  
  INPUT:
  Here is the resume you need to work on:
  ${resumeText}
  
  Here is the job description to match against:
  ${jobDescription}
  `
  };
  