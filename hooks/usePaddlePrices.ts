import {
  Paddle,
  PricePreviewParams,
  PricePreviewResponse,
} from "@paddle/paddle-js";
import { useEffect, useState } from "react";
import { pricingPlans } from "@/data/payments";

export type PaddlePrices = Record<string, string>;

function getLineItems(): PricePreviewParams["items"] {
    const priceId = pricingPlans.map((tier) => [tier.priceID]);
    //@ts-ignore
  return priceId.flat().map((priceId) => ({ priceId, quantity: 1 }));
}

function getPriceAmounts(prices: PricePreviewResponse) {
  return prices.data.details.lineItems.reduce((acc, item) => {
    acc[item.price.id] = item.formattedTotals.total;
    return acc;
  }, {} as PaddlePrices);
}

export function usePaddlePrices(
  paddle: Paddle | undefined,
  country: string
): { prices: PaddlePrices; loading: boolean } {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const paddlePricePreviewRequest: Partial<PricePreviewParams> = {
      items: getLineItems(),
      ...(country !== "OTHERS" && { address: { countryCode: country } }),
    };

    setLoading(true);
    console.log(paddlePricePreviewRequest)

    paddle
      ?.PricePreview(paddlePricePreviewRequest as PricePreviewParams)
      .then((prices) => {
        setPrices((prevState) => ({
          ...prevState,
          ...getPriceAmounts(prices),
        }));
        setLoading(false);
      });
  }, [country, paddle]);
  return { prices, loading };
}
