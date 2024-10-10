import { auth } from "@/auth";
import { NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(
  request: NextRequest,
  { params }: { params: { resumeId: string } }
) {
  const resumeId = params.resumeId;
  const session = await auth();
  let result = null;
  try {
    result = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId: session?.user?.id,
      },
    });
    if (result) {
      const { id, userId, resumeName, ...resumeDetails } = result;
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      console.log("resume: ", resumeDetails)
      const prompt = resumeDetails + `Evaluate the provided resume based on the following general criteria. Provide a score for each category out of 10, along with comments for each criterion. Only return the results in JSON format, without any additional explanation or comments.

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
      const generatedContent = await model.generateContent(prompt)
      const response = generatedContent.response;
      const text = response.text();
      const cleanedText = text.replace(/```json\s*|\s*```/g, '').trim();

      console.log("Gemini review : " + cleanedText)
      const resumeReview = JSON.parse(cleanedText)
      return NextResponse.json({ resumeReview, message: "Review generated successfully."})
    }
  } catch (error) {
    console.error('Error processing Gemini API response:', error)
    return NextResponse.json({ error: 'Failed to generate review for the resume', details: (error as Error).message }, { status: 500 })
  }
}
