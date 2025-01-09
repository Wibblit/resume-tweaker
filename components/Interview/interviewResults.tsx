"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EvaluationCriteria {
  category: string;
  score: number;
  comment: string;
  likes: string[];
  dislikes: string[];
}

interface InterviewReport {
  evaluation: EvaluationCriteria[];
  overall_score: number;
  final_recommendation: string;
  overall_comment: string;
  comment_keywords: {
    positive: string[];
    negative: string[];
  };
}

interface InterviewResultsProps {
  data: InterviewReport;
  isStatic?: boolean;
}

const chartConfig: ChartConfig = {
  "Subject Knowledge": {
    label: "Subject",
    color: "hsl(var(--chart-1))",
  },
  "Communication Skills": {
    label: "Communication",
    color: "hsl(var(--chart-2))",
  },
  "Problem-Solving Ability": {
    label: "Problem Solving",
    color: "hsl(var(--chart-3))",
  },
  "Response Structure": {
    label: "Structure",
    color: "hsl(var(--chart-4))",
  },
  "Professionalism and Attitude": {
    label: "Professionalism",
    color: "hsl(var(--chart-5))",
  },
};

const LikesDislikesBox = ({
  title,
  items,
  colorClass,
}: {
  title: string;
  items: string[];
  colorClass: string;
}) => (
  <div
    className={`p-3 rounded-md ${colorClass} border-[0.1px] border-opacity-20`}
  >
    <h4 className="font-medium mb-2">{title}</h4>
    <ul className="list-disc list-inside">
      {items?.map((item, index) => (
        <li key={index} className="text-sm">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default function InterviewResults({
  data,
  isStatic,
}: InterviewResultsProps) {
  const chartData = data.evaluation.map((item) => ({
    name: item.category,
    score: item.score,
  }));

  return (
    <div className="space-y-8">
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Interview Score Overview</CardTitle>
          <CardDescription>AI-generated interview evaluation</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
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
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {data.overall_score >= 7 ? "Strong candidate" : "Needs improvement"}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Based on AI analysis of 5 key factors
          </div>
        </CardFooter>
      </Card>

      {!isStatic && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>AI Interview Review Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.evaluation.map((item) => (
                  <Accordion type="single" collapsible key={item.category}>
                    <AccordionItem value={item.category}>
                      <AccordionTrigger>
                        <div className="flex items-center justify-between w-full">
                          <span className="capitalize">{item.category}</span>
                          <div className="flex items-center gap-2 mr-2">
                            <Progress
                              value={item.score * 10}
                              className="w-24"
                            />
                            <span className="text-sm font-medium">
                              {item.score}/10
                            </span>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-muted-foreground mb-4">
                          {item.comment}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <LikesDislikesBox
                            title="PROs"
                            items={item.likes}
                            colorClass=" "
                          />
                          <LikesDislikesBox
                            title="CONs"
                            items={item.dislikes}
                            colorClass=" "
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Final Decision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-medium mb-4">
                {data.final_recommendation}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                {data.overall_comment}
              </p>
              <div className="space-y-2">
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Positive Keywords:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.comment_keywords.positive.map((keyword, index) => (
                      <Badge key={index}>
                        <span className="mb-[2px]">{keyword}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold mb-2">
                    Areas for Improvement:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {data.comment_keywords.negative.map((keyword, index) => (
                      <Badge
                        key={index}
                        className=" border-opacity-20 flex items-center justify-center"
                      >
                        <span className="mb-[2px]">{keyword}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
