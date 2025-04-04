import { NextResponse } from "next/server";
import { z } from "zod";

const feedbackSchema = z.object({
  date: z.string().datetime(),
  name: z.string().min(1),
  email: z.string().email(),
  feedbackType: z.enum(["General Feedback", "Feature Suggestion", "Bug Report"]),
  feedbackContent: z.string().min(10),
  followup: z.boolean(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);

    if (!process.env.APPSHEET_APP_ID || !process.env.APPSHEET_TABLE_NAME || !process.env.APPSHEET_ACCESS_KEY) {
      throw new Error("Missing AppSheet configuration");
    }

    const response = await submitFeedback(validatedData);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(`AppSheet API failed: ${responseData.error || 'Unknown error'}`);
    }

    return NextResponse.json({ 
      success: true, 
      data: responseData 
    });
  } catch (error) {
    console.error("Feedback submission error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid feedback data", 
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to submit feedback"
      }, 
      { status: 500 }
    );
  }
}

async function submitFeedback(data: z.infer<typeof feedbackSchema>) {
  const baseUrl = "https://www.appsheet.com"; // or "https://eu.appsheet.com" for EU region
  const appsheetUrl = `${baseUrl}/api/v2/apps/${process.env.APPSHEET_APP_ID}/tables/${process.env.APPSHEET_TABLE_NAME}/Action`;
  
  const response = await fetch(
    `${appsheetUrl}?applicationAccessKey=${process.env.APPSHEET_ACCESS_KEY}`,
    {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        Action: "Add",
        Properties: {
        },
        Rows: [
          {
            Date: data.date,
            Name: data.name,
            Email: data.email,
            "Feedback Type": data.feedbackType,
            "Feedback Content": data.feedbackContent,
            "Followup": data.followup
          }
        ]
      })
    }
  );

  // Check if response is ok before returning
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    console.error("Error response from AppSheet:", errorData);
    throw new Error(`AppSheet API failed: ${errorData?.error || response.statusText}`);
  }

  return response;
}