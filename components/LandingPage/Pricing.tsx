"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { countries } from "@/data/payments";
import { ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { QuantityDialog } from "@/app/pricing/QuantityDialog";
import { useSession } from "next-auth/react";

const features = [
  "AI Resume Editor",
  "AI Cover Letter Editor",
  "AI Resume Review",
  "JD-Tailored Review",
  "Comprehensive AI Interview",
  "Adaptive Interview Practice",
];

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  countries: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
}

export function CurrencySelector({
  value,
  onChange,
  countries,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedCurrency = countries.find((country) => country.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-72 justify-between bg-background hover:bg-accent hover:text-accent-foreground -mt-8 mb-8"
        >
          {selectedCurrency ? (
            <span className="flex items-center gap-2">
              <span>{selectedCurrency.flag}</span>
              <span>{selectedCurrency.name}</span>
              <span className="text-muted-foreground">
                ({selectedCurrency.code})
              </span>
            </span>
          ) : (
            "Select currency..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <Command>
          <CommandInput placeholder="Search currency..." className="h-9" />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {countries.map((currency) => (
              <CommandItem
                key={currency.code}
                value={`${currency.name} ${currency.code}`}
                onSelect={() => {
                  onChange(currency.code);
                  setOpen(false);
                }}
              >
                <span className="flex items-center gap-2 w-full">
                  <span>{currency.flag}</span>
                  <span>{currency.name}</span>
                  <span className="text-muted-foreground ml-auto">
                    {currency.code}
                  </span>
                  {value === currency.code && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface Plan {
  name: string;
  baseCredits: number;
  price: string;
  popular: boolean;
  productId: string;
}

export default function Pricing() {
  const router = useRouter();
  const [currency, setCurrency] = useState("IN");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();

  const plans: Plan[] = [
    {
      name: "Starter",
      baseCredits: 200,
      price: "299 Rs",
      popular: false,
      productId: "pdt_DyYl9HeGUDa1yPqwLnx4Q",
    },
    {
      name: "Essential",
      baseCredits: 400,
      price: " ",
      popular: true,
      productId: "",
    },
    {
      name: "Power",
      baseCredits: 1000,
      price: " ",

      popular: false,
      productId: "",
    },
    {
      name: "Super Saver",
      baseCredits: 2000,
      price: " ",
      popular: false,
      productId: "",
    },
  ];

  const handleGetStarted = (plan: Plan) => {
    setSelectedPlan(plan);
    setIsDialogOpen(true);
  };

  const handleConfirmQuantity = (newQuantity: number) => {
    setQuantity(newQuantity);
    if (selectedPlan) {
      router.push(
        `https://test.checkout.dodopayments.com/buy/${selectedPlan.productId}?quantity=${newQuantity}&redirect_url=http://localhost:3000/profile&email=${session?.user.email}&metadata_user_id=${session?.user.id}&metadata_packname=${selectedPlan.name}&metadata_credits=${selectedPlan.baseCredits}&disableEmail=true`
      );
    }
  };

  const calculateTotalCredits = (plan: Plan) => {
    return plan.baseCredits;
  };

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your career growth. All plans include
            full access to our AI-powered tools and are{" "}
            <span className="text-primary font-semibold">
              inclusive of all taxes
            </span>
            .
          </p>
        </div>

        <div className="w-full flex justify-center mb-8">
          <CurrencySelector
            value={currency}
            onChange={setCurrency}
            countries={countries}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4" /> Most Popular
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{plan.name}</span>
                  <Sparkles className="w-5 h-5 text-primary" />
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {calculateTotalCredits(plan).toLocaleString()} Credits
                  </div>
                </div>

                <div className="space-y-3">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => handleGetStarted(plan)}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {selectedPlan && (
          <QuantityDialog
            isOpen={isDialogOpen}
            onClose={() => setIsDialogOpen(false)}
            onConfirm={handleConfirmQuantity}
            title={`Purchase ${selectedPlan.name} Credits`}
            description={`Each ${
              selectedPlan.name
            } pack contains ${selectedPlan.baseCredits.toLocaleString()} credits.`}
            initialQuantity={1}
            maxQuantity={10}
            baseCredits={selectedPlan.baseCredits}
          />
        )}
      </div>
    </div>
  );
}
