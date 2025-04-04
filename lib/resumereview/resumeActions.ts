'use client';

import { ResumeData } from '@/types/types';

// Type for the JSONPath module
type JSONPath = {
  query: (obj: any, path: string) => any[];
  value: (obj: any, path: string, newValue?: any) => any;
};

async function getJsonPath(): Promise<JSONPath> {
  const module = await import('jsonpath');
  return module.default || module;
}

export async function getPropertyServer(obj: any, selector: string): Promise<any> {
  try {
    const jp = await getJsonPath();
    const result = jp.query(obj, selector);
    return Array.isArray(result) && result.length === 1 ? result[0] : result;
  } catch (error) {
    console.error('Invalid selector:', selector, error);
    return undefined;
  }
}

export async function updateResumeDataServer(
  resumeData: ResumeData, 
  selector: string, 
  finalOutput: string
): Promise<ResumeData> {
  const updatedData = JSON.parse(JSON.stringify(resumeData));

  try {
    let parsedOutput: any = finalOutput;
    try {
      parsedOutput = JSON.parse(finalOutput);
    } catch (e) {
      // Use the original string if JSON parsing fails
    }

    const jp = await getJsonPath();
    jp.value(updatedData, selector, parsedOutput);
    return updatedData;
  } catch (error) {
    console.error('Invalid selector:', selector, error);
    return resumeData;
  }
}

export async function processAcceptAllChanges(
  resumeData: ResumeData, 
  changes: { selector: string, final_output: string }[]
): Promise<ResumeData> {
  let updatedData = JSON.parse(JSON.stringify(resumeData));
  const jp = await getJsonPath();

  for (const { selector, final_output } of changes) {
    try {
      let parsedOutput: any = final_output;
      try {
        parsedOutput = JSON.parse(final_output);
      } catch (e) {
        // Use the original string if JSON parsing fails
      }

      jp.value(updatedData, selector, parsedOutput);
    } catch (error) {
      console.error('Invalid selector:', selector, error);
    }
  }

  return updatedData;
}