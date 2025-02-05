import { Payment as BasePayment } from "dodopayments/resources/payments.mjs";
import { Subscription as BaseSubscription } from "dodopayments/resources/subscriptions.mjs";

export type Payment = BasePayment & { payload_type: string };
export type Subscription = BaseSubscription & { payload_type: string };

export type WebhookPayload = {
  type: string;
  data: Payment | Subscription;
};
