export const grammerPrompt = (
  resumeText: string,
) => {
  return `### Resume Measurement and Correction Framework

#### Metrics to Measure:
- **Grammar:** Check for spelling, punctuation, and syntax errors.
- **Repetition:** Identify nearby or frequent repeated words/phrases.
- **Tone Consistency:** Ensure a professional, active tone and flag shifts.

Each metric is scored out of 5, starting at full marks. Points are deducted for issues based on severity and frequency. A total score (out of 5) is calculated as the average of all three metrics.

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

2. **Repetition:**
   - **Minor Issues:** Single repeated word within a paragraph.
   - **Moderate Issues:** Multiple repetitions within a section.
   - **Major Issues:** Frequent redundant phrases throughout the resume.

3. **Tone Consistency:**
   - **Minor Issues:** Slight passive voice usage.
   - **Moderate Issues:** Inconsistent tense or tone shifts across sections.
   - **Major Issues:** Highly casual or unprofessional language.

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
    "Grammar": {
      "score": 3,
      "comments": [
        {
          "selector": "experience[?(@.id=='c5d4a3b2-8190-7654-3210-fedcba987654')].summary",
          "issue": [
            {
              "name": "Subject-verb agreement error: 'Designed email marketing campaigns that achieves a 35% increase' should be 'Designed email marketing campaigns that achieved a 35% increase'.",
              "severity": "major"
            },
            {
              "name": "Subject-verb agreement error: 'Supported the implementation of SEO strategies that elevate website ranking' should be 'Supported the implementation of SEO strategies that elevated website ranking'.",
              "severity": "major"
            }
          ],
          "correction": "<ul><li><p>Designed email marketing campaigns that achieved a 35% increase in open rates and a 20% boost in click-through rates.</p></li><li><p>Supported the implementation of SEO strategies that elevated website ranking from page 5 to page 1 on Google.</p></li><li><p>Coordinated events and trade shows, driving attendee engagement and generating over $200,000 in sales leads.</p></li><li><p>Conducted customer surveys and focus groups to gather insights that shaped marketing strategies.</p></li></ul>"
        },
        {
          "selector": "summary.content",
          "issue": [
            {
              "name": "Punctuation error: Missing comma after 'brand strategy'.",
              "severity": "minor"
            },
            {
              "name": "Spelling error: 'campain' should be 'campaign'.",
              "severity": "minor"
            }
          ],
          "correction": "Innovative and results-driven marketing professional with 10 years of experience in digital marketing, brand strategy, and campaign management. Proven ability to drive growth, increase brand visibility, and deliver ROI-driven strategies in fast-paced environments. Expertise in leading cross-functional teams, leveraging analytics for decision-making, and executing successful multichannel campaigns."
        }
      ]
    },
    "Repetition": {
      "score": 4,
      "comments": [
        {
          "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')]",
          "issue": [
            {
              "name": "Repeated skill: 'HubSpot' appears twice.",
              "severity": "moderate"
            },
            {
              "name": "Duplicate entry: 'Google Analytics' listed under both Marketing and Analytics sections.",
              "severity": "moderate"
            }
          ],
          "correction": '[
            {"id": "e7f8d9c0-a4b5-6789-0123-456789abcdef",
            "name": "Marketing", 
            "skills": [
            {"name": "HubSpot", "level": "Beginner"}, 
            {"name": "Marketo", "level": "Intermediate"}, 
            {"name": "Salesforce", "level": "Beginner"}
            ]
           }
          ]'
        }
      ]
    },
    "Tone Consistency": {
      "score": 2,
      "comments": [
        {
          "selector": "projects[?(@.id=='38ed886f-7cbb-4119-ace4-c8a6a5764449')].summary",
          "issue": [
            {
              "name": "Tone shift: Casual language 'real dudes' should be replaced with professional phrasing.",
              "severity": "major"
            },
            {
              "name": "Inconsistent tone: 'crushing goals' sounds overly informal in a corporate context.",
              "severity": "moderate"
            }
          ],
          "correction": "This campaign demonstrates the inner workings of a successful marketing strategy and tests its effectiveness in the real world with real prospects, driving measurable results."
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