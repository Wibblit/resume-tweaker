"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Brain,
  CheckCircle2,
  FileText,
  Info,
  MessageSquare,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

// Constants (keep as they were)
const SERVICE_DETAILS = [
  {
    name: "AI-Assist",
    cost: 1,
    icon: Bot,
    description: "AI-powered assistance for job applications",
    color: "text-blue-500 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    name: "Resume Review",
    cost: 10,
    icon: FileText,
    description: "Professional resume review and feedback",
    color: "text-purple-500 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    name: "Comp. Interview",
    cost: 20,
    icon: MessageSquare,
    description: "Comprehensive interview preparation",
    color: "text-pink-500 dark:text-pink-400",
    bgColor: "bg-pink-50 dark:bg-pink-950/30",
    borderColor: "border-pink-200 dark:border-pink-800",
  },
  {
    name: "Adaptive Interview",
    cost: 30,
    icon: Brain,
    description: "AI-driven adaptive interview practice",
    color: "text-teal-500 dark:text-teal-400",
    bgColor: "bg-teal-50 dark:bg-teal-950/30",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
] as const;

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
};
const bundleNames = {
  200: "Starter",
  500: "Essential",
  1000: "Power",
  2000: "Super Saver",
};
const BIAS_LABELS = [
  "AI-Assist",
  "Resume Review",
  "Comp. Interview",
  "Adaptive Interview",
];

const BUNDLE_DESCRIPTIONS = {
  200: "The Starter bundle is perfect for job seekers beginning their career journey. It provides a compact yet impactful credit allocation to access essential tools like AI-powered resume assistance, professional reviews, and mock interviews. Ideal for those testing the waters or preparing for a handful of applications, this bundle ensures you have everything needed to get started with confidence.",
  500: "The Essential bundle offers a balanced credit allocation, making it ideal for candidates with regular job application needs. Whether you're fine-tuning resumes, practicing for interviews, or both, the credits in this bundle allow you to fully utilize the platform's features. It's the go-to choice for those seeking to enhance their preparation while managing multiple opportunities.",
  1000: "The Power bundle is designed for serious job seekers aiming to maximize their chances of success. With a larger credit allocation, it's perfect for tackling numerous applications and preparing for high-stakes interviews. Whether you're targeting competitive roles or applying across industries, the Power bundle ensures you have ample resources to stand out every step of the way.",
  2000: "The Super Saver bundle delivers the highest value, offering a generous credit allocation to support extensive job search efforts. Perfect for ambitious candidates managing high application volumes or preparing for multiple rounds of interviews, this bundle ensures you can make the most of all features without worrying about running out of credits. It's the ultimate choice for thorough preparation at an unbeatable value.",
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload as {
    name: string;
    value: number;
    actualValue: number;
    costAdjusted: number;
    percentage: number;
    serviceCost: number;
  };

  return (
    <Card className="bg-background border p-2 shadow-lg">
      <div className="text-sm space-y-1">
        <p className="font-medium">{data.name}</p>
        <p>Services: {data.actualValue}</p>
        <p>Credits per service: {data.serviceCost}</p>
        <p>Total cost: {data.costAdjusted}</p>
      </div>
    </Card>
  );
};

function ServicesTable() {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-medium">Service</TableHead>
            <TableHead className="w-[25%] font-medium text-right">Credits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {SERVICE_DETAILS.map((service) => {
            const Icon = service.icon;
            return (
              <TableRow key={service.name} className="group hover:bg-muted/50">
                <TableCell>
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg", service.bgColor)}>
                      <Icon className={cn("h-5 w-5", service.color)} />
                    </div>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {service.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end space-y-1">
                    <span className="font-medium text-lg">
                      {service.cost}{" "}
                      <span className="text-sm text-muted-foreground">
                        per use
                      </span>{" "}
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
function PresetVisualCard() {
  const [selectedBundle, setSelectedBundle] =
    useState<keyof typeof PRESET_ALLOCATIONS>(200);
  const [selectedBias, setSelectedBias] = useState(0);

  const chartData = useMemo(() => {
    const currentAllocation = PRESET_ALLOCATIONS[selectedBundle][selectedBias];
    const costAdjustedValues = currentAllocation.map(
      (value, index) => value * SERVICE_DETAILS[index].cost
    );
    const total = costAdjustedValues.reduce((sum, val) => sum + val, 0);

    return currentAllocation.map((value, index) => ({
      name: SERVICE_DETAILS[index].name,
      value: costAdjustedValues[index],
      actualValue: value,
      costAdjusted: costAdjustedValues[index],
      percentage: (costAdjustedValues[index] / total) * 100,
      serviceCost: SERVICE_DETAILS[index].cost,
    }));
  }, [selectedBundle, selectedBias]);

  return (
    <Card id="features" className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl font-bold">
          What You Get With Each Bundle
        </CardTitle>
        <CardDescription className="text-muted-foreground text-start">
          Our credit bundles are designed to give you flexibility. Use your
          credits across different features based on your needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 lg:flex lg:space-x-6 lg:space-y-0">
          <div className="lg:w-2/3 space-y-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {Object.keys(PRESET_ALLOCATIONS).map((bundle) => (
                <Button
                  key={bundle}
                  variant={
                    selectedBundle === Number(bundle) ? "default" : "outline"
                  }
                  onClick={() =>
                    setSelectedBundle(Number(bundle) as 200 | 500 | 1000 | 2000)
                  }
                  className="min-w-[100px]"
                >
                  {bundle} Credits
                </Button>
              ))}
            </div>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center lg:hidden">
                  <div>
                    <CardTitle className="text-xl">
                      {bundleNames[selectedBundle]} bundle
                    </CardTitle>
                    <CardDescription>
                      {selectedBundle} Credits (C)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        <linearGradient
                          id="pieGradient0"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(220, 70%, 50%)"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(220, 70%, 30%)"
                            stopOpacity={0.9}
                          />
                        </linearGradient>
                        <linearGradient
                          id="pieGradient1"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(280, 65%, 60%)"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(280, 65%, 40%)"
                            stopOpacity={0.9}
                          />
                        </linearGradient>
                        <linearGradient
                          id="pieGradient2"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(340, 75%, 55%)"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(340, 75%, 35%)"
                            stopOpacity={0.9}
                          />
                        </linearGradient>
                        <linearGradient
                          id="pieGradient3"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="hsl(160, 60%, 45%)"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="hsl(160, 60%, 25%)"
                            stopOpacity={0.9}
                          />
                        </linearGradient>
                      </defs>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        innerRadius={60}
                        dataKey="value"
                        label={({ value }) => `${value} Credits`}
                        stroke="hsl(var(--background))"
                        strokeWidth={1}
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#pieGradient${index})`}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={CustomTooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center mt-4 text-sm text-muted-foreground">
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Info className="w-4 h-4 mr-1 inline-block" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Click the buttons below to see different credit
                          allocations
                        </p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                  Feel free to bias the feature(s) you want to use the most.
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {BIAS_LABELS.map((label, index) => (
                    <Button
                      key={label}
                      variant={selectedBias === index ? "default" : "outline"}
                      onClick={() => setSelectedBias(index)}
                      className="sm:text-base sm:px-4 sm:py-2 sm:h-10 text-xs px-2 py-1 h-auto"
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:w-1/3 bg-card">
            <CardContent className="pt-6">
              <div className="hidden lg:block mb-4">
                <CardTitle className="text-xl">
                  {bundleNames[selectedBundle]} bundle
                </CardTitle>
                <CardDescription>{selectedBundle} Credits (C)</CardDescription>
              </div>
              <p className="text-muted-foreground mb-4">
                {BUNDLE_DESCRIPTIONS[selectedBundle]}
              </p>
              <ServicesTable />
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}

export default PresetVisualCard;
