import { NextRequest, NextResponse } from "next/server";
import { globalErrorHandler } from "./errorHandler";
import { prisma } from "@/prisma";

type HandlerFunc = (req: NextRequest, context: any) => Promise<NextResponse | Response>;

export const asyncHandler = (func: HandlerFunc) => {
  return async (req: NextRequest, context: any): Promise<NextResponse | Response> => {
    try {
      return await func(req, context);
    } catch (error: any) {
      console.error("Error in API handler:", error);
      return globalErrorHandler(error);
    } finally {
      try {
        await prisma.$disconnect();
      } catch (prismaError) {
        console.error("Error disconnecting Prisma:", prismaError);
      }
    }
  };
};
