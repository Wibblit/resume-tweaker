import { ActionsError } from "./actionsErrorHandler";
import { prisma } from "@/prisma";

export const asyncHandler =
  (action: (...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    try {
      return await action(...args);
    } catch (error) {
      if (error instanceof ActionsError) {
        return {
          success: false,
          message: error.message,
          status: error.status,
        };
      }

      // Fallback for unexpected errors
      console.error("Unexpected Error:", error);
      return {
        success: false,
        message: "An unexpected error occurred.",
        status: 500,
      };
    } finally {
      await prisma.$disconnect();
    }
  };
