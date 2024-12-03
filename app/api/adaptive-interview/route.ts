import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { adaptiveInitialPrompt } from "@/data/prompts/adaptiveStartPrompt";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined in the environment variables."
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function POST(req: NextRequest) {
//   const session = await auth();

//   let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
//   ip = ip === "::1" ? "127.0.0.1" : ip;

//   if (!session?.user?.id || rateLimiter(session.user.id, ip)) {
//     return NextResponse.json(
//       { message: "Rate limit exceeded." },
//       { status: 429 }
//     );
//   }

//   console.log("request form client", JSON.stringify(req, null, 2));
//   const {
//     jd,
//     companyName,
//     position,
//     job,
//     base64Audio,
//     numberOfQuestions,
//     currentQuestionIndex,
//     isSkipped,
//     resumeText,
//     chatHistory,
//   } = await req.json();

//   const prompt = adaptiveInitialPrompt(
//     job,
//     position,
//     companyName,
//     jd,
//     numberOfQuestions,
//     resumeText,
//   );

//   try {
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const initPrompt = {
//       role: "user",
//       parts: [{ text: prompt }],
//     };

//     if (base64Audio && !isSkipped) {
//       const transcriptionResult = await model.generateContent([
//         {
//           inlineData: {
//             mimeType: "audio/webm",
//             data: base64Audio,
//           },
//         },
//         {
//           text: "Please transcribe this audio response from the interview. Provide only the transcription, without any enhancements or corrections.",
//         },
//       ]);

//       const transcription = transcriptionResult.response.text();
//       console.log("Audio transcribed:", transcription);
//       chatHistory.push({
//         role: "user",
//         parts: [{text: transcription}]
//       })
//     }

//     const chat = model.startChat({
//       history: [initPrompt, ...chatHistory],
//     });

//     let result;
//     if (base64Audio) {
//       result = await chat.sendMessage(
//         "Based on the interview progress so far, please provide the next question."
//       );
//     } else {
//       if (isSkipped) {
//         result = await chat.sendMessage("Skipped the previous question ask nextquestion")
//       } else {
//         result = await chat.sendMessage(
//           "Please provde the first question."
//         );
//       }
//     }

//     const question = result.response.text();
//     const updatedHistory = [
//       ...chatHistory,
//       { role: "model", parts: [{ text: question }] },
//     ];

//     return NextResponse.json({
//       question: question || "No question generated.",
//       chatHistory: updatedHistory,
//     });
//   } catch (err) {
//     console.log(err, "Error occurred in adaptive interview");
//     return NextResponse.json(
//       {
//         error: "Failed to generate response",
//         details: err instanceof Error ? err.message : String(err),
//       },
//       { status: 500 }
//     );
//   }
// }

export async function POST(req: NextRequest) {
  const session = await auth();

  // Get user IP
  // let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  // ip = ip === "::1" ? "127.0.0.1" : ip;

  // if (!session?.user?.id || rateLimiter(session.user.id, ip)) {
  //   return NextResponse.json(
  //     { message: "Rate limit exceeded." },
  //     { status: 429 }
  //   );
  // }

  try {
    const {
      jd,
      companyName,
      position,
      job,
      base64Audio,
      numberOfQuestions,
      currentQuestionIndex,
      isSkipped,
      resumeText,
      chatHistory,
    } = await req.json();
    console.log( jd,
      companyName,
      position,
      job,
      base64Audio,
      numberOfQuestions,
      currentQuestionIndex,
      isSkipped,
      resumeText,
      chatHistory)

    // Adaptive prompt generation
    const prompt = adaptiveInitialPrompt(
      job,
      position,
      companyName,
      resumeText,
      jd,
      numberOfQuestions,
      chatHistory
    );

    // Get generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content using the model
    let result;
    if (base64Audio) {
       result = await model.generateContent([
        {
          inlineData: {
            mimeType: "audio/webm",
            data: base64Audio,
          },
        },
        {
          text: prompt,
        },
      ]);
    } else {
      result = await model.generateContent((currentQuestionIndex === 0
        ? "Please provide the first question"
        : isSkipped
        ? "User skipped the previous question"
        : "") + prompt)
    }

    console.log("GEMINI RESPONSE FOR ADAPTIVE", result.response.text())

    const chat = JSON.parse(result.response.text().replace(/```json\s*|\s*```/g, "").trim()); // Ensure response is valid JSON

    // Extract the last generated question
    const lastMessage = chat[chat.length - 1]?.parts[0]?.text || "";

    return NextResponse.json({
      question: lastMessage,
      chatHistory: chat,
    });
  } catch (error) {
    console.error("Error processing interview route:", error);
    return NextResponse.json(
      { message: "An error occurred while processing your request." },
      { status: 500 }
    );
  }
}
