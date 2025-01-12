import { PriceSection } from "@/components/checkout/price-section";
import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";
import { useToast } from "@/hooks/use-toast";

interface PathParams {
  priceId: string;
  [key: string]: string;
}

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

  const handleCheckoutEvents = (event: CheckoutEventsData) => {
    setCheckoutData(event);
  };

  const { toast } = useToast();

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
            eventCallback: (event) => {
              if (event.data && event.name) {
                console.log(event.name, event.data);
                handleCheckoutEvents(event.data);

                // Handle specific events
                //@ts-ignore
                // if (event.name === "checkout.payment.failed") {
                //   console.error("Checkout failed:", event.data);
                //   // Show an error message to the user
                //   window.location.href = `/checkout/fail/${event.data.items[0].price_id}`;
                // }
              }
            },
            checkout: {
              settings: {
                displayMode: "inline",
                theme: "dark",
                allowLogout: !userEmail,
                frameTarget: "paddle-checkout-frame",
                frameInitialHeight: 450,
                frameStyle:
                  "width: 100%; background-color: transparent; border: none",
                successUrl: "/checkout/success",
              },
            },
          });

          if (initializedPaddle && priceId) {
            setPaddle(initializedPaddle);
            console.log(initializedPaddle, "yoo");

            try {
              console.log(userEmail);
              initializedPaddle.Checkout.open({
                ...(userEmail && { customer: { email: userEmail } }),
                items: [{ priceId, quantity: 1 }],
              });
            } catch (checkoutError) {
              console.error("Error opening checkout:", checkoutError);
               toast({
                 title: "Failed",
                 description: "Unable to checkout",
                 variant: "destructive",
               });
            }
          }
        }
      } catch (initError) {
        console.error("Failed to initialize Paddle:", initError);
        toast({
          title: "Failed",
          description: "Unable to initiate paddle payment",
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
