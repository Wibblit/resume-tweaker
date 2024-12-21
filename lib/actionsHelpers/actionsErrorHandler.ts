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
    401
  );
  static badRequest = new ActionsError("Invalid request data.", 400);
  static unexpectedError = new ActionsError("An unexpected error occurred.", 500);
}
