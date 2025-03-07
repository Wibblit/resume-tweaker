export const reportRules = () => {
    return `
#### Commenting Rules:
- Be specific and actionable — no generic feedback.
- Only comment on serious issues; minor ones can be ignored.
- Fix content but never alter dates, URLs, or HTML structure.

#### Correction Process:
- Use JSON selectors for pinpoint accuracy.
- Provide full field values, even for small changes.
- final_output field must be clean and ready for use (no placeholders or comment markers) and must be in the final format to insert directly into the resume without requiring cleanup, so no paranthesis comments or anything, it needs to be final, this is a correction, dont suggest things in this, this is the final corrected value part of the selector.
- Prioritize conciseness, while correcting take into account the no of sentences or points before making the correction.
- The correction must be in line with the comment and the correction_logic

#### Conflict Resolution:
- Resolve all issues within each metric and across metrics for the same selector.
- Merge improvements thoughtfully, balancing all detected issues, to avoid overwriting useful corrections.

### Ethical Boundaries:
- Don't invent abilities beyond the user's scope.
- Use vague or estimated values only when necessary, and keep them realistic.
- Avoid unnecessary jargon or artificial complexity, this rule needs to be coexistant with the previous one, pick circumstances.
- Optimize for both ATS and human readability with formal, natural language.

### Important NOTE
- If there are no problems in a section, DO NOT EVER RETURN that in the output, even if the comment is "no issues", that is against the rules and will be penalised because it is a wastage of resources
- Skills sections have subcategories, respect that, do not flatten that structure
- take a good look at the field and subfield names and follow them in both selectors and final_output where necessary
- DO NOT EVER COMMENT 'no issues found' and return the same thing as final_output, that is a collosal waste of my time, if you think something has no issues, then just leave it, dont put it in the json output.

### general rules of thumb regarding lenghts
- Main summary should be 2-3 sentences
- Total bullets in any summary need to be between 3 and 5, softcap 4, 5 only when really necessary
  Throughly understand these rules before moving to the next stage 
  `
}