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
      throw new Error("An unexpected error occured");
    } finally {
      await prisma.$disconnect();
    }
  };
