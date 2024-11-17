export const reportGenerationPrompt = `Based on the above questions and attached users audio/text response of those, evaluate the candidate's performance using the specific categories listed below. For each category, provide a score out of 10 and a brief comment explaining why that score was given. Ensure that your feedback is based solely on the content of the responses provided.

Categories to Evaluate:

Subject Knowledge (Out of 10):
Measures the candidate's understanding of the subject matter. A high score reflects comprehensive and accurate knowledge; a low score means significant gaps or misunderstandings. Provide a concise comment explaining what was done well or poorly based on the answer.

Communication Skills (Out of 10):
Evaluates how clearly, concisely, and logically the candidate communicated their thoughts, considering possible transcription errors. A high score means the answers were easy to follow, while a low score indicates lack of clarity or coherence. The comment should justify the score based on the ease of understanding.

Problem-Solving Ability (Out of 10):
Assesses the candidate’s logical approach to problem-solving. A high score means they offered an efficient, structured solution, while a low score means they struggled to present a clear method or solution. Comment briefly on the reasoning and approach used by the candidate.

Response Structure (Out of 10):
Evaluates how well-organized the answers were. A high score means the response had a logical flow, while a low score indicates disorganization or confusion. Provide a brief comment on how well the candidate structured their thoughts and ideas.

Professionalism and Attitude (Out of 10):
Assesses the tone, demeanor, and level of professionalism demonstrated in the responses. A high score reflects respectful, focused, and professional answers, while a low score means the responses were inappropriate or off-topic. Comment on the candidate’s attitude and professionalism.

Return Format:

Provide the evaluation results in strict JSON format with no additional text or information. The JSON must have the following structure:

{ "evaluation": [ { "category": "Subject Knowledge", "score": 0, "comment": "" }, { "category": "Communication Skills", "score": 0, "comment": "" }, { "category": "Problem-Solving Ability", "score": 0, "comment": "" }, { "category": "Response Structure", "score": 0, "comment": "" }, { "category": "Professionalism and Attitude", "score": 0, "comment": "" } ], "overall_score": 0, "final_recommendation": "", "overall_comment": "" }

Evaluation Notes:

Scores (Out of 10):
Each category must receive an integer score between 0 and 10 (where 10 is excellent, 0 is inadequate), with a comment explaining the reasoning.

Overall Score:
The overall_score must be the average of the five category scores, rounded to two decimal places.

Final Recommendation:
Based on the overall score:

Hire for scores between 8.00 and 10.00.
Consider for scores between 5.00 and 7.99.
Do Not Hire for scores below 5.00.
Overall Comment:
Provide a brief summary (1-2 sentences) on the candidate’s overall performance, justifying the final recommendation.

Strict Output Requirements:

Only return the JSON structure specified.
Do not return any other text, explanations, or formatting.`;
