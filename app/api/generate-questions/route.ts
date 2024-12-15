import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { rateLimiter } from "@/lib/rateLimiter";
import { auth } from "@/auth";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const session = await auth();
  const { job, position, companyName, jd, numberOfQuestions, resumeText, totalDuration, interviewerPosition } =
    await req.json();
  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  console.log("Interviewer Position and totalduration: ", interviewerPosition, totalDuration)

  try {
    if (rateLimiter(session?.user?.id, ip)) {
      return NextResponse.json(
        { message: "Rate limit exceeded." },
        { status: 429 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are an AI interviewer conducting a structured interview for a ${position} ${job} position at ${companyName}. You are acting in the capacity of a ${interviewerPosition} and are tasked with evaluating the candidate’s qualifications, skills, and suitability for the role.
      Generate ${numberOfQuestions} interview questions for this position. 
      ${jd ? `Base the questions on this job description: ${jd}.` : ""} ${resumeText ? `Also consider the candidate's resume: ${resumeText}.` : ""
      }
      Design the questions to:
      - Assess whether the number of questions (${numberOfQuestions}) and the total time allotted (${totalDuration}) are sufficient for a natural progression:
        - If sufficient, maintain a natural flow by starting with introductory or general questions, transitioning to technical or role-specific topics, and concluding with reflective or situational questions.
        - If the time or number of questions is limited, focus directly on key responsibilities and skills from the job description. Combine related topics naturally into fewer questions to maximize depth and coverage without sacrificing clarity or relevance. Adjust the complexity of questions based on the expected response time to fit within the total time.
      - Ensure each question is insightful, relevant, and reflective of the perspective of a ${interviewerPosition}.
      - Cover the full scope of the job description, including critical skills, responsibilities, and qualifications.
      - Use diverse question types, such as technical, behavioral, situational, and opinion-based questions, while ensuring they are challenging and appropriate for the role.

      Provide the questions as a JSON array of strings, ensuring the sequence is logical and makes efficient use of the available questions and time.

      Do not include any additional text outside the JSON array.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    try {
      const text = response.text();
      // Clean the response by removing backticks and any potential JSON formatting
      const cleanedText = text.replace(/```json\s*|\s*```/g, "").trim();
      const questions = JSON.parse(cleanedText);

      //test counts
      // console.log(questions);
      console.log("Gemini response for question generation:", response);

      return NextResponse.json({ questions });
    } catch (error) {
      const questions: any[] = [];
      return NextResponse.json({ questions });
    }
  } catch (error) {
    console.error("Error processing Gemini API response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate questions",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
