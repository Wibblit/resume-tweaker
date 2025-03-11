import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  quantity: number;
  handleQuantityChange: (quantity: number) => void;
}

export function QuantityField({ handleQuantityChange, quantity }: Props) {
  return (
    <div className="mt-3 bg-background gap-1 w-fit flex items-center rounded-sm border border-border p-[6px]">
      <Button
        disabled={quantity === 1}
        variant="secondary"
        className={`h-[32px] bg-secondary disabled:bg-transparent text-secondary-foreground border-border w-[32px] p-0 rounded-[4px] ${quantity === 1 && 'cursor-not-allowed'}`}
        onClick={() => handleQuantityChange(quantity - 1)}
      >
        <Minus />
      </Button>
      <span className="text-center leading-[24px] bg-secondary text-secondary-foreground rounded-[4px] w-[56px] px-2 py-1 text-xs">
        {quantity}
      </span>
      <Button
        variant="secondary"
        disabled={quantity === 5}
        className={`h-[32px] bg-secondary text-secondary-foreground border-border w-[32px] p-0 rounded-[4px] ${quantity === 5 && 'cursor-not-allowed'}`}
        onClick={() => handleQuantityChange(quantity + 1)}
      >
        <Plus />
      </Button>
    </div>
  );
}

