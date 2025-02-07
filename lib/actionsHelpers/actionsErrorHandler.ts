export class ActionsError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, ActionsError.prototype);
  }

  static rateLimitExceeded = new ActionsError("Rate limit exceeded.", 429);
  static userNotAuthenticated = new ActionsError(
    "User is not authenticated.",
    401,
  );
  static resourceNotFound = new ActionsError("Resource not found.", 404);
  static unauthorizedAction = new ActionsError("Unauthorized action.", 403);
  static validationError = new ActionsError("Data validation failed.", 422);
  static badRequest = new ActionsError("Invalid actions arguments", 400);
  static internalServerError = new ActionsError("Internal server error", 500);

  //Custom error with dynamic message
  static custom(message: string, status: number) {
    return new ActionsError(message, status);
  }
}
