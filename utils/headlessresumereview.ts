import { prisma } from "@/prisma";
import { creditList } from "@/utils/credits";
import { saveResumeData } from "@/actions/saveResumeData";
import { ResumeData, ResumeStyles } from "@/types/types";

interface HeadlessReviewOptions {
  resumeId: string;
  userId: string;
  reviewType: "generic" | "tailored";
  jd?: string;
  acceptAllChanges?: boolean;
}

interface HeadlessReviewResult {
  success: boolean;
  message: string;
  reviewResults?: any;
  error?: string;
}

export async function performHeadlessReview({
  resumeId,
  userId,
  reviewType,
  jd = "",
  acceptAllChanges = true
}: HeadlessReviewOptions): Promise<HeadlessReviewResult> {
  try {
    // Check credits
    const userAssets = await prisma.userAssets.findUnique({
      where: { userId },
      select: { credits: true }
    });

    const requiredCredits = creditList.get(reviewType) ?? 0;
    if (!userAssets || userAssets.credits < requiredCredits) {
      return {
        success: false,
        message: `Insufficient credits. Required: ${requiredCredits}`,
      };
    }

    // Get resume
    const resume = await prisma.resume.findUnique({
      where: {
        id: resumeId,
        userId,
      },
    });

    if (!resume) {
      return {
        success: false,
        message: "Resume not found",
      };
    }

    // Process resume data
    const { id, userId: _, resumeName, styles, ...resumeData } = resume;

    // Get AI review
    const reviewResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/get-resume-review`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        resumeId,
        jd,
        resumeOption: "select",
        reviewType,
      }),
    });

    if (!reviewResponse.ok) {
      throw new Error(`Review API request failed: ${reviewResponse.statusText}`);
    }

    const reviewResult = await reviewResponse.json();

    // If not auto-accepting changes, return review results
    if (!acceptAllChanges) {
      return {
        success: true,
        message: "Review completed. Changes need manual approval.",
        reviewResults: reviewResult.output,
      };
    }

    // Process and apply changes
    if (reviewResult.output?.finalStageResults) {
      const updatedResumeData = { ...resumeData } as unknown as ResumeData;

      for (const change of reviewResult.output.finalStageResults) {
        try {
          const selectorParts = change.selector.split('.');
          let current: any = updatedResumeData;
          
          // Navigate to the correct location in the resume data
          for (let i = 0; i < selectorParts.length - 1; i++) {
            const part = selectorParts[i];
            // Handle array indices in selectors
            if (part.includes('[')) {
              const [arrayName, indexStr] = part.split('[');
              const index = parseInt(indexStr.replace(']', ''));
              if (!current[arrayName]) current[arrayName] = [];
              if (!current[arrayName][index]) current[arrayName][index] = {};
              current = current[arrayName][index];
            } else {
              if (!current[part]) current[part] = {};
              current = current[part];
            }
          }

          // Apply the change
          const lastKey = selectorParts[selectorParts.length - 1];
          if (current && typeof current === 'object') {
            current[lastKey] = change.final_output;
          }
        } catch (error) {
          console.error(`Failed to apply change for selector ${change.selector}:`, error);
        }
      }

      // Save updated resume
      try {
        const saveResult = await saveResumeData(
          updatedResumeData,
          styles as ResumeStyles,
          resumeId,
          "reviewupdate"
        );

        // Update credits
        await prisma.userAssets.update({
          where: { userId },
          data: {
            credits: {
              decrement: requiredCredits
            }
          }
        });

        return {
          success: true,
          message: "Review completed and changes applied successfully",
          reviewResults: saveResult,
        };
      } catch (error) {
        return {
          success: false,
          message: "Failed to save changes",
          error: error instanceof Error ? error.message : "Unknown error occurred",
        };
      }
    }

    return {
      success: false,
      message: "No changes to apply",
    };

  } catch (error) {
    return {
      success: false,
      message: "Review process failed",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}