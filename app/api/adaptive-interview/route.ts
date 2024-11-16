import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  const session = await auth();

  let ip = req.ip || req.headers.get("x-forwarded-for") || "127.0.0.1";
  ip = ip === "::1" ? "127.0.0.1" : ip;

  if (rateLimiter(session?.user?.id, ip)) {
    return NextResponse.json(
      { message: "Rate limit exceeded." },
      { status: 429 }
    );
  }

  try {
    const { formData, history, audioBlob } = await req.json();
    const { job, position, companyName, jd } = formData;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const initialPrompt = {
      role: "user",
      parts: [
        {
          text: `You are an AI interviewer conducting an adaptive interview for a ${position} ${job} position at ${companyName}. 
        ${jd ? `Consider this job description: ${jd}` : ""}
        
        Based on the candidate's previous answers, generate the next most appropriate question for this interview. 
        If you believe the interview should be concluded, respond with "Interview complete." followed by a brief summary of the interview.
        
        Ensure the questions are challenging, relevant to the position, and adapt based on the candidate's previous responses. You are starting first based on the provided details of the interview. And if you want to conclude the interview just send the string "conclude" without and pre-post text or formatting`,
        },
      ],
    };

    const chat = model.startChat({
      history: [initialPrompt, ...history],
      generationConfig: {
        maxOutputTokens: 800,
      },
    });

    let result;
    if (history.length > 0) {
      if (audioBlob) {
        const transcribeAudioText = await getTranscribedText(audioBlob);
        history.push({ role: "user", parts: [{ text: transcribeAudioText }] });
        result = await chat.sendMessage(transcribeAudioText);
      } else {
        console.log("No audio blob provided")
      }
    } else {
      result = await chat.sendMessage(
        "Please provide the first interview question."
      );
      history.push({
        role: "model",
        parts: [{ text: result.response.text() }],
      });
    }

    const response = result?.response;
    const question = response?.text();

    return NextResponse.json({ question, history });
  } catch (err) {
    console.log(err, "err occured in adaptive interview");
    return NextResponse.json(
      { error: "Failed to generate report", details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}


//helper functions

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result.split(",")[1]);
      } else {
        reject(new Error("Failed to convert blob to base64"));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

async function getTranscribedText(audioBlob: Blob) {
  const base64Audio = await blobToBase64(audioBlob);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent([
    {
      inlineData: {
        mimeType: "audio/webm",
        data: base64Audio,
      },
    },
    {
      text: "please provide me the text of the audio attached, ensure that the resultant response only contains the transcribed audio text and nothing else",
    },
  ]);

  const response = await result.response;
  return response.text();
}
