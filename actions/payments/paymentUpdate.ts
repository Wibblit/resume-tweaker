"use server";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { WebhookPayload } from "@/types/api-types";
import { prisma } from "@/prisma";
import { revalidatePath } from "next/cache";

export const paymentUpdate = asyncHandler(async (payload: any) => {
  if (!payload) {
    throw ActionsError.custom("No payload available", 400);
  }

  const payment = await prisma.payment.findUnique({
    where: {
      paymentId: payload.data.payment_id,
    },
  });

  if (!payment) {
    const payments = await prisma.payment.create({
      data: {
        paymentId: payload.data.payment_id,
        credits:
          Number(payload.data.metadata.credits) *
          payload.data.product_cart[0].quantity,
        currency: payload.data.currency,
        productId: payload.data.product_cart[0].product_id,
        productName: payload.data.metadata.packname,
        quantity: payload.data.product_cart[0].quantity,
        status: payload.data.status,
        tax: payload.data.tax,
        total: payload.data.total_amount,
        user: {
          connect: {
            id: payload.data.metadata.user_id,
          },
        },
      },
    });

    if (payments.status === "succeeded") {
      await prisma.userAssets.update({
        where: {
          userId: payload.data.metadata.user_id,
        },
        data: {
          credits: {
            increment: payments.credits,
          },
        },
      });
    }
  } else if (payment.status !== "succeeded") {
    if (payload.type === "payment.succeeded") {
      const payments = await prisma.payment.update({
        where: {
          paymentId: payload.data.payment_id,
        },
        data: {
          status: payload.data.status,
        },
      });

      await prisma.userAssets.update({
        where: {
          userId: payload.data.metadata.user_id,
        },
        data: {
          credits: {
            increment: payments.credits,
          },
        },
      });
    } else {
      await prisma.payment.update({
        where: {
          paymentId: payload.data.payment_id,
        },
        data: {
          status: payload.data.status,
        },
      });
    }
  }

  revalidatePath("/profile", "page");
});
