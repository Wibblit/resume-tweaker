'use client'

import jp from 'jsonpath';
import { ResumeData } from '@/types/types';

export function getPropertyServer(obj: any, selector: string): any {
  try {
    // Remove the $ prefix if it exists, as we're adding it
    const cleanSelector = selector.startsWith('$') ? selector : `$.${selector}`;
    const result = jp.query(obj, cleanSelector);
    return result.length === 1 ? result[0] : result;
  } catch (error) {
    console.error("Invalid selector:", selector, error);
    return undefined;
  }
}

export function updateResumeDataServer(resumeData: ResumeData, selector: string, finalOutput: string): ResumeData{
  const updatedData = JSON.parse(JSON.stringify(resumeData));
  
  try {
    let parsedOutput: any = finalOutput;
    try {
      parsedOutput = JSON.parse(finalOutput);
    } catch (e) {
      // If parsing fails, use the original string
    }

    // Clean the selector
    const cleanSelector = selector.startsWith('$') ? selector : `$.${selector}`;
    jp.value(updatedData, cleanSelector, parsedOutput);
    return updatedData;
  } catch (error) {
    console.error("Invalid JSONPath selector:", selector, error);
    return resumeData; // Return original data if update fails
  }
}

export function processAcceptAllChanges(resumeData: ResumeData, changes: { selector: string, final_output: string }[]): ResumeData {
  let updatedData = JSON.parse(JSON.stringify(resumeData));
  
  for (const { selector, final_output } of changes) {
    try {
      let parsedOutput: any = final_output;
      try {
        parsedOutput = JSON.parse(final_output);
      } catch (e) {
        // If parsing fails, use the original string
      }

      // Clean the selector
      const cleanSelector = selector.startsWith('$') ? selector : `$.${selector}`;
      jp.value(updatedData, cleanSelector, parsedOutput);
    } catch (error) {
      console.error("Invalid JSONPath selector:", selector, error);
    }
  }
  
  return updatedData;
}