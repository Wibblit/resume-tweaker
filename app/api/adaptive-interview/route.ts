import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";

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

  const { formData, history } = await req.json();

  const { job, position, companyName, jd } = formData;

  console.log("Processing adaptive interview request");

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const initialPrompt = {
    role: "user",
    parts: [{
      text: `You are an AI interviewer conducting an adaptive interview for a ${position} ${job} position at ${companyName}. 
      ${jd ? `Consider this job description: ${jd}` : ""}
      
      Based on the candidate's previous answers, generate the next most appropriate question for this interview. 
      If you believe the interview should be concluded, respond with "Interview complete." followed by a brief summary of the interview.
      
      Ensure the questions are challenging, relevant to the position, and adapt based on the candidate's previous responses. You are starting first based on the provided details of the interview.`
    }]
  };

  // Convert history to the correct format, changing 'assistant' role to 'model'
  const formattedHistory = history.map((item: any) => ({
    role: item.role === 'assistant' ? 'model' : item.role,
    parts: [{ text: item.role === 'user' ? 'Audio response provided' : item.content }],
  }));

  // Remove the last user message from the history
  const historyWithoutLastUser = formattedHistory.slice(0, -1);

  const chat = model.startChat({
    history: [initialPrompt, ...historyWithoutLastUser],
    generationConfig: {
      maxOutputTokens: 800,
    },
  });

  let result;
  if (history.length > 0) {
    // If there's a history, send the last user message
    const lastUserMessage = history.filter((item: any) => item.role === "user").pop();
    if (lastUserMessage) {
      result = await chat.sendMessage(`Audio: ${lastUserMessage.content}`);
    } else {
      // If there's no user message in history, send a default message
      result = await chat.sendMessage("Please provide the first interview question.");
    }
  } else {
    // If there's no history, ask for the first question
    result = await chat.sendMessage("Please provide the first interview question.");
  }

  const response = result.response;
  const question = response.text();

  return NextResponse.json({ question });
}