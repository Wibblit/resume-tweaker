export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const POST = asyncHandler(async (req: NextRequest) => {
  const { text } = await req.json();
  const session = await auth();

  if (!session || !session.user || !session.user.id)
    throw ApiError.userNotAuthenticated;
  if (!text) throw ApiError.invalidRequest;

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = `
  This is a user-uploaded resume from my onboarding page. Extract all profile data available in the resume and format it strictly according to the structure below. If a field does not have data, include it with default values (empty strings, empty arrays, or undefined as applicable). Ensure that the output is a valid JSON string that can be directly parsed using JSON.parse (Will direct updated in redux state after parsing).
  
  The required structure is as follows:
  
  {
    "basics": [
      {
        "id": "UNIQUE_UUID",
        "name": "",
        "email": "",
        "phone": "",
        "location": "",
        "headLine": "",
        "picture": null,
        "url": {
          "href": "",
          "label": ""
        }
      }
    ],
    "summary": [
      {
        "content": ""
      }
    ],
    "profiles": [
      {
        "id": "UNIQUE_UUID",
        "url": {
          "href": "",
          "label": ""
        }
      }
    ],
    "skills": [
      {
       "id": "UNIQUE_UUID",
        "name": "",
        "skills": [
          {
            "name": "",
            "level": ""
          }
        ]
      }
    ],
    "projects": [
      {
        "id": "UNIQUE_UUID",
        "name": "",
        "summary": "",
        "startDate": "",
        "endDate": "",
        "url": {
          "href": "",
          "label": ""
        },
        "keywords": [""]
      }
    ],
    "education": [
      {
        "id": "UNIQUE_UUID",
        "institution": "",
        "degree": "",
        "field": "",
        "specialization": "",
        "startDate": "",
        "endDate": "",
        "score": ""
      }
    ],
    "experience": [
      {
        "id": "UNIQUE_UUID",
        "organization": "",
        "role": "",
        "startDate": "",
        "endDate": "",
        "location": "",
        "summary": ""
      }
    ],
    "languages": [
      {
        "id": "UNIQUE_UUID",
        "name": "",
        "level": ""
      }
    ],
    "volunteer": [
      {
        "id": "UNIQUE_UUID",
        "organization": "",
        "role": "",
        "startDate": "",
        "endDate": "",
        "location": ""
      }
    ],
    "awards": [
      {
        "id": "UNIQUE_UUID",
        "title": "",
        "awarder": "",
        "date": "",
        "summary": ""
      }
    ],
    "publications": [
      {
        "id": "UNIQUE_UUID",
        "name": "",
        "publisher": "",
        "publishedIn": "",
        "url": {
          "href": "",
          "label": ""
        },
        "date": ""
      }
    ],
    "certifications": [
      {
        "id": "UNIQUE_UUID",
        "name": "",
        "issuer": "",
        "date": "",
        "url": {
          "href": "",
          "label": ""
        }
      }
    ],
    "references": [
      {
        "id": "UNIQUE_UUID",
        "name": "",
        "phone": "",
        "email": ""
      }
    ]
  }
  
  Input Resume Text: ${JSON.stringify(text, null, 2)}
  
  Output Instructions:
  - The output should strictly follow the structure and field names provided above.
  - If a field has no data, leave it with its default value (e.g., "", [], or null).
  - Return the output as a valid JSON string that can be parsed using JSON.parse.
  If a section has no data, include the structure with default values. For example:
- For "references," always include an array with at least one object:
  "references": [
    {
      "name": "",
      "phone": "",
      "email": ""
    }
  ]
  - Make sure to generate unique uuid in place of <UNIQUE_UUID>
  `.trim();

  const result = await model.generateContent(prompt);
  const rawData = result.response.text().trim();
  const jsonString = rawData
    .replace(/undefined/g, "null")
    .replace(/\bNaN\b/g, "null")
    .replace(/```json\s*|\s*```/g, "")
    .trim();
  //console.log("json string", jsonString);
  const cleanedData = JSON.parse(jsonString);

  //console.log(
  //   "Gemini response for resume parsing:",
  //   JSON.stringify(cleanedData, null, 2)
  // );

  return NextResponse.json({ cleanedData });
});
