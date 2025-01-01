// "use client";

// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Check, Sparkles, Star } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { pricingPlans } from "@/data/payments";
// import PaymentOfferings from "@/app/pricing/paymentsofferings";
// import { useState } from "react";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import { currencyrates, currencies } from "@/data/payments";


// const features = [
//   "AI Resume Editor",
//   "AI Cover Letter Editor",
//   "AI Resume Review",
//   "JD-Tailored Review",
//   "Comprehensive AI Interview",
//   "Adaptive Interview Practice",
// ];


// export default function Pricing() {
//   const router = useRouter();

//   const [currency, setCurrency] = useState("INR");
//   console.log(currency);
//   return (
//     <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h1 className="text-4xl font-bold tracking-tight mb-4">
//             Simple, Transparent Pricing
//           </h1>
//           <p className="text-muted-foreground max-w-2xl mx-auto">
//             Choose the perfect plan for your career growth. All plans include
//             full access to our AI-powered tools and are{" "}
//             <span className="text-primary font-semibold">
//               inclusive of all taxes
//             </span>
//             .
//           </p>
//         </div>

//         <div className="w-full max-w-xs flex items-center justify-center">
//           <Select
//             value={currency}
//             onValueChange={(value) => setCurrency(value)}
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Select a currency" />
//             </SelectTrigger>
//             <SelectContent>
//               {currencies.map((currency) => (
//                 <SelectItem key={currency.code} value={currency.code}>
//                   { currency.flag} {currency.name} ({currency.code})
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <p className="mt-2 text-sm text-gray-500">
//             Selected Currency: <span className="font-medium">{currency}</span>
//           </p>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
//           {pricingPlans.map((plan) => (
//             <Card
//               key={plan.name}
//               className={`relative flex flex-col ${
//                 plan.popular ? "border-primary shadow-lg scale-105" : ""
//               }`}
//             >
//               {plan.popular && (
//                 <div className="absolute -top-4 left-1/2 -translate-x-1/2">
//                   <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full flex items-center gap-1">
//                     <Star className="w-4 h-4" /> Most Popular
//                   </span>
//                 </div>
//               )}

//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span>{plan.name}</span>
//                   <Sparkles className="w-5 h-5 text-primary" />
//                 </CardTitle>
//               </CardHeader>

//               <CardContent className="flex-grow">
//                 <div className="mb-6">
//                   <div className="flex items-baseline gap-2">
//                     <span className="text-3xl font-bold">
//                       {currencyrates[currency].symbol}{" "}
//                       {Math.ceil(
//                         plan.price * currencyrates[currency].value +
//                           currencyrates[currency].fee +
//                           (plan.price * currencyrates[currency].value -
//                             currencyrates[currency].fee) *
//                             (currencyrates[currency].rate / 100)
//                       )}
//                     </span>
//                     <span className="text-muted-foreground line-through text-sm">
//                       {currencyrates[currency].symbol}{" "}
//                       {Math.ceil(
//                         plan.originalPrice * currencyrates[currency].value
//                       )}
//                     </span>
//                   </div>
//                   <div className="text-sm text-muted-foreground mt-1">
//                     {plan.credits} Credits
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   {features.map((feature) => (
//                     <div key={feature} className="flex items-center gap-2">
//                       <Check className="w-4 h-4 text-primary" />
//                       <span className="text-sm">{feature}</span>
//                     </div>
//                   ))}
//                 </div>

//                 <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
//                   <div className="flex justify-between">
//                     <span>Gateway Fee:</span>
//                     <span>₹{plan.gatewayFee}</span>
//                   </div>
//                   <div className="flex justify-between mt-1">
//                     <span>Tax (18%):</span>
//                     <span>₹{(Math.ceil(
//                         plan.price * currencyrates[currency].value +
//                           currencyrates[currency].fee +
//                           (plan.price * currencyrates[currency].value -
//                             currencyrates[currency].fee) *
//                             (currencyrates[currency].rate / 100)
//                       ))*0.18}</span>
//                   </div>
//                   <div className="flex justify-between mt-2 font-medium text-foreground">
//                     <span>Effective Price:</span>
//                     <span>₹{plan.effectivePrice}</span>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   className="w-full"
//                   onClick={() => router.push("/pricing/" + plan.name)}
//                   variant={plan.popular ? "default" : "outline"}
//                 >
//                   Get Started
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//         <div className="mt-24">
//           <PaymentOfferings />
//         </div>
//       </div>
//     </div>
//   );
// }


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

//@ts-ignore
const CurrencySelector = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: { target: any; }) => {
      //@ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <div className="relative w-72 mb-10" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 text-left bg-background border border-input hover:bg-accent hover:text-accent-foreground rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <span className="flex items-center justify-between">
          <span className="flex items-center">
            <span className="mr-2">{selectedCurrency?.flag}</span>
            <span>{selectedCurrency?.name}</span>
            <span className="ml-2">{selectedCurrency?.code}</span>
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          >
            {currencies.map((currency) => (
              <button
                key={currency.code}
                className="w-full px-4 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground"
                onClick={() => {
                  onChange(currency.code);
                  setIsOpen(false);
                }}
              >
                <span className="flex items-center">
                  <span className="mr-2">{currency.flag}</span>
                  <span className="mr-2">{currency.name}</span>
                  <span>{currency.code}</span>
                  {currency.code === value && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pricingPlans.map((plan) => (
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

                <div className="mt-6 pt-6 border-t text-sm text-muted-foreground">
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
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  onClick={() => router.push("/pricing/" + plan.name)}
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

