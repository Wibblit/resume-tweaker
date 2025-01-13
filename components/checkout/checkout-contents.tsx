import { PriceSection } from "@/components/checkout/price-section";
import {
  Environments,
  initializePaddle,
  Paddle,
  PaddleEventData,
} from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { initiatePayment } from "@/actions/initiatePayment";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { useToast } from "@/hooks/use-toast";
import { prisma } from "@/prisma";

interface Props {
  userEmail?: string;
  priceId: string;
}

export function CheckoutContents({ userEmail, priceId }: Props) {
  console.log(priceId);
  const [quantity, setQuantity] = useState<number>(1);
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(
    null
  );

  const { toast } = useToast();

  type CheckoutEventData = {
    name: string;
    data: any;
  };

  const handleCheckoutEvents = async (event: CheckoutEventData) => {
    setCheckoutData(event.data);
    console.log("Checkout Event:", event);

    const { name, data } = event;

    switch (name) {
      case "checkout.payment.initiated":
        console.log("Payment initiated:", data);
        try {
          const res = await initiatePayment(data);

          console.log(res);

          if (!res.success) {
            toast({
              title: "Payment Failed",
              description: res.message,
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "Payment Initiated",
            description: "Your payment process has started.",
          });
        } catch (error) {
          console.log(error);
          toast({
            title: "Payment failed",
            description: "Failed to initiate payment",
            variant: "destructive",
          });
        }
        break;

      case "checkout.payment.failed":
        console.error("Payment failed:", data);
        toast({
          title: "Payment Failed",
          description: "Your payment could not be processed. Please try again.",
          variant: "destructive",
        });
        if (data?.items?.[0]?.price_id) {
          window.location.href = `/checkout/fail/${data.items[0].price_id}`;
        }
        break;

      case "checkout.items.updated":
        console.log("Items updated:", data);
        toast({
          title: "Cart Updated",
          description: "Your cart items were updated.",
        });
        break;
    }
  };

  useEffect(() => {
    const initPaddle = async () => {
      try {
        if (
          !paddle?.Initialized &&
          process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
          process.env.NEXT_PUBLIC_PADDLE_ENV
        ) {
          const initializedPaddle = await initializePaddle({
            token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
            environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,

            eventCallback: (event: PaddleEventData) => {
              if (
                event?.name &&
                typeof event.name === "string" &&
                event?.data
              ) {
                console.log(`Event received: ${event.name}`, event.data);

                // Use type guard or type assertion if necessary
                handleCheckoutEvents(event as CheckoutEventData);
              } else {
                console.error("Invalid event structure:", event);
              }
            },

            checkout: {
              settings: {
                displayMode: "inline",
                theme: "dark",
                allowLogout: true, // Adjust based on your needs
                frameTarget: "paddle-checkout-frame",
                frameInitialHeight: 450,
                frameStyle:
                  "width: 100%; background-color: transparent; border: none",
                // successUrl: "/checkout/success",
              },
            },
          });

          if (initializedPaddle && priceId) {
            setPaddle(initializedPaddle);
            console.log("Paddle initialized:", initializedPaddle);

            try {
              initializedPaddle.Checkout.open({
                ...(userEmail && { customer: { email: userEmail } }),
                items: [{ priceId, quantity: 1 }],
              });
            } catch (checkoutError: any) {
              console.error("Error during checkout:", checkoutError);
              toast({
                title: "Checkout Failed",
                description: "Unable to start the checkout process.",
                variant: "destructive",
              });
            }
          }
        }
      } catch (initError: any) {
        console.error("Failed to initialize Paddle:", initError);
        toast({
          title: "Initialization Failed",
          description: `Error initializing Paddle: ${
            initError.message || "Unknown error"
          }`,
          variant: "destructive",
        });
      }
    };

    initPaddle();
  }, [paddle?.Initialized, priceId, userEmail]);

  useEffect(() => {
    if (paddle && priceId && paddle.Initialized) {
      paddle.Checkout.updateItems([{ priceId: priceId, quantity: quantity }]);
    }
  }, [paddle, priceId, quantity]);

  return (
    <div
      className={`
        rounded-lg 
        md:bg-background/80 
        md:backdrop-blur-[24px] 
        md:p-10 md:pl-16 md:pt-16 
        md:min-h-[400px] 
        flex flex-col justify-between 
        relative
        text-foreground
        bg-background
        border border-border
      `}
    >
      <div className="flex flex-col md:flex-row gap-8 md:gap-16">
        <div className="w-full md:w-[400px]">
          <PriceSection
            checkoutData={checkoutData}
            quantity={quantity}
            handleQuantityChange={setQuantity}
          />
        </div>
        <div className="min-w-[375px] lg:min-w-[535px]">
          <div className="text-base leading-[20px] font-semibold mb-8 text-foreground">
            Payment details
          </div>
          <div className="paddle-checkout-frame" />
        </div>
      </div>
    </div>
  );
}
