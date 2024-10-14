// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(request: Request) {
//   const { formData, history, questionCount, maxQuestions } =
//     await request.json();

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     if (questionCount >= maxQuestions) {
//       return NextResponse.json({ shouldEndInterview: true });
//     }

//     const prompt = `You are conducting an adaptive interview for a ${
//       formData.position
//     } ${formData.job} position at ${formData.companyName}.
//     ${formData.jd ? `Consider this job description: ${formData.jd}` : ""}
    
//     Interview history:
//     ${history
//       .map(
//         (item: { question: string; answer: string }) =>
//           `Q: ${item.question}\nA: ${item.answer}`
//       )
//       .join("\n\n")}
    
//     Based on the candidate's previous answers, generate the next most appropriate interview question.
//     This is question ${questionCount + 1} out of ${maxQuestions}.
//     Return the next question as a string.`;

//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     console.log("Gemini response ", text);

//     // Clean the response by removing any potential formatting
//     const nextQuestion = text.replace(/```\s*|\s*```/g, "").trim();

//     return NextResponse.json({ nextQuestion, shouldEndInterview: false });
//   } catch (error) {
//     console.error("Error processing Gemini API response:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to generate next question",
//         details: (error as Error).message,
//       },
//       { status: 500 }
//     );
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: Request) {
  const { formData, history, questionCount, maxQuestions } =
    await request.json();

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    if (questionCount >= maxQuestions) {
      return NextResponse.json({ shouldEndInterview: true });
    }

    const prompt = `You are an AI interviewer conducting an adaptive interview for a ${
      formData.position
    } ${formData.job} position at ${formData.companyName}.
    ${formData.jd ? `Consider this job description: ${formData.jd}` : ""}
    
    Interview history:
    ${history
      .map(
        (item: { question: string; answer: string }) =>
          `Q: ${item.question}\nA: ${item.answer}`
      )
      .join("\n\n")}
    
    Based on the candidate's previous answers, generate the next most appropriate interview question.
    This is question ${questionCount + 1} out of ${maxQuestions}.
    Provide only the question text without any additional context or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Gemini response ", text);

    // Clean the response by removing any potential formatting
    const nextQuestion = text.replace(/```\s*|\s*```/g, "").trim();

    return NextResponse.json({ nextQuestion, shouldEndInterview: false });
  } catch (error) {
    console.error("Error processing Gemini API response:", error);
    return NextResponse.json(
      {
        error: "Failed to generate next question",
        details: (error as Error).message,
      },
      { status: 500 }
    );
  }
}