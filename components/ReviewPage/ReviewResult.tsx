import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";

import {
  Label as RechartsLabel,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface EvaluationItem {
  category: string;
  score: number;
  comment: string;
}

interface ReviewData {
  evaluation: EvaluationItem[];
  overall_score: number;
  final_recommendation: string;
  overall_comment: string;
}

interface ReviewResultsProps {
  data: ReviewData;
  isStatic?: boolean;
}
const chartConfig: ChartConfig = {
  "Content Quality": {
    label: "Content Quality",
    color: "hsl(var(--chart-1))",
  },
  "ATS Compatibility": {
    label: "ATS Compatibility",
    color: "hsl(var(--chart-2))",
  },
  "Structure & Format": {
    label: "Structure & Format",
    color: "hsl(var(--chart-3))",
  },
  "Impact Statements": {
    label: "Impact Statements",
    color: "hsl(var(--chart-4))",
  },
  "Professional Presentation": {
    label: "Professional Presentation",
    color: "hsl(var(--chart-5))",
  },
};

export default function ReviewResults({
  data,
  isStatic = false,
}: ReviewResultsProps) {
  const chartData = data.evaluation.map((item) => ({
    name: item.category,
    score: item.score,
  }));
  return (
    <div className="p-6 rounded-xl border bg-muted/40">
      {/* Overall Score */}
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full max-w-[250px]"
      >
        <RadialBarChart
          data={chartData}
          endAngle={180}
          innerRadius={80}
          outerRadius={130}
          barSize={10}
        >
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
            <RechartsLabel
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) - 16}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {data.overall_score.toFixed(1)}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 4}
                        className="fill-muted-foreground"
                      >
                        Overall Score
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </PolarRadiusAxis>
          {chartData.map((entry) => (
            <RadialBar
              key={entry.name}
              dataKey="score"
              name={entry.name}
              data={[entry]}
              cornerRadius={5}
              fill={`hsl(var(--chart-${
                Object.keys(chartConfig).indexOf(entry.name) + 1
              }))`}
              className="stroke-transparent stroke-2"
            />
          ))}
        </RadialBarChart>
      </ChartContainer>

      {/* Detailed Scores */}
      <Accordion type="single" collapsible className="w-full">
        {data.evaluation.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              <div className="flex flex-col items-start">
                <span>{item.category}</span>
                <Progress value={item.score * 10} className="w-full mt-2" />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-muted-foreground">{item.comment}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
