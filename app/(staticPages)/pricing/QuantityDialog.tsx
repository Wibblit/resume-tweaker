import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, CreditCard, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  initialQuantity?: number;
  maxQuantity?: number;
  title?: string;
  description?: string;
  baseCredits?: number;
}

export function QuantityDialog({
  isOpen,
  onClose,
  onConfirm,
  initialQuantity = 1,
  maxQuantity = 99,
  title = "Purchase Credits",
  description = "Select the number of credit packs to purchase.",
  baseCredits = 100,
}: QuantityDialogProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [error, setError] = useState("");

  useEffect(() => {
    setQuantity(initialQuantity);
    setError("");
  }, [isOpen, initialQuantity]);

  const handleQuantityChange = (value: string) => {
    const newQuantity = parseInt(value, 10);
    if (isNaN(newQuantity)) {
      setError("Please enter a valid number of packs");
      return;
    }
    if (newQuantity < 1) {
      setError("Minimum purchase is 1 pack");
      return;
    }
    if (newQuantity > maxQuantity) {
      setError(`Maximum purchase is ${maxQuantity} packs`);
      return;
    }
    setError("");
    setQuantity(newQuantity);
  };

  const adjustQuantity = (increment: number) => {
    const newQuantity = quantity + increment;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
      setError("");
    }
  };

  const handleConfirm = () => {
    if (!error && quantity >= 1 && quantity <= maxQuantity) {
      onConfirm(quantity);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !error) {
      handleConfirm();
    }
  };

  const totalCredits = quantity * baseCredits;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{title}</DialogTitle>
          </div>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-4 justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustQuantity(-1)}
              disabled={quantity <= 1}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>

            <div className="relative w-24">
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(e.target.value)}
                onKeyDown={handleKeyDown}
                min={1}
                max={maxQuantity}
                className={cn(
                  "text-center pr-4 pl-4",
                  error && "border-red-500 focus-visible:ring-red-500"
                )}
                aria-label="Number of credit packs"
              />
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustQuantity(1)}
              disabled={quantity >= maxQuantity}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div className="text-center space-y-1">
            <div className="flex items-center justify-center">
              <div className="inline-flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-md backdrop-blur-sm shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                <span className="font-medium text-amber-700 dark:text-amber-400">
                  Total Credits: {totalCredits.toLocaleString()}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Press Enter or click Purchase to continue
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!!error || quantity < 1 || quantity > maxQuantity}
          >
            Purchase
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}