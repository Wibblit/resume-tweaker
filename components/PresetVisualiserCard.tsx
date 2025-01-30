// "use client";

// import { useState, useMemo } from "react";
// import {
//   Bar,
//   BarChart,
//   ResponsiveContainer,
//   XAxis,
//   YAxis,
//   Tooltip,
//   TooltipProps,
//   LabelList,
// } from "recharts";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2 } from "lucide-react";

// // Constants
// const SERVICES = [
//   { name: "AI-Assist", cost: 1 },
//   { name: "Resume Review", cost: 10 },
//   { name: "Comp. Interview", cost: 20 },
//   { name: "Adaptive Interview", cost: 30 },
// ] as const;

// const PRESET_ALLOCATIONS = {
//   200: [
//     [50, 5, 4, 1], // Bias AI-Assist
//     [50, 25, 2, 1], // Bias Resume Review
//     [50, 4, 4, 1], // Bias Comprehensive Interview
//     [30, 3, 1, 4], // Bias Adaptive Interview
//   ],
//   500: [
//     [360, 5, 3, 1], // Bias AI-Assist
//     [200, 55, 8, 4], // Bias Resume Review
//     [80, 10, 13, 2], // Bias Comprehensive Interview
//     [50, 5, 5, 10], // Bias Adaptive Interview
//   ],
//   1000: [
//     [740, 10, 6, 2], // Bias AI-Assist
//     [200, 55, 8, 4], // Bias Resume Review
//     [100, 20, 25, 5], // Bias Comprehensive Interview
//     [60, 10, 10, 25], // Bias Adaptive Interview
//   ],
//   2000: [
//     [1400, 20, 10, 5], // Bias AI-Assist
//     [400, 100, 20, 8], // Bias Resume Review
//     [200, 40, 60, 10], // Bias Comprehensive Interview
//     [120, 20, 20, 45], // Bias Adaptive Interview
//   ],
// };
// const bundleNames = {
//   200: "Starter",
//   500: "Essential",
//   1000: "Power",
//   2000: "Super Saver",
// };
// const BIAS_LABELS = [
//   "AI-Assist",
//   "Resume Review",
//   "Comp. Interview",
//   "Adaptive Interview",
// ];

// const BUNDLE_DESCRIPTIONS = {
//   200: "The Starter bundle is perfect for job seekers beginning their career journey. It provides a compact yet impactful credit allocation to access essential tools like AI-powered resume assistance, professional reviews, and mock interviews. Ideal for those testing the waters or preparing for a handful of applications, this bundle ensures you have everything needed to get started with confidence.",
//   500: "The Essential bundle offers a balanced credit allocation, making it ideal for candidates with regular job application needs. Whether you're fine-tuning resumes, practicing for interviews, or both, the credits in this bundle allow you to fully utilize the platform's features. It’s the go-to choice for those seeking to enhance their preparation while managing multiple opportunities.",
//   1000: "The Power bundle is designed for serious job seekers aiming to maximize their chances of success. With a larger credit allocation, it’s perfect for tackling numerous applications and preparing for high-stakes interviews. Whether you're targeting competitive roles or applying across industries, the Power bundle ensures you have ample resources to stand out every step of the way.",
//   2000: "The Super Saver bundle delivers the highest value, offering a generous credit allocation to support extensive job search efforts. Perfect for ambitious candidates managing high application volumes or preparing for multiple rounds of interviews, this bundle ensures you can make the most of all features without worrying about running out of credits. It’s the ultimate choice for thorough preparation at an unbeatable value.",
// };

// // Custom tooltip component
// const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
//   if (!active || !payload?.length) return null;

//   const data = payload[0].payload as {
//     name: string;
//     value: number;
//     actualValue: number;
//     costAdjusted: number;
//     percentage: number;
//     serviceCost: number;
//   };

//   return (
//     <Card className="bg-background border p-2 shadow-lg">
//       <div className="text-sm space-y-1">
//         <p className="font-medium">{data.name}</p>
//         <p>Services: {data.actualValue}</p>
//         <p>Credits per service: {data.serviceCost}</p>
//         <p>Total cost: {data.costAdjusted}</p>
//       </div>
//     </Card>
//   );
// };

// function PresetVisualCard() {
//   const [selectedBundle, setSelectedBundle] =
//     useState<keyof typeof PRESET_ALLOCATIONS>(200);
//   const [selectedBias, setSelectedBias] = useState(0);

//   const chartData = useMemo(() => {
//     const currentAllocation = PRESET_ALLOCATIONS[selectedBundle][selectedBias];
//     const costAdjustedValues = currentAllocation.map(
//       (value, index) => value * SERVICES[index].cost
//     );
//     const total = costAdjustedValues.reduce((sum, val) => sum + val, 0);

//     return currentAllocation.map((value, index) => ({
//       name: SERVICES[index].name,
//       value: costAdjustedValues[index],
//       actualValue: value,
//       costAdjusted: costAdjustedValues[index],
//       percentage: (costAdjustedValues[index] / total) * 100,
//       serviceCost: SERVICES[index].cost,
//     }));
//   }, [selectedBundle, selectedBias]);

//   return (
//     <Card className="w-full max-w-7xl mx-auto">
//       <CardHeader className="flex flex-wrap flex-col">
//         <CardTitle className="text-3xl font-bold">
//           What You Get With Each Bundle
//         </CardTitle>
//         <CardDescription className="text-muted-foreground text-start">
//           Our credit bundles are designed to give you flexibility. Use your
//           credits across different features based on your needs. <br />

//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//           {/* Left Column */}
//           <div className="space-y-6 flex flex-col">
//             <div className="flex flex-wrap gap-2 justify-center">
//               {Object.keys(PRESET_ALLOCATIONS).map((bundle) => (
//                 <Button
//                   key={bundle}
//                   variant={
//                     selectedBundle === Number(bundle) ? "default" : "outline"
//                   }
//                   onClick={() =>
//                     setSelectedBundle(Number(bundle) as 200 | 500 | 1000 | 2000)
//                   }
//                   className="min-w-[100px]"
//                 >
//                   {bundle} Credits
//                 </Button>
//               ))}
//             </div>

//             <Card className="bg-muted">
//               <CardContent className="pt-6">
//                 <p className="text-muted-foreground">
//                   {BUNDLE_DESCRIPTIONS[selectedBundle]}
//                 </p>
//               </CardContent>
//             </Card>
//             <div className="flex-1"></div>
//             <p className="text-sm text-muted-foreground text-center">
//               <CheckCircle2 className="inline-block w-4 h-4 mr-1" />
//               Credit usage is flexible across features
//             </p>
//           </div>

//           {/* Right Column */}
//           <div className="space-y-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle className="text-xl">
//                   {bundleNames[selectedBundle]} bundle
//                 </CardTitle>
//                 <CardDescription>{selectedBundle} Credits</CardDescription>
//               </CardHeader>
//               <CardContent className="pt-1">
//                 <div className="h-[350px] w-full">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <BarChart data={chartData}>
//                       <XAxis
//                         dataKey="name"
//                         tick={{
//                           fill: "hsl(var(--foreground))",
//                         }}
//                         tickFormatter={(value) => value.split(" ").join("\n")}
//                         tickLine={false}
//                         axisLine={false}
//                         height={60}
//                       />
//                       <YAxis
//                         tick={false} // Hides the ticks
//                         domain={[
//                           0,
//                           Math.max(...chartData.map((d) => d.value)) * 1.1,
//                         ]} // Add extra space above bars
//                         axisLine={false} // Hides the axis line
//                         tickLine={false} // Hides the tick line
//                         width={0}
//                       />
//                       <Tooltip content={CustomTooltip} />
//                       <Bar
//                         dataKey="value"
//                         fill="hsl(var(--primary))"
//                         radius={[4, 4, 4, 4]}
//                       >
//                         <LabelList
//                           dataKey="costAdjusted"
//                           position="top"
//                           fill="hsl(var(--foreground))"
//                           formatter={(value: any) => `${value} credits`}
//                         />
//                       </Bar>
//                     </BarChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <p className="text-sm text-muted-foreground text-start">
//                   <CheckCircle2 className="inline-block w-4 h-4 mr-1" />
//                   Feel free to bias the feature(s) you want to use the most.
//                 </p>
//                 <div className="flex flex-wrap gap-2 mt-4 justify-center">
//                   {BIAS_LABELS.map((label, index) => (
//                     <Button
//                       key={label}
//                       variant={selectedBias === index ? "default" : "outline"}
//                       onClick={() => setSelectedBias(index)}
//                     >
//                       {label}
//                     </Button>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }

// export default PresetVisualCard;
"use client"

import { useState, useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, type TooltipProps, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Constants
const SERVICES = [
  { name: "AI-Assist", cost: 1 },
  { name: "Resume Review", cost: 10 },
  { name: "Comp. Interview", cost: 20 },
  { name: "Adaptive Interview", cost: 30 },
] as const

const PRESET_ALLOCATIONS = {
  200: [
    [50, 5, 4, 1], // Bias AI-Assist
    [50, 25, 2, 1], // Bias Resume Review
    [50, 4, 4, 1], // Bias Comprehensive Interview
    [30, 3, 1, 4], // Bias Adaptive Interview
  ],
  500: [
    [360, 5, 3, 1], // Bias AI-Assist
    [200, 55, 8, 4], // Bias Resume Review
    [80, 10, 13, 2], // Bias Comprehensive Interview
    [50, 5, 5, 10], // Bias Adaptive Interview
  ],
  1000: [
    [740, 10, 6, 2], // Bias AI-Assist
    [200, 55, 8, 4], // Bias Resume Review
    [100, 20, 25, 5], // Bias Comprehensive Interview
    [60, 10, 10, 25], // Bias Adaptive Interview
  ],
  2000: [
    [1400, 20, 10, 5], // Bias AI-Assist
    [400, 100, 20, 8], // Bias Resume Review
    [200, 40, 60, 10], // Bias Comprehensive Interview
    [120, 20, 20, 45], // Bias Adaptive Interview
  ],
}
const bundleNames = {
  200: "Starter",
  500: "Essential",
  1000: "Power",
  2000: "Super Saver",
}
const BIAS_LABELS = ["AI-Assist", "Resume Review", "Comp. Interview", "Adaptive Interview"]

const BUNDLE_DESCRIPTIONS = {
  200: "The Starter bundle is perfect for job seekers beginning their career journey. It provides a compact yet impactful credit allocation to access essential tools like AI-powered resume assistance, professional reviews, and mock interviews. Ideal for those testing the waters or preparing for a handful of applications, this bundle ensures you have everything needed to get started with confidence.",
  500: "The Essential bundle offers a balanced credit allocation, making it ideal for candidates with regular job application needs. Whether you're fine-tuning resumes, practicing for interviews, or both, the credits in this bundle allow you to fully utilize the platform's features. It’s the go-to choice for those seeking to enhance their preparation while managing multiple opportunities.",
  1000: "The Power bundle is designed for serious job seekers aiming to maximize their chances of success. With a larger credit allocation, it’s perfect for tackling numerous applications and preparing for high-stakes interviews. Whether you're targeting competitive roles or applying across industries, the Power bundle ensures you have ample resources to stand out every step of the way.",
  2000: "The Super Saver bundle delivers the highest value, offering a generous credit allocation to support extensive job search efforts. Perfect for ambitious candidates managing high application volumes or preparing for multiple rounds of interviews, this bundle ensures you can make the most of all features without worrying about running out of credits. It’s the ultimate choice for thorough preparation at an unbeatable value.",
}

// Custom tooltip component
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null

  const data = payload[0].payload as {
    name: string
    value: number
    actualValue: number
    costAdjusted: number
    percentage: number
    serviceCost: number
  }

  return (
    <Card className="bg-background border p-2 shadow-lg">
      <div className="text-sm space-y-1">
        <p className="font-medium">{data.name}</p>
        <p>Services: {data.actualValue}</p>
        <p>Credits per service: {data.serviceCost}</p>
        <p>Total cost: {data.costAdjusted}</p>
      </div>
    </Card>
  )
}

function ServicesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Service</TableHead>
          <TableHead className="text-right">Credit Cost</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {SERVICES.map((service) => (
          <TableRow key={service.name}>
            <TableCell>{service.name}</TableCell>
            <TableCell className="text-right">{service.cost}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function PresetVisualCard() {
  const [selectedBundle, setSelectedBundle] = useState<keyof typeof PRESET_ALLOCATIONS>(200)
  const [selectedBias, setSelectedBias] = useState(0)

  const chartData = useMemo(() => {
    const currentAllocation = PRESET_ALLOCATIONS[selectedBundle][selectedBias]
    const costAdjustedValues = currentAllocation.map((value, index) => value * SERVICES[index].cost)
    const total = costAdjustedValues.reduce((sum, val) => sum + val, 0)

    return currentAllocation.map((value, index) => ({
      name: SERVICES[index].name,
      value: costAdjustedValues[index],
      actualValue: value,
      costAdjusted: costAdjustedValues[index],
      percentage: (costAdjustedValues[index] / total) * 100,
      serviceCost: SERVICES[index].cost,
    }))
  }, [selectedBundle, selectedBias])

  return (
    <Card className="w-full max-w-7xl mx-auto">
      <CardHeader className="flex flex-wrap flex-col">
        <CardTitle className="text-3xl font-bold">What You Get With Each Bundle</CardTitle>
        <CardDescription className="text-muted-foreground text-start">
          Our credit bundles are designed to give you flexibility. Use your credits across different features based on
          your needs. <br />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6 flex flex-col">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(PRESET_ALLOCATIONS).map((bundle) => (
                <Button
                  key={bundle}
                  variant={selectedBundle === Number(bundle) ? "default" : "outline"}
                  onClick={() => setSelectedBundle(Number(bundle) as 200 | 500 | 1000 | 2000)}
                  className="min-w-[100px]"
                >
                  {bundle} Credits
                </Button>
              ))}
            </div>

            <Card className="bg-muted">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">{BUNDLE_DESCRIPTIONS[selectedBundle]}</p>
                <ServicesTable />
              </CardContent>
            </Card>
            <div className="flex-1"></div>
            <p className="text-sm text-muted-foreground text-center">
              <CheckCircle2 className="inline-block w-4 h-4 mr-1" />
              Credit usage is flexible across features
            </p>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{bundleNames[selectedBundle]} bundle</CardTitle>
                <CardDescription>{selectedBundle} Credits</CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis
                        dataKey="name"
                        tick={{
                          fill: "hsl(var(--foreground))",
                        }}
                        tickFormatter={(value) => value.split(" ").join("\n")}
                        tickLine={false}
                        axisLine={false}
                        height={60}
                      />
                      <YAxis
                        tick={false} // Hides the ticks
                        domain={[0, Math.max(...chartData.map((d) => d.value)) * 1.1]} // Add extra space above bars
                        axisLine={false} // Hides the axis line
                        tickLine={false} // Hides the tick line
                        width={0}
                      />
                      <Tooltip content={CustomTooltip} cursor={false} />
                      <Bar
                        dataKey="value"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 4, 4]}
                        
                        style={{ cursor: "pointer" }}
                        onMouseEnter={(data, index) => {
                          // This empty function overrides the default hover behavior
                        }}
                        onMouseLeave={(data, index) => {
                          // This empty function overrides the default hover behavior
                        }}
                      >
                        <LabelList
                          dataKey="costAdjusted"
                          position="top"
                          fill="hsl(var(--foreground))"
                          formatter={(value: any) => `${value} credits`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-muted-foreground text-start">
                  <CheckCircle2 className="inline-block w-4 h-4 mr-1" />
                  Feel free to bias the feature(s) you want to use the most.
                </p>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {BIAS_LABELS.map((label, index) => (
                    <Button
                      key={label}
                      variant={selectedBias === index ? "default" : "outline"}
                      onClick={() => setSelectedBias(index)}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PresetVisualCard

