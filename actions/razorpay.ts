"use server";
import Razorpay from "razorpay";
import { asyncHandler } from "@/lib/actionsHelpers/actionsAsyncHandler";
import { ActionsError } from "@/lib/actionsHelpers/actionsErrorHandler";
import { createHmac } from "crypto";

export const createOrder = asyncHandler(async ({ tier }: { tier: string }) => {
  if (!tier) throw ActionsError.badRequest;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret)
    throw ActionsError.custom("Razorpay keys are missing", 401);

  const instance = new Razorpay({
    key_id,
    key_secret,
  });

  const orders = await instance.orders.create({
    amount: 100,
    currency: "INR",
  });

    console.log("orders", orders)
  if (!orders) throw ActionsError.custom("Unable to create order", 500);

  const response = { orderId: orders.id };

  return {
    success: true,
    message: "Order created successfully",
    response,
    status: 200,
  };
});

export const verifyPayment = asyncHandler(
  async (data: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    try {
      const shasum = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
      shasum.update(`${data.razorpay_order_id}|${data.razorpay_payment_id}`);
      const digest = shasum.digest("hex");

      if (digest !== data.razorpay_signature) {
        throw ActionsError.custom("Transaction not legit!", 402);
      }

      // Save the payment details in the database
      return {
        success: true,
        message: "Verification successfull",
        status: 200,
      };
    } catch (error) {
      console.log("Error verifying payment", error);
      return { error: "Error verifying payment" };
    }
  }
);
