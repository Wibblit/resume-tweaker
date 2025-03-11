

// import { CheckoutPriceAmount } from '@/components/checkout/checkout-price-amount';
// import { CheckoutEventsData } from '@paddle/paddle-js/types/checkout/events';

// interface Props {
//   checkoutData: CheckoutEventsData | null;
// }

// export function CheckoutPriceContainer({ checkoutData }: Props) {
//   return (
//     <>
//       <div className={'text-base leading-[20px] font-semibold'}>Order summary</div>
//       <CheckoutPriceAmount checkoutData={checkoutData} />
//     </>
//   );
// }


import { CheckoutPriceAmount } from "@/components/checkout/checkout-price-amount";
import { CheckoutEventsData } from "@paddle/paddle-js/types/checkout/events";

interface Props {
  checkoutData: CheckoutEventsData | null;
}

export function CheckoutPriceContainer({ checkoutData }: Props) {
  return (
    <>
      <div className="text-base leading-[20px] font-semibold text-foreground">
        Order summary
      </div>
      <CheckoutPriceAmount checkoutData={checkoutData} />
    </>
  );
}