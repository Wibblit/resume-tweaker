export const mergePrompt = (
  correctionsJson: string,
) => {
  return `
    ### Conflict Resolution

Your task is to merge conflicting changes for the same JSON selectors, resolving conflicts and returning a final, unified output. The goal is to preserve all improvements from each stage, balancing the metrics without undoing or overwriting previous optimizations.

**Rules:**
1. **Handle Supersets and duplicates**: While merging, the output selector and final_output should be the superset of all the proposed changes, and the correction_logic should be a combination of all the correction_logics. If there are duplicate selectors, merge them into one.
1. **Preserve All Valid Changes:** Include every valid correction or enhancement, unless it contradicts another correction.
2. **Merge Thoughtfully:** If changes affect the same content, intelligently combine them. For example, fix passive voice and also add quantifiable results.
3. **Avoid Redundancy:** Eliminate repeated suggestions or conflicting edits, choosing the most comprehensive, cohesive fix.
4. **Respect Severity:** Prioritize higher-severity issues, but incorporate lower-severity improvements if compatible.
5. **Document Merge Logic:** Explain the reasoning behind the final output using the 'merge_logic' field.
6. Logical Ordering: Sequence changes logically (e.g., fix readability issues before trimming redundancies), internally of course, the output is going to be only one, but think of it in stages.&#x20;
7. Respect Context: Ensure the final output reads naturally, even after combining multiple improvements.
8. Supersets and duplicate selectors need to be merged, see the example, you need to merge superset sections(complete sections), superset selectors, and duplicate selectors. 
9. The final selector value should be the selector of the superset of all the tomerge and its given to you as the main selector field in the input json, keep that unchanged.
9. **Input Format:**
   A JSON list containing only the conflicting selectors and their proposed changes.

'''json
[
    {
      "selector": "experience",
      "tomerge": [
        {
          "selector": "experience",
          "proposed_changes": {
            "type": "Content Repetition",
            "correction_logic": "Remove repeated content to improve flow and readability.",
            "final_output": {
              "id": "abcd1234",
              "role": "Marketing Manager",
              "endDate": "December 2021",
              "summary": "<ul><li><p>Managed multiple marketing campaigns, leading to a 20% increase in customer engagement.</p></li><li><p>The team completed the project within the deadline, contributing to a 10% revenue boost.</p></li></ul>",
              "location": "New York, NY",
              "startDate": "2018-01-15T00:00:00.000Z",
              "organization": "Brightwave Solutions"
            }
          }
        },
        {
          "selector": "experience[?(@.id=='abcd1234')].summary",
          "proposed_changes": {
            "type": "Readability",
            "correction_logic": "Split long sentences for better readability and replace passive voice with active voice.",
            "final_output": "<ul><li>Managed multiple marketing campaigns to enhance brand awareness and generate leads.</li><li>This resulted in increased customer engagement.</li><li>The team completed the project within the deadline.</li></ul>"
          }
        },
        {
          "selector": "experience[?(@.id=='abcd1234')].summary",
          "proposed_changes": {
            "type": "Quantifiability",
            "correction_logic": "Add measurable results to showcase impact.",
            "final_output": "<ul><li>Managed multiple marketing campaigns, leading to a 20% increase in customer engagement.</li><li>The team completed the project within the deadline, contributing to a 10% revenue boost.</li></ul>"
          }
        }
      ]
    },
    {
      "selector": "projects[?(@.id=='xyz789')].description",
      "tomerge": [
        {
          "selector": "projects[?(@.id=='xyz789')].description",
          "proposed_changes": {
            "type": "Conciseness",
            "correction_logic": "Shorten overly detailed explanations while keeping key information intact.",
            "final_output": "Led a team to develop a new analytics platform, improving data processing speed by 30%."
          }
        },
        {
          "selector": "projects[?(@.id=='xyz789')].description.details",
          "proposed_changes": {
            "type": "Tone Consistency",
            "correction_logic": "Ensure tone matches the rest of the document — professional and impactful.",
            "final_output": "Directed a high-performing team to deliver a cutting-edge analytics platform, accelerating data processing by 30%."
          }
        }
      ]
    },
    {
      "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')].skills",
      "tomerge": [
        {
          "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')].skills",
          "proposed_changes": {
            "type": "Repetition",
            "correction_logic": "Repeated entries for skills; consolidate to avoid redundancy.",
            "final_output": [
              { "name": "HubSpot", "level": "Intermediate" },
              { "name": "Marketo", "level": "Intermediate" },
              { "name": "Salesforce", "level": "Intermediate" }
            ]
          }
        },
        {
          "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')].skills",
          "proposed_changes": {
            "type": "Content Repetition",
            "correction_logic": "Repeated entries for skills; consolidate to avoid redundancy.",
            "final_output": [
              { "name": "HubSpot", "level": "Intermediate" },
              { "name": "Marketo", "level": "Intermediate" },
              { "name": "Salesforce", "level": "Intermediate" }
            ]
          }
        }
      ]
    }
]

'''

10.**Output Format:**
A unified JSON object with the resolved content and merge logic.
### formatting rules
- There must be no newline characters inside the json content
- There must be no unescaped double quotes inside the content because this will break the json, because its already surrounded by quotations
- Overall note that the main output you generate will be parsed as json, and as for the final_output field, some of them are strings, but others are objects represented as strings which need to be valid to be parsed, so be careful
'''json
{
    "result": [
      {
        "selector": "experience",
        "final_output": {
          "id": "abcd1234",
          "role": "Marketing Manager",
          "endDate": "December 2021",
          "summary": "<ul><li>Managed multiple marketing campaigns, leading to a 20% increase in customer engagement.</li><li>The team completed the project within the deadline, contributing to a 10% revenue boost.</li></ul>",
          "location": "New York, NY",
          "startDate": "2018-01-15T00:00:00.000Z",
          "organization": "Brightwave Solutions"
        },
        "correction_logic": "Consider content repetition with readability and quantifiability improvements. Refine repeated content, split long sentences, replace passive voice, and add measurable results for maximum impact."
      },
      {
        "selector": "projects[?(@.id=='xyz789')].description",
        "final_output": "Directed a high-performing team to deliver a cutting-edge analytics platform, accelerating data processing by 30%.",
        "correction_logic": "Perform conciseness and tone consistency changes. Keep the shorter, more impactful phrasing while aligning the tone to be more professional and authoritative."
      },
      {
        "selector": "skills[?(@.id=='e7f8d9c0-a4b5-6789-0123-456789abcdef')].skills",
        "final_output": [
          { "name": "HubSpot", "level": "Intermediate" },
          { "name": "Marketo", "level": "Intermediate" },
          { "name": "Salesforce", "level": "Intermediate" }
        ],
        "correction_logic": "Merge repeated skill entries by consolidating identical content to prevent redundancy."
      }
    ]
  }
'''
follow the output format strictly, do not return anything else other than the requested json

here is the input json for you to merge and resolve conflicts

${correctionsJson}

`
};

