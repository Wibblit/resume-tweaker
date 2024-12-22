import { ActionsError } from "./actionsErrorHandler";
import { prisma } from "@/prisma";
import { isRedirectError } from "next/dist/client/components/redirect";

export const asyncHandler =
  (action: (...args: any[]) => Promise<any>) =>
  async (...args: any[]) => {
    try {
      return await action(...args);
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
      if (error instanceof ActionsError) {
        return {
          success: false,
          message: error.message,
          status: error.status,
        };
      }
      // Fallback for unexpected errors
      console.error("Unexpected Error:", error);
      throw new Error("An unexpected error occured"); //will this trigger custom error page ?
    } finally {
      await prisma.$disconnect();
    }
  };
