export const mergePrompt = (
  correctionsJson: string,
) => {
  return `
    ### Conflict Resolution

Your task is to merge conflicting changes for the same JSON selectors, resolving conflicts and returning a final, unified output. The goal is to preserve all improvements from each stage, balancing the metrics without undoing or overwriting previous optimizations.

**Rules:**

1. **Preserve All Valid Changes:** Include every valid correction or enhancement, unless it contradicts another correction.
2. **Merge Thoughtfully:** If changes affect the same content, intelligently combine them. For example, fix passive voice and also add quantifiable results.
3. **Avoid Redundancy:** Eliminate repeated suggestions or conflicting edits, choosing the most comprehensive, cohesive fix.
4. **Respect Severity:** Prioritize higher-severity issues, but incorporate lower-severity improvements if compatible.
5. **Document Merge Logic:** Explain the reasoning behind the final output using the 'merge_logic' field.
6. Logical Ordering: Sequence changes logically (e.g., fix readability issues before trimming redundancies), internally of course, the output is going to be only one, but think of it in stages.&#x20;
7. Respect Context: Ensure the final output reads naturally, even after combining multiple improvements.
8. **Input Format:**
   A JSON list containing only the conflicting selectors and their proposed changes.

'''json
[
  {
    "selector": "experience[?(@.id=='abcd1234')].summary",
    "proposed_changes": [
      {
        "type": "Readability",
        "correction_logic": "Split long sentences for better readability and replaced passive voice with active voice.",
        "final_output": "<ul><li>Managed multiple marketing campaigns to enhance brand awareness and generate leads.</li><li>This resulted in increased customer engagement.</li><li>The team completed the project within the deadline.</li></ul>"
      },
      {
        "type": "Quantifiability",
        "correction_logic": "Added measurable results to showcase impact.",
        "final_output": "<ul><li>Managed multiple marketing campaigns, leading to a 20% increase in customer engagement.</li><li>The team completed the project within the deadline, contributing to a 10% revenue boost.</li></ul>"
      }
    ]
  },
  {
    "selector": "projects[?(@.id=='xyz789')].description",
    "proposed_changes": [
      {
        "type": "Conciseness",
        "correction_logic": "Shortened overly detailed explanations while keeping key information intact.",
        "final_output": "Led a team to develop a new analytics platform, improving data processing speed by 30%."
      },
      {
        "type": "Tone Consistency",
        "correction_logic": "Ensured tone matches the rest of the document — professional and impactful.",
        "final_output": "Directed a high-performing team to deliver a cutting-edge analytics platform, accelerating data processing by 30%."
      }
    ]
  }
]
'''

**Output Format:**
A unified JSON object with the resolved content and merge logic.

'''json
{
"result":[
  {
    "selector": "experience[?(@.id=='abcd1234')].summary",
    "final_output": "<ul><li>Managed multiple marketing campaigns, leading to a 20% increase in customer engagement.</li><li>The team completed the project within the deadline, contributing to a 10% revenue boost.</li></ul>",
    "correction_logic": "Combined readability improvements with quantifiability enhancements. Split long sentences for clarity, replaced passive voice, and integrated measurable results without losing any improvements."
  },
  {
    "selector": "projects[?(@.id=='xyz789')].description",
    "final_output": "Directed a high-performing team to deliver a cutting-edge analytics platform, accelerating data processing by 30%.",
    "correction_logic": "Merged conciseness and tone consistency changes. Kept the shorter, more impactful phrasing while aligning the tone to be more professional and authoritative."
  }
]
}
'''
follow the output format strictly, do not return anything else other than the requested json

here is the input json for you to merge and resolve conflicts

${correctionsJson}

`
};

