import { EventEntity, EventName } from "@paddle/paddle-node-sdk";
import { prisma } from "@/prisma";

export class ProcessWebhook {
  async processEvent(eventData: EventEntity) {
    switch (eventData.eventType) {
      case "transaction.paid":
      case "transaction.payment_failed":
      case "transaction.canceled":
        await this.updatePaymentStatus(eventData);
        break;
      default:
        console.log(`Unhandled event type: ${eventData.eventType}`);
    }
  }

  private async updatePaymentStatus(eventData: any) {
    console.log(eventData);

    try {
      const paymentStatus = this.getPaymentStatus(eventData.eventType);
      const response = await prisma.payment.update({
        where: { transactionId: eventData.data.id },
        data: {
          status: paymentStatus,
          updatedAt: new Date(),
        },
      });
      console.log("Payment status updated:", response);
    } catch (e) {
      console.error("Error updating payment status:", e);
    }
  }

  private getPaymentStatus(eventType: string) {
    switch (eventType) {
      case "transaction.paid":
        return "SUCCESS";
      case "transaction.payment_failed":
      case "transaction.canceled":
        return "FAILED";
      default:
        return "PENDING";
    }
  }
}
