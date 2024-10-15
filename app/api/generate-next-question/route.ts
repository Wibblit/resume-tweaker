// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function GET(request: Request) {
//   const { searchParams } = new URL(request.url);
//   const formData = JSON.parse(searchParams.get("formData") || "{}");
//   const history = JSON.parse(searchParams.get("history") || "[]");
//   const questionCount = parseInt(searchParams.get("questionCount") || "0");

//   const encoder = new TextEncoder();

//   const stream = new ReadableStream({
//     async start(controller) {
//       try {
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         const prompt = `You are an AI interviewer conducting an adaptive interview for a ${
//           formData.position
//         } ${formData.job} position at ${formData.companyName}.
//         ${formData.jd ? `Consider this job description: ${formData.jd}` : ""}
        
//         Interview history:
//         ${history
//           .map(
//             (item: { question: string; answer: string }) =>
//               `Q: ${item.question}\nA: ${item.answer}`
//           )
//           .join("\n\n")}
        
//         Analyze the candidate's previous answers. If the candidate has adequately answered the previous question, generate the next most appropriate interview question.
//         If the candidate's answer is insufficient or unclear, ask a follow-up question to get more information.
//         This is question ${questionCount + 1}.
//         Provide only the question text without any additional context or explanations.`;

//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = response.text();

//         // Clean the response by removing any potential formatting
//         const nextQuestion = text.replace(/```\s*|\s*```/g, "").trim();

//         controller.enqueue(
//           encoder.encode(
//             `data: ${JSON.stringify({
//               nextQuestion,
//               shouldEndInterview: false,
//             })}\n\n`
//           )
//         );
//         controller.close();
//       } catch (error) {
//         console.error("Error processing Gemini API response:", error);
//         controller.enqueue(
//           encoder.encode(
//             `data: ${JSON.stringify({
//               error: "Failed to generate next question",
//               details: (error as Error).message,
//             })}\n\n`
//           )
//         );
//         controller.close();
//       }
//     },
//   });

//   return new Response(stream, {
//     headers: {
//       "Content-Type": "text/event-stream",
//       "Cache-Control": "no-cache",
//       Connection: "keep-alive",
//     },
//   });
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const formData = JSON.parse(searchParams.get("formData") || "{}");
  const history = JSON.parse(searchParams.get("history") || "[]");
  const questionCount = parseInt(searchParams.get("questionCount") || "0");

  const encoder = new TextEncoder();
  const keepAliveInterval = 10000; // 10 seconds
  const maxDuration = 20 * 60 * 1000; // 20 minutes in milliseconds

  let isControllerClosed = false;

  const stream = new ReadableStream({
    start(controller) {
      const startTime = Date.now();

      const safeEnqueue = (chunk: string) => {
        if (!isControllerClosed) {
          try {
            controller.enqueue(encoder.encode(chunk));
          } catch (error) {
            console.error("Error enqueueing data:", error);
            safeClose();
          }
        }
      };

      const safeClose = () => {
        if (!isControllerClosed) {
          isControllerClosed = true;
          controller.close();
        }
      };

      const generateQuestion = async () => {
        if (isControllerClosed) return;

        try {
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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
          
          Analyze the candidate's previous answers. If the candidate has adequately answered the previous question, generate the next most appropriate interview question.
          If the candidate's answer is insufficient or unclear, ask a follow-up question to get more information.
          This is question ${questionCount + 1}.
          Provide only the question text without any additional context or explanations.`;

          const result = await model.generateContent(prompt);
          const response = await result.response;
          const text = response.text();

          // Clean the response by removing any potential formatting
          const nextQuestion = text.replace(/```\s*|\s*```/g, "").trim();

          safeEnqueue(
            `data: ${JSON.stringify({
              nextQuestion,
              shouldEndInterview: false,
            })}\n\n`
          );
        } catch (error) {
          console.error("Error processing Gemini API response:", error);
          safeEnqueue(
            `data: ${JSON.stringify({
              error: "Failed to generate next question",
              details: error instanceof Error ? error.message : String(error),
            })}\n\n`
          );
        }
      };

      // Generate the first question immediately
      generateQuestion();

      const intervalId = setInterval(() => {
        if (Date.now() - startTime >= maxDuration) {
          clearInterval(intervalId);
          safeClose();
          return;
        }

        if (!isControllerClosed) {
          safeEnqueue(`: keep-alive\n\n`);
        }
      }, keepAliveInterval);

      // Ensure the interval is cleared when the client disconnects
      request.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        safeClose();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}