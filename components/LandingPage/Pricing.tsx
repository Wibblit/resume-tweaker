"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronDown, Sparkles, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { countries, currencyrates } from "@/data/payments";
import PaymentOfferings from "@/app/pricing/paymentsofferings";
const features = [
  "AI Resume Editor",
  "AI Cover Letter Editor",
  "AI Resume Review",
  "JD-Tailored Review",
  "Comprehensive AI Interview",
  "Adaptive Interview Practice",
];
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
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
import { Skeleton } from "../ui/skeleton";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  countries: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
}
import { usePaddlePrices } from "@/hooks/usePaddlePrices";
import { Environments, initializePaddle, Paddle } from "@paddle/paddle-js";

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

export default function Pricing() {
  const router = useRouter();
  const [currency, setCurrency] = useState("IN");

  const [plans, setPlans] = useState([
    {
      name: "Test",
      credits: 200,
      price: " ",
      originalPrice: 299,
      gatewayFee: 7.58,
      tax: 41.22,
      effectivePrice: 180.2,
      popular: false,
      priceID: "pri_01jhavw456v3zakrz4ewj0vt4q",
    },
    {
      name: "Starter",
      credits: 200,
      price: " ",
      originalPrice: 299,
      gatewayFee: 7.58,
      tax: 41.22,
      effectivePrice: 180.2,
      popular: false,
      priceID: "pri_01jha4dfz643eb1xb3ht6g9rw4",
    },
    {
      name: "Essentail",
      credits: 400,
      price: " ",
      originalPrice: 599,
      gatewayFee: 12.16,
      tax: 82.44,
      effectivePrice: 363.4,
      popular: true,
      priceID: "pri_01jhaat7fh766xgp8cnbsq2aa3",
    },
    {
      name: "Power",
      credits: 1000,
      price: " ",
      originalPrice: 1499,
      gatewayFee: 25.9,
      tax: 206.1,
      effectivePrice: 913,
      popular: false,
      priceID: "pri_01jhabhq1mwryzg2yt2rcp0rc7",
    },
    {
      name: "Super saver",
      credits: 2000,
      price: " ",
      originalPrice: 2999,
      gatewayFee: 48.8,
      tax: 412.2,
      effectivePrice: 1829,
      popular: false,
      priceID: "pri_01jhabppdake12g542h2t7vqm5",
    },
  ]);

  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined);

  console.log(currency);

  const { prices, loading } = usePaddlePrices(paddle, currency);

  console.log(prices);

  useEffect(() => {
    if (prices) {
      setPlans((plans) =>
        plans.map((plan) => ({
          ...plan,
          price: prices[plan.priceID]
            ? prices[plan.priceID]
            : plan.price, // Convert string price to number
        }))
      );
    }
  }, [prices]); // Only re-run the effect when prices change

  useEffect(() => {
    if (
      process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN &&
      process.env.NEXT_PUBLIC_PADDLE_ENV
    ) {
      initializePaddle({
        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
      }).then((paddle) => {
        if (paddle) {
          setPaddle(paddle);
        }
      });
    }
  }, []);

  console.log(currencyrates);
  console.log(currencyrates["IN"]);
  console.log(plans);
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
                    <span className="text-3xl font-bold">
                      {loading ? (
                         <Skeleton className="mt-4 h-[20px] w-full bg-border" />
                      ) : (
                        plan.price
                      )}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {plan.credits} Credits
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

                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Gateway Fee:</span>
                    <span>
                      {currencyrates[currency].symbol}
                      {/* {currencyrates[currency].fee} */}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Tax (18%):</span>
                    <span>
                      {currencyrates[currency].symbol}
                     
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 font-medium text-foreground">
                    <span>Effective Price:</span>
                    <span>
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => router.push("/checkout/" + plan.priceID)}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="mt-24">
          <PaymentOfferings />
        </div>
      </div>
    </div>
  );
}
