"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pdfToImages from "@/lib/pdfToImages";
import Tesseract, { createWorker, PSM } from "tesseract.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Menu, Upload, TrendingUp, Loader2 } from "lucide-react";
import axios from "axios";
import { RecentResume as UserResume } from "@/types/types";
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
import { useToast } from "@/hooks/use-toast";

interface AIReviewCriteria {
  score: number;
  comments: string;
}

interface AIReviewResult {
  criteria: {
    [key: string]: AIReviewCriteria;
  };
}

function RadialChart({
  data,
  chartConfig,
}: {
  data: AIReviewResult;
  chartConfig: ChartConfig;
}) {
  const chartData = Object.entries(data.criteria).map(([key, value]) => ({
    name: key,
    score: value.score,
  }));

  const totalScore = chartData.reduce((sum, item) => sum + item.score, 0);
  const averageScore = totalScore / chartData.length;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Resume Score Overview</CardTitle>
        <CardDescription>AI-generated resume evaluation</CardDescription>
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
                          {averageScore.toFixed(1)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Average Score
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
          {averageScore >= 7 ? "Strong resume" : "Needs improvement"}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on AI analysis of 5 key factors
        </div>
      </CardFooter>
    </Card>
  );
}

export default function AIReview({
  recentResumes,
}: {
  recentResumes: UserResume[];
}) {
  const [reviewType, setReviewType] = useState("generic");
  const [resumeOption, setResumeOption] = useState<"select" | "upload">(
    "select",
  );
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<AIReviewResult | null>(
    null,
  );
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userResumes, setUserResumes] = useState<UserResume[]>();
  const [resuLoading, setresuLoading] = useState<boolean>(false);
  const [funcdisabler, setFuncDisabler] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    async function worker() {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            setOcrProgress(message.progress);
            console.log(message.progress === 1 ? "Done" : message.status);
          }
        },
      });
    }
    worker();
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const chartConfig: ChartConfig = jd
    ? {
        alignment_with_jd_requirements: {
          label: "Alignment",
          color: "hsl(var(--chart-1))",
        },
        completeness_for_jd: {
          label: "Completeness",
          color: "hsl(var(--chart-2))",
        },
        specific_achievements_relevant_to_jd: {
          label: "Achievements",
          color: "hsl(var(--chart-3))",
        },
        keyword_matching: {
          label: "Keywords",
          color: "hsl(var(--chart-4))",
        },
        overall_suitability: {
          label: "Suitability",
          color: "hsl(var(--chart-5))",
        },
      }
    : {
        clarity_and_readability: {
          label: "Clarity",
          color: "hsl(var(--chart-1))",
        },
        completeness: {
          label: "Completeness",
          color: "hsl(var(--chart-2))",
        },
        detail_and_specificity: {
          label: "Detail",
          color: "hsl(var(--chart-3))",
        },
        relevance: {
          label: "Relevance",
          color: "hsl(var(--chart-4))",
        },
        grammar_and_language: {
          label: "Grammar",
          color: "hsl(var(--chart-5))",
        },
      };

  useEffect(() => {
    setUserResumes(recentResumes);
  }, []);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setIsOcrInProgress(true);
    setOcrProgress(0);

    const worker = workerRef.current;
    await worker?.load();
    await worker?.loadLanguage("eng");
    await worker?.initialize("eng");
    await worker?.setParameters({
      tessjs_create_hocr: "1",
      tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
    });

    let ocrText = "";

    if (uploadedFile.type === "application/pdf") {
      setFile(uploadedFile);
      const pdfUrl = URL.createObjectURL(uploadedFile);
      const imageUrls = await pdfToImages(pdfUrl);
      for (let i = 0; i < imageUrls.length; i++) {
        const response = await worker?.recognize(imageUrls[i]);
        ocrText += " " + response?.data.text;
      }
      setIsUploadDialogOpen(false);
      setResumeOption("upload");
    }

    setResumeText(ocrText);
    console.log(ocrText);
    setIsOcrInProgress(false);
    setOcrProgress(1);
  };

  const handleResumeSelect = (value: string) => {
    if (!resuLoading || funcdisabler) {
      console.log("Now you called master!!");
      setSelectedResume(value);
      setResumeOption("select");
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setAiSuggestions(null);
    try {
      const response = await axios.post(`/api/get-resume-review/`, {
        resumeId: selectedResume,
        resumeOption,
        resumeText,
        jd: jd,
        reviewType: reviewType,
      });
      if (!response.data.resumeReview) {
        toast({
          title: `Error ${response.status}`,
          description: response.data.message,
          variant: "destructive",
        });
      }
      setJd("");
      setAiSuggestions(response.data.resumeReview);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <motion.main
        className="flex-1 overflow-auto p-4 md:p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold">AI Resume Review</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="resume-option">Resume Option</Label>
              <RadioGroup
                id="resume-option"
                value={resumeOption}
                onValueChange={(value: "select" | "upload") =>
                  setResumeOption(value)
                }
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="select" id="select-resume" />
                  <Label htmlFor="select-resume">Select Existing Resume</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upload" id="upload-resume" />
                  <Label htmlFor="upload-resume">Upload New Resume</Label>
                </div>
              </RadioGroup>
            </div>
            {resumeOption === "select" ? (
              <div>
                <Label htmlFor="resume-select">Select Resume</Label>
                <Select
                  value={selectedResume}
                  onValueChange={handleResumeSelect}
                >
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Choose a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resuLoading ? (
                      <SelectItem
                        value={"null"}
                        className="flex items-center justify-center"
                      >
                        <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                      </SelectItem>
                    ) : userResumes?.length === 0 ? (
                      <SelectItem value="noresumes">
                        No resumes found
                      </SelectItem>
                    ) : (
                      userResumes?.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          {resume.resumeName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div>
                <Label htmlFor="resume-upload">Upload Your Resume</Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileUpload}
                    className="flex-1"
                    disabled={resumeOption !== "upload" || isOcrInProgress}
                  />
                  <Dialog
                    open={isUploadDialogOpen}
                    onOpenChange={setIsUploadDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        disabled={resumeOption !== "upload" || isOcrInProgress}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <h2 className="text-lg font-semibold mb-4">
                        Upload Resume
                      </h2>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="w-full"
                        disabled={isOcrInProgress}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    File uploaded: {file.name}
                  </p>
                )}
                {isOcrInProgress && (
                  <div className="mt-4">
                    <Label>Extracting data from PDF...</Label>
                    <Progress value={ocrProgress * 100} className="mt-2" />
                    <p className="text-sm text-muted-foreground mt-1">
                      {(ocrProgress * 100).toFixed(0)}% complete
                    </p>
                  </div>
                )}
              </div>
            )}
            <div>
              <Label htmlFor="review-type">Review Type</Label>
              <RadioGroup
                id="review-type"
                value={reviewType}
                onValueChange={setReviewType}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="generic" id="generic" />
                  <Label htmlFor="generic">Generic Review</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tailored" id="tailored" />
                  <Label htmlFor="tailored">Tailored Review</Label>
                </div>
              </RadioGroup>
            </div>
            {reviewType === "tailored" && (
              <div>
                <Label htmlFor="jd">Job Description</Label>
                <Textarea
                  id="jd"
                  placeholder="Paste the job description here for tailored suggestions..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  className="mt-2"
                  required
                />
              </div>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || isOcrInProgress}
            >
              {isLoading ? (
                <div className="flex">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </div>
              ) : (
                "Get AI Suggestions"
              )}
            </Button>
          </form>
          <AnimatePresence>
            {aiSuggestions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 space-y-8"
              >
                <RadialChart data={aiSuggestions} chartConfig={chartConfig} />
                <Card>
                  <CardHeader>
                    <CardTitle>AI Resume Review Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(aiSuggestions.criteria).map(
                        ([criterion, { score, comments }]) => (
                          <Accordion type="single" collapsible key={criterion}>
                            <AccordionItem value={criterion}>
                              <AccordionTrigger>
                                <div className="flex items-center justify-between w-full">
                                  <span className="capitalize">
                                    {criterion.replace(/_/g, " ")}
                                  </span>
                                  <div className="flex items-center gap-2 mr-2">
                                    <Progress
                                      value={score * 10}
                                      className="w-24"
                                    />
                                    <span className="text-sm font-medium">
                                      {score}/10
                                    </span>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <p className="text-sm text-muted-foreground">
                                  {comments}
                                </p>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ),
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
}
