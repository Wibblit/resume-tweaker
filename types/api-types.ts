import { Payment as BasePayment } from "dodopayments/resources/payments";

export type Payment = BasePayment & {
  product_cart?:
    | {
        product_id: string;
        quantity: number;
      }[]
    | null; // Ensures it's optional and can be null

  status?:
    | "succeeded"
    | "failed"
    | "cancelled"
    | "processing"
    | "requires_customer_action"
    | "requires_merchant_action"
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_capture"
    | "partially_captured"
    | "partially_captured_and_capturable"
    | null; // Explicitly allow null

  tax?: string | number | null; // Allow null or undefined

  metadata?: {
    credits?: number | null; // Ensure it can be null
    packname?: string;
  };
};
// export type Payment = BasePayment & { payload_type: string };

export type WebhookPayload = {
  type: string;
  data: Payment;
};
