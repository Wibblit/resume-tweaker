"use server";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import DodoPayments from "dodopayments";
import { prisma } from "@/prisma";

export const getPaymentStatus = asyncHandler(async (paymentId: string) => {
  if (!paymentId) {
    throw ActionsError.custom("PyamentId required", 400);
  }
  const client = new DodoPayments({
    bearerToken:
      "Bu+fJX8yRhaYioUy.HWm/vkeSfpJYLO2jLQ/+1fTN+CeUwVxZY7ZuqOXPnwo0UAPF",
  });

  const payment = await client.payments.retrieve(paymentId);
  console.log(
    "Payment status update from server action",
    JSON.stringify(payment, null, 2)
  );
  return {
    success: true,
    message: "Payment status fetched sucessfully",
    paymentStatus: payment.status,
    status: 200,
  };
});
