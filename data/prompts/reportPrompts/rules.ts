export const reportRules = () => {
    return `

### THINGS NOT TO JUDGE
- Do not judge the fields in the json, or the structure of the json, they are final, your job is only to judge the contents
- never ever make any issues about the structure of the json objects, return them in the same structure you that you recieved them, this is very very important

#### Commenting Rules:
- Be specific and actionable — no generic feedback.
- Follow this format for writing issues: '[strictly 3-4 word description, in passive voice] - [specific issue]' eg. 'Tone Inconsistency detected - Use formal language to maintain consistency and professionalism'
- Do not use the same comment for multiple issues, be specific
- Only comment on serious issues; minor ones can be ignored.
- Fix content but never alter dates, URLs, or HTML structure.

#### Correction Process:
- Use JSON selectors for pinpoint accuracy.
- Provide full field values, even for small changes.
- final_output field must be clean and ready for use (no placeholders or comment markers) and must be in the final format to insert directly into the resume without requiring cleanup, so no paranthesis comments or anything, it needs to be final, this is a correction, dont suggest things in this, this is the final corrected value part of the selector.
- Prioritize conciseness, while correcting take into account the no of sentences or points before making the correction.
- The correction must be in line with the comment and the correction_logic

#### Special case for correction
- note that the main resume summary is an array of objects, even though it only has one single object, the selector for summary content is summary[0].content, not summary.content

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
- If you catch yourself writing "no issues found" or putting an empty [] in the comment, then you are doing something wrong, because you are not supposed to return that in the output, only return the issues you find, if you find none, then dont return anything
- Skills sections have subcategories, respect that, do not flatten that structure
- take a good look at the field and subfield names and follow them in both selectors and final_output where necessary
- DO NOT EVER COMMENT 'no issues found' and return the same thing as final_output, that is a collosal waste of my time, if you think something has no issues, then just leave it, dont put it in the json output.

### general rules of thumb regarding lenghts
- Main summary should be 2-3 sentences
- Total bullets in any summary need to be between 3 and 5, softcap 4, 5 only when really necessary
  Throughly understand these rules before moving to the next stage 

### formatting rules
- There must be no newline characters inside the json content
- There must be no unescaped double quotes inside the content because this will break the json, because its already surrounded by quotations
- Overall note that the main output you generate will be parsed as json, and  as for the final_output field, some of them are strings, but others are objects represented as strings which need to be valid to be parsed, so be careful
  
### Imporant NOTE 2 ONLY FOR NON JSON INPUT, SKIP THIS SECTION IF INPUT IS IN JSON {
  - If the input is not in JSON format, then switch to makebelieve mode
  - in makebelieve mode, you fill the selectors fields with mainfieldname_orderno, example- experience_1, project_2
  - Do not go deep and review subsection in this mode, eg single points of a summary, only review full sections and give outputs, plain text is fine
  - But keep the outputs valid jsons though, thats important.}


`
}