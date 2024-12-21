import { NextRequest, NextResponse } from "next/server";
import { globalErrorHandler } from "./errorHandler";
import { prisma } from "@/prisma";

type HandlerFunc = (req: NextRequest) => Promise<NextResponse>;

export const asyncHandler = (func: HandlerFunc) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await func(req);
    } catch (error: any) {
      console.error("Error in API handler:", error);
      return globalErrorHandler(error);
    } finally {
      await prisma.$disconnect();
    }
  };
};
