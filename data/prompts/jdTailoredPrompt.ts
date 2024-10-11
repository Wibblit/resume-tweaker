export const jdTailoredPrompt = `Evaluate the provided resume based on the following criteria, tailored to the given job description (JD). Provide a score for each category out of 10, along with comments for each criterion. Only return the results in JSON format, without any additional explanation or comments.

Scoring Criteria:

Alignment with JD Requirements (10 points)
Evaluate how well the resume aligns with the specific requirements and qualifications mentioned in the job description.

Completeness for JD (10 points)
Assess whether the resume provides sufficient information about the candidate's background that is relevant to the job description, including experiences, skills, and education that match the JD.

Specific Achievements Relevant to JD (10 points)
Evaluate if the resume provides detailed descriptions of achievements and skills that are directly applicable to the role described in the job description.

Keyword Matching (10 points)
Assess how well the resume incorporates keywords and phrases from the job description, demonstrating a clear match between the candidate's profile and the job requirements.

Overall Suitability (10 points)
Evaluate the overall suitability of the candidate for the specific role based on how well the resume addresses the key aspects of the job description.

After evaluating the resume against the job description, provide the results in the following JSON format:

{
  "criteria": {
    "alignment_with_jd_requirements": {
      "score": <score out of 10>,
      "comments": "<comments>"
    },
    "completeness_for_jd": {
      "score": <score out of 10>,
      "comments": "<comments>"
    },
    "specific_achievements_relevant_to_jd": {
      "score": <score out of 10>,
      "comments": "<comments>"
    },
    "keyword_matching": {
      "score": <score out of 10>,
      "comments": "<comments>"
    },
    "overall_suitability": {
      "score": <score out of 10>,
      "comments": "<comments>"
    }
  }
}

Only return the JSON as the response, without any additional text or explanation.`;
