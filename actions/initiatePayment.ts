"use server";
import { prisma } from "@/prisma";
import { auth } from "@/auth";
import { rateLimiter } from "@/lib/rateLimiter";
import { headers } from "next/headers";

const Credits: { [key: string]: number } = {
  pri_01jha4dfz643eb1xb3ht6g9rw4: 200,
  pri_01jhaat7fh766xgp8cnbsq2aa3: 400,
  pri_01jhabhq1mwryzg2yt2rcp0rc7: 1000,
  pri_01jhabppdake12g542h2t7vqm5: 2000,
};

export async function initiatePayment(data: any) {
  try {
    const session = await auth();
    console.log("The Data for pameny", data);
    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        message: "User is not authenticated",
      };
    }

    const ip = headers().get("x-forwarded-for") || "127.0.0.1";
    const ratelimit = rateLimiter(session.user.id, ip);

    if (ratelimit) {
      return { success: false, message: "Rate limit exceeded" };
    }

    // Process the payment logic using Prisma
    const payment = await prisma.payment.create({
      data: {
        currency: data.currency_code,
        priceId: data.items[0].price_id,
        priceName: data.items[0].price_name,
        quantity: data.items[0].quantity,
        status: "PENDING",
        tax: data.totals.tax,
        total: data.totals.total,
        transactionId: data.transaction_id,
        userId: session.user.id,
        credits: Credits[data.items[0].price_id] * data.items[0].quantity,
      },
    });

    return {
      success: true,
      message: "Payment Initiated",
      payment: {
        id: payment.id,
        status: payment.status,
        total: payment.total,
        transactionId: payment.transactionId,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: "Error initiating payment",
      error: error,
    };
  }
}
