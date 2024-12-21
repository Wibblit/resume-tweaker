import { NextResponse } from "next/server";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }

  // Predefined errors as static properties
  static invalidRequest = new ApiError("Invalid request data.", 400);
  static userNotAuthenticated = new ApiError("User not authenticated.", 401);
  static forbidden = new ApiError("Access denied.", 403);
  static resourceNotFound = new ApiError("Requested resource not found.", 404);
  static conflict = new ApiError("Conflict detected.", 409);
  static rateLimitExceeded = new ApiError("Rate limit exceeded.", 429);
  static internalServerError = new ApiError("Internal server error.", 500);

  // Custom error with dynamic message
  static custom(message: string, status: number) {
    return new ApiError(message, status);
  }
}

// Global error handler
export const globalErrorHandler = (error: unknown): NextResponse => {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: error.status },
    );
  }

  // Fallback for unknown errors
  return NextResponse.json(
    { message: "An unexpected error occurred.", success: false },
    { status: 500 },
  );
};
