"use server";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { WebhookPayload } from "@/types/api-types";
import { prisma } from "@/prisma";

export const paymentUpdate = asyncHandler(async (payload: WebhookPayload) => {
  if (!payload) {
    throw ActionsError.custom("No payload available", 400);
  }
  if (payload.type === "payment.succeeded") {
  } else if (payload.type === "payment.failed") {
  } else if (payload.type === "payment.processing") {
  } else if (payload.type === "payment.cancelled") {
  }
});
