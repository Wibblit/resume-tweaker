export const maxDuration = 60;
export const dynamic = "force-dynamic";
import { asyncHandler } from "@/lib/apiRouteHelpers/asyncHandler";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { ApiError } from "@/lib/apiRouteHelpers/errorHandler";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ResumeStyles } from "@/types/types";
import { DEFAULT_RESUME_STYLES } from "@/data/reviewData";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Define the standard section order
const STANDARD_SECTION_ORDER = [
  "basics",
  "profiles",
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "languages",
  "awards",
  "publications",
  "references",
  "volunteer",
];

// Helper function to get non-empty sections
function getNonEmptySections(resumeData: any): {
  presentSections: string[];
  missingSections: string[];
} {
  const presentSections = [];
  const missingSections = [];

  // Check each section in the standard order
  for (const section of STANDARD_SECTION_ORDER) {
    const sectionData = resumeData[section];

    // Check if section exists and has non-empty data
    if (sectionData && Array.isArray(sectionData) && sectionData.length > 0) {
      // Special handling for different sections
      switch (section) {
        case "basics":
          // Basics should have at least name or email
          const basics = sectionData[0];
          if (basics.name || basics.email) {
            presentSections.push(section);
          } else {
            missingSections.push(section);
          }
          break;

        case "summary":
          // Summary should have content
          const summary = sectionData[0];
          if (summary.content && summary.content.trim()) {
            presentSections.push(section);
          } else {
            missingSections.push(section);
          }
          break;

        case "skills":
          // Skills should have at least one category with skills
          const hasSkills =
            Array.isArray(sectionData) && sectionData.length > 0;
          if (hasSkills) {
            presentSections.push(section);
          } else {
            missingSections.push(section);
          }
          break;

        case "experience":
        case "education":
        case "projects":
        case "certifications":
        case "awards":
        case "publications":
        case "references":
        case "volunteer":
          // For these sections, check if any item has meaningful data
          const hasData = sectionData.some((item) => {
            // Check common fields that should have data
            const hasRole = item.role && item.role.trim();
            const hasOrganization =
              item.organization && item.organization.trim();
            const hasName = item.name && item.name.trim();
            const hasTitle = item.title && item.title.trim();
            const hasInstitution = item.institution && item.institution.trim();
            const hasSummary = item.summary && item.summary.trim();
            // At least one of these fields should have data
            return (
              hasRole ||
              hasOrganization ||
              hasName ||
              hasTitle ||
              hasInstitution ||
              hasSummary
            );
          });

          if (hasData) {
            presentSections.push(section);
          } else {
            missingSections.push(section);
          }
          break;

        case "profiles":
          // Profiles should have at least one with a valid URL
          const hasProfile = sectionData.some(
            (profile) =>
              profile.url && profile.url.href && profile.url.href.trim()
          );
          if (hasProfile) {
            presentSections.push(section);
          } else {
            missingSections.push(section);
          }
          break;

        case "languages":
          // Languages should have at least one with name and level
          const hasLanguage = sectionData.some(
            (lang) =>
              lang.name && lang.name.trim() && lang.level && lang.level.trim()
          );
          if (hasLanguage) {
            presentSections.push(section);
          } else {
            missingSections.push(section);
          }
          break;
      }
    } else {
      missingSections.push(section);
    }
  }

  return {
    presentSections,
    missingSections,
  };
}

// Helper function to update resume styles
function updateResumeStyles(
  presentSections: string[],
  missingSections: string[]
): ResumeStyles {
  const styles = DEFAULT_RESUME_STYLES;

  // Update section order in column1
  styles.sectionOrder.sections[0].column1 = presentSections;

  // Update unused sections
  styles.sectionOrder.column3 = missingSections;

  return styles;
}

export const POST = asyncHandler(async (req: NextRequest) => {
  const { text } = await req.json();
  const session = await auth();

  if (!session || !session.user || !session.user.id)
    throw ApiError.userNotAuthenticated;
  if (!text) throw ApiError.invalidRequest;

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const prompt = `
  This is a user-uploaded resume from my onboarding page. Extract all profile data available in the resume and format it strictly according to the structure below. If a field does not have data, include it with default values (empty strings, empty arrays, or undefined as applicable). Ensure that the output is a valid JSON string that can be directly parsed using JSON.parse (Will direct updated in redux state after parsing).
  
  ### Rules
  - Analyse the resume miticulously and extract all the information available in the resume.
  - The resume may contain the following sections: basics, summary, profiles, skills, projects, education, experience, languages, volunteer, awards, publications, certifications, references.
  - for the skills section, notice that skills are grouped by their category, and each skill individually has a name and a level.
  - for the skills section, do not put all the skills as one comma separated string, instead, group them by their category and each skill should have a name and a level.
  - for the education section, the degree field should contain the degree name, the field field should contain the field of study, and the specialization field should contain the specialization if available. ex (Bachelor of Technology (degree)) in (Computer Science and Engineering (field)) with specialization in (Artificial Intelligence(specialization)). 
  - for the basics and the summary section, notice how they are arrays, but they will only ever contain one object, but keep them as arrays.

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
  --------------------------------------------------
  Input Resume Text: ${JSON.stringify(text, null, 2)}
  --------------------------------------------------
  Output Instructions:
  - The output should strictly follow the structure and field names provided above.
  - If a field has no data, leave it with its default value (e.g., "", [], or null).
  - If a section has all fields empty, leave it as an empty array, dont fill it with an object with empty field values, yes even the summary section(dont fill it with {"content":""}).
  - Return the output as a valid JSON string that can be parsed using JSON.parse.
  - Make sure to generate unique uuid in place of <UNIQUE_UUID>
  - Href and label combo needs to both be filled, if you cant find the href, i.e the url(make sure the url makes sense, it must be a valid url format, domain name and the path, if this is not satisfied then it cannot be considered as a url, also if you do find a url make sure you put https:// before it), then fill it with null and label with an empty string, if this is the profile section, then leave it empty like []

  ### IMPORTANT NOTE
  - Dates must always be in this format "2025-03-12T14:30:00.000Z" for 12/3/2025 14:30, make sure that startDate, endDate and the date fields only contain these values in this format
  - Regardless of what format you get the date
  - note that the skills section has a structure that allows a skill category to have multiple skills, each skill has a name and a level, please utiz.
  - note that the summary fields in the projects, experience, and awards sections are html formatted, they will most likely have unordered lists, and bolds etc, make sure they are formatted properly.
  - example of a summary field in the projects section(use this as a reference for the other summary fields):
  "summary": "<ul><li>Implemented a new feature for the app</li><li>Fixed a bug in the app</li></ul>"

  `.trim();

  const result = await model.generateContent(prompt);
  const rawData = result.response.text().trim();
  const jsonString = rawData
    .replace(/undefined/g, "null")
    .replace(/\bNaN\b/g, "null")
    .replace(/```json\s*|\s*```/g, "")
    .trim();

  const resume = JSON.parse(jsonString);

  // Get the list of present and missing sections
  const { presentSections, missingSections } = getNonEmptySections(resume);

  // Update resume styles based on parsed data
  const updatedStyles = updateResumeStyles(presentSections, missingSections);
  console.log("resume", JSON.stringify(resume, null, 2));
  console.log("styles", JSON.stringify(updatedStyles, null, 2));

  return NextResponse.json({
    resume,
    styles: updatedStyles,
  });
});
