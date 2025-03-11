export const genericPrompt = `Evaluate the provided resume based on the following general criteria. Provide a score for each category out of 10, along with comments for each criterion. Only return the results in JSON format, without any additional explanation or comments.

          Scoring Criteria:

          Clarity and Readability (10 points)
          Evaluate the overall clarity and readability of the information presented in the resume.

          Completeness (10 points)
          Assess whether the resume provides sufficient information about the candidate's background, including relevant experiences, skills, and education.

          Detail and Specificity (10 points)
          Evaluate if the resume provides detailed descriptions, uses action-oriented language, and presents specific achievements or skills.

          Relevance (10 points)
          Assess if the information provided is relevant to general job applications, avoiding unnecessary or unrelated content.

          Grammar and Language (10 points)
          Evaluate the overall grammar, spelling, and professional tone of the resume.

          NOTE: 
            Make sure to assess different parts of the resume, dont write comments only about one section.
            Structure the comments by first giving the main comment and then move on to the specific section(s) which the comment is about.

          After evaluating the resume, provide the results in the following JSON format:

          { 
          "criteria": { 
          "clarity_and_readability": { 
            "score": <score out of 10>, 
            "comments": "<comments>" }, 
          "completeness": { 
            "score": <score out of 10>, 
            "comments": "<comments>" },
          "detail_and_specificity": { 
            "score": <score out of 10>, 
            "comments": "<comments>" }, 
          "relevance": { 
            "score": <score out of 10>, 
            "comments": "<comments>" }, 
          "grammar_and_language": { 
            "score": <score out of 10>, 
            "comments": "<comments>" } 
          } }

          Only return the JSON as the response, without any additional text or explanation.`;
