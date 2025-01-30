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
import { pricingPlans, currencyrates, currencies } from "@/data/payments";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  currencies: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
}

export function CurrencySelector({
  value,
  onChange,
  currencies,
}: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedCurrency = currencies.find(
    (currency) => currency.code === value
  );

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
            {currencies.map((currency) => (
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
  const [currency, setCurrency] = useState("INR");

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
            currencies={currencies}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col pb-4 ${
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
                      {currencyrates[currency].symbol}{" "}
                      {Math.ceil(
                        plan.price * currencyrates[currency].value +
                          currencyrates[currency].fee +
                          (plan.price * currencyrates[currency].value -
                            currencyrates[currency].fee) *
                            (currencyrates[currency].rate / 100)
                      )}
                    </span>
                    <span className="text-muted-foreground line-through text-sm">
                      {currencyrates[currency].symbol}{" "}
                      {Math.ceil(
                        plan.originalPrice * currencyrates[currency].value
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

                {/* <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Gateway Fee:</span>
                    <span>
                      {currencyrates[currency].symbol}
                      {currencyrates[currency].fee}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Tax (18%):</span>
                    <span>
                      {currencyrates[currency].symbol}
                      {(
                        Math.ceil(
                          plan.price * currencyrates[currency].value +
                            currencyrates[currency].fee +
                            (plan.price * currencyrates[currency].value -
                              currencyrates[currency].fee) *
                              (currencyrates[currency].rate / 100)
                        ) * 0.18
                      ).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mt-2 font-medium text-foreground">
                    <span>Effective Price:</span>
                    <span>
                      {currencyrates[currency].symbol}
                      {Math.ceil(
                        plan.price * currencyrates[currency].value +
                          currencyrates[currency].fee +
                          (plan.price * currencyrates[currency].value -
                            currencyrates[currency].fee) *
                            (currencyrates[currency].rate / 100) *
                            1.18
                      )}
                    </span>
                  </div>
                </div>*/}
              </CardContent> 
              {/* <CardFooter>
                <Button
                  className="w-full"
                //   onClick={() => router.push("/pricing/" + plan.name)}
                  variant={plan.popular ? "default" : "outline"}
                >
                  Get Started
                </Button>
              </CardFooter> */}
            </Card>
          ))}
        </div>
        {/* <div className="mt-24">
          <PaymentOfferings />
        </div> */}
      </div>
    </div>
  );
}
