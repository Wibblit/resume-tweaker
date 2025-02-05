import { Webhook } from "standardwebhooks";
import { NextRequest, NextResponse } from "next/server";
import { WebhookPayload } from "@/types/api-types";
const webhook = new Webhook(process.env.NEXT_PUBLIC_DODO_WEBHOOK_KEY!);

export async function POST(request: NextRequest) {
  try {
    const headersList = request.headers;
    const rawBody = await request.text();

    const webhookHeaders = {
      "webhook-id": headersList.get("webhook-id") || "",
      "webhook-signature": headersList.get("webhook-signature") || "",
      "webhook-timestamp": headersList.get("webhook-timestamp") || "",
    };

    await webhook.verify(rawBody, webhookHeaders);
    const payload = JSON.parse(rawBody) as WebhookPayload;

    if (!payload.data?.customer?.email) {
      return NextResponse.json(
        { error: "Missing customer email in payload" },
        { status: 400 }
      );
    }

    const email = payload.data.customer.email;
    if (
      payload.data.payload_type === "Payment" &&
      // payload.type === "payment.succeeded" &&
      !payload.data.subscription_id
    ) {
      console.log(
        "Webhook payload and customer email",
        email,
        JSON.stringify(payload, null, 2)
      );
      if (payload.type === "payment.succeeded") {
        
      }
    }

    return NextResponse.json(
      { message: "Webhook processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Invalid webhook payload or signature" },
      { status: 400 }
    );
  }
}
