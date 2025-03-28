"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, X, Save, CheckCircle, Printer } from "lucide-react";
import axios, { CancelTokenSource } from "axios";
import {
  ResumeData,
  ResumeStyles,
  RecentResume as UserResume,
} from "@/types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { creditList } from "@/utils/credits";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { updateCredits } from "@/slices/userAssets";
import { PremiumModal } from "../premium-modal";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { saveResumeData } from "@/actions/saveResumeData";
import ResumeDisplay from "../resumeViewer";
import { initialState } from "@/slices/rightsidebarSlice";
import { DEFAULT_RESUME_STYLES, testresume } from "@/data/reviewData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getPropertyServer,
  updateResumeDataServer,
  processAcceptAllChanges,
} from "@/lib/resumereview/resumeActions";
import AIReviewSetup from "./AIReviewSetup";
import { ContentRenderer, AsyncContentRenderer } from "./ContentRenderer";
import { createResumeWithData } from "@/actions/createResume";
import { updateUsedResumeSlots } from "@/slices/userAssets";

type Issue = {
  name: string;
  severity: string;
};

type Metric = {
  type: string;
  score: number;
  issues: Issue[];
};

type AIReviewResult = {
  selector: string;
  metrics: Metric[];
  correction_logic: string;
  final_output: string;
};

type DataItem = {
  selector: string;
  final_output: string;
};

const PAGE_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

const MM_TO_PX = 3.7795275591;

function processMetrics(suggestions: AIReviewResult[]) {
  if (!suggestions || !suggestions.length) return null;

  const totalIssues = suggestions.reduce((count, suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return count;
    return (
      count +
      suggestion.metrics.reduce((metricCount, metric) => {
        return metricCount + metric.issues.length;
      }, 0)
    );
  }, 0);

  const issuesByType: Record<string, number> = {};
  suggestions.forEach((suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return;
    suggestion.metrics.forEach((metric) => {
      if (!issuesByType[metric.type]) {
        issuesByType[metric.type] = 0;
      }
      issuesByType[metric.type] += metric.issues.length;
    });
  });

  let mostCommonIssueType = "";
  let mostCommonIssueCount = 0;

  Object.entries(issuesByType).forEach(([type, count]) => {
    if (count > mostCommonIssueCount) {
      mostCommonIssueType = type;
      mostCommonIssueCount = count;
    }
  });

  let totalScore = 0;
  let scoreCount = 0;

  suggestions.forEach((suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return;
    suggestion.metrics.forEach((metric) => {
      totalScore += metric.score;
      scoreCount++;
    });
  });

  const averageScore =
    scoreCount > 0 ? (totalScore / scoreCount).toFixed(1) : 0;

  const issuesBySeverity: Record<string, number> = {
    minor: 0,
    moderate: 0,
    major: 0,
  };

  suggestions.forEach((suggestion) => {
    if (!Array.isArray(suggestion.metrics)) return;
    suggestion.metrics.forEach((metric) => {
      metric.issues.forEach((issue) => {
        if (issuesBySeverity[issue.severity] !== undefined) {
          issuesBySeverity[issue.severity]++;
        }
      });
    });
  });

  return {
    totalIssues,
    issuesByType,
    mostCommonIssueType,
    mostCommonIssueCount,
    averageScore,
    issuesBySeverity,
  };
}

function groupIssuesBySection(suggestions: AIReviewResult[]) {
  if (!suggestions || !suggestions.length) return {};

  const groupedIssues: Record<string, AIReviewResult[]> = {};

  suggestions.forEach((suggestion) => {
    let majorSection = suggestion.selector;
    const bracketIndex = majorSection.indexOf("[");
    const parenthesisIndex = majorSection.indexOf("(");
    const dotIndex = majorSection.indexOf(".");

    let cutIndex = majorSection.length;
    if (bracketIndex > -1) cutIndex = Math.min(cutIndex, bracketIndex);
    if (parenthesisIndex > -1) cutIndex = Math.min(cutIndex, parenthesisIndex);
    if (dotIndex > -1) cutIndex = Math.min(cutIndex, dotIndex);

    majorSection = majorSection.substring(0, cutIndex);

    if (!groupedIssues[majorSection]) {
      groupedIssues[majorSection] = [];
    }

    groupedIssues[majorSection].push(suggestion);
  });

  return groupedIssues;
}

export default function AIReview({
  recentResumes,
}: {
  recentResumes: UserResume[];
}) {
  const [aiSuggestions, setAiSuggestions] = useState<AIReviewResult[] | null>(
    null
  );
  const testparseresume = JSON.parse(testresume);
  const [resumeData, setResumeData] = useState(testparseresume);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const credits = useAppSelector((state) => state?.assets?.credits);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);
  const [resumeStyles, setResumeStyles] = useState<ResumeStyles>(initialState);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [resumeID, setResumeID] = useState<string | null>(null);
  const [reviewType, setReviewType] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState("");
  const [openResumeName, setOpenResumeName] = useState(false);
  const [saveAll, setSaveAll] = useState<boolean>(false);
  const usedresumes = useAppSelector((state) => state.assets.usedresumes);
  const totalslot = useAppSelector((state) => state.assets.resumeslot);

  console.log(usedresumes, "Used rewume", totalslot, "total");

  const sentences = [
    "Analyzing your resume",
    "Checking for grammar issues",
    "Evaluating readability",
    "Assessing content repetition",
    "Reviewing overall structure",
    "Building change list",
  ];

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentSentenceIndex(
          (prevIndex) => (prevIndex + 1) % sentences.length
        );
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  console.log(reviewType, "ReviewType");

  const handleFormSubmit = async (formData: {
    resumeOption: "select" | "upload";
    selectedResume: string;
    resumeText: string;
    jd: string;
    reviewType: string;
  }) => {
    console.log(formData.reviewType);
    setResumeID(formData.selectedResume);

    setReviewType(formData.reviewType);
    if (credits < (creditList.get(formData.reviewType) ?? 0)) {
      setOpen(true);
      return;
    }
    setIsLoading(true);
    setAiSuggestions(null);
    setShowResultsDialog(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      const response = await axios.post(
        `/api/get-resume-review`,
        {
          resumeId: formData.selectedResume,
          resumeOption: formData.resumeOption,
          resumeText: formData.resumeText,
          jd: formData.jd,
          reviewType: formData.reviewType,
        },
        {
          cancelToken: source.token,
        }
      );

      if (formData.resumeOption === "upload") {
        setResumeStyles(DEFAULT_RESUME_STYLES);
      } else {
        setResumeData(response?.data?.resume);
        setResumeStyles(response?.data?.styles);
      }

      if (response?.data?.statusCode === 402) {
        return toast({
          variant: "destructive",
          description:
            response?.data.message || "Insufficient credits to proceed.",
          title: "Insufficient credits",
        });
      }

      if (!response.data.output.finalStageResults) {
        toast({
          title: `Error ${response.status}`,
          description: response.data.message,
          variant: "destructive",
        });
      }

      setAiSuggestions(response.data.output.finalStageResults);

      dispatch(
        updateCredits(
          credits -
            ((formData.reviewType === "tailored"
              ? creditList.get("tailored")
              : creditList.get("generic")) ?? 0)
        )
      );
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptAllAndSave = async () => {
    try {
      if (!aiSuggestions || !resumeData) return;

      const data = aiSuggestions.map(({ selector, final_output }) => ({
        selector,
        final_output,
      }));

      const updatedData = await processAcceptAllChanges(resumeData, data);
      setResumeData(updatedData);
      await handleSave({ value: updatedData });
      setAiSuggestions([]);

      toast({
        title: "Success",
        description: "All changes applied and saved successfully.",
      });
    } catch (error) {
      console.error("Error applying changes:", error);
      toast({
        title: "Error",
        description: "Failed to apply some changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveAS = async () => {
    try {
      if (usedresumes >= totalslot) {
        toast({
          title: "Failed",
          description: "No slots avialable",
          variant: "destructive",
        });
        return;
      }

      if (!resumeName) {
        toast({
          title: "Insufficient Data",
          description: "Resume name is empty",
          variant: "destructive",
        });
      }

      const res = await createResumeWithData({
        resumeData: resumeData,
        resumeStyles: resumeStyles,
        resumeName: resumeName,
      });

      setResumeID(res.resumeId);

      if (res.success) {
        dispatch(updateUsedResumeSlots(usedresumes + 1))
        toast({
          title: "Success",
          description: "Resume created successfully.",
        });
      } else {
        toast({
          title: "Failed",
          description: "Failed to create resume",
          variant: "destructive",
        });
      }
      setOpenResumeName(false);

      if (saveAll) {
        await handleAcceptAllAndSave();
        setSaveAll(false);
      }
    } catch (error) {
      toast({
        title: "Failed",
        description: "Failed to create resume",
        variant: "destructive",
      });
    } finally {
      setOpenResumeName(false);
    }
  };

  const handleSave = async (
    { value }: { value?: any } = {
      value: undefined,
    }
  ) => {
    try {
      console.log("The resume id is", resumeID);

      const data = value || resumeData;
      const res = await saveResumeData(
        data,
        undefined,
        resumeID,
        "reviewupdate"
      );

      console.log("Resume ID", data.id);

      if (res.status === 429) {
        toast({
          title: "Rate limit reached",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }

      console.log(res);

      if (res.success) {
        toast({
          title: "Success",
          description: "Resume updated successfully.",
        });
      } else {
        toast({
          title: "Failed",
          description: "Resume update failed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the resume.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteIssue = (selector: string) => {
    if (!aiSuggestions) return;
    setAiSuggestions(
      aiSuggestions.filter((suggestion) => suggestion.selector !== selector)
    );
  };

  const handleAcceptIssue = async (selector: string, finalOutput: string) => {
    if (!aiSuggestions || !resumeData) return;

    try {
      const updatedData = await updateResumeDataServer(
        resumeData,
        selector,
        finalOutput
      );
      setResumeData(updatedData);
      setAiSuggestions(
        aiSuggestions.filter((suggestion) => suggestion.selector !== selector)
      );

      toast({
        title: "Success",
        description: "Changes have been queued. Please save.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to apply changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePrint = () => {
    const pagesHTML = Array.from(document.querySelectorAll("[data-page]"))
      .map((el) => el.outerHTML)
      .join("");

    const styles = Array.from(document.styleSheets)
      .map((sheet) => {
        try {
          return Array.from(sheet.cssRules)
            .map((rule) => rule.cssText)
            .join("\n");
        } catch (e) {
          console.warn("Error accessing stylesheet rules", e);
          return "";
        }
      })
      .join("\n");

    const printStyles = `
      @page {
        size: ${resumeStyles.paperFormat};
        margin: 0;
      }
      @media print {
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        #resume-pages {
          width: ${PAGE_FORMATS[resumeStyles.paperFormat].width * MM_TO_PX}px;
          margin: 0 auto;
        }
        body > *:not(#resume-pages) {
          display: none !important;
        }
      }
    `;

    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);

    const printDoc = printFrame.contentDocument;
    printDoc?.open();
    printDoc?.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${styles}</style>
          <style>${printStyles}</style>
        </head>
        <body>
          <div id="resume-pages">
            ${pagesHTML}
          </div>
        </body>
      </html>
    `);
    printDoc?.close();

    setTimeout(() => {
      printFrame.contentWindow?.print();
      document.body.removeChild(printFrame);
    }, 500);
  };

  const metrics = aiSuggestions ? processMetrics(aiSuggestions) : null;
  const groupedIssues = aiSuggestions
    ? groupIssuesBySection(aiSuggestions)
    : {};

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex h-[calc(100vh-60px)] md:h-[calc(100vh-20px)] w-full items-center justify-center p-4">
        <motion.main
          className="flex-1 max-w-4xl p-4 md:py-12 rounded-xl border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-3xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-3xl font-bold">AI Resume Review</h1>
            </div>
            <AIReviewSetup
              recentResumes={recentResumes}
              onSubmit={handleFormSubmit}
              isLoading={isLoading}
              setResumeData={setResumeData}
              setResumeStyles={setResumeStyles}
            />
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xl"
          >
            <div className="flex flex-col justify-between items-center p-4 bg-card rounded-md shadow-md border min-w-96 min-h-44">
              <motion.div
                key={currentSentenceIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
                className="mt-10"
              >
                <p className="font-medium">{sentences[currentSentenceIndex]}</p>
              </motion.div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (cancelTokenSource) {
                    cancelTokenSource.cancel("Request canceled by the user.");
                  }
                  setIsLoading(false);
                  setShowResultsDialog(false);
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Exit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showResultsDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background"
          >
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background p-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowResultsDialog(false)}
                >
                  <X className="mr-2 h-4 w-4" />
                  Exit
                </Button>
                <h2 className="text-xl font-bold">Resume Analysis Results</h2>
                <div className="flex items-center gap-x-2">
                  <Button onClick={handlePrint} variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print Resume
                  </Button>
                  <Button
                    onClick={() => setOpenResumeName(true)}
                    variant="default"
                    size="sm"
                    disabled={usedresumes === totalslot}
                    className={`${
                      usedresumes === totalslot ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save As
                  </Button>
                  <Button
                    onClick={
                      resumeID
                        ? handleAcceptAllAndSave
                        : () => {
                            setSaveAll(true);
                            setOpenResumeName(true);
                          }
                    }
                    variant="default"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Accept All & Save
                  </Button>
                  <Button
                    onClick={
                      resumeID
                        ? () => handleSave()
                        : () => setOpenResumeName(true)
                    }
                    variant="default"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Metrics */}
              {metrics && (
                <div className="border-b bg-muted/30 p-4">
                  <div className="mx-auto max-w-7xl">
                    <h3 className="mb-4 text-lg font-semibold">
                      Resume Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Total Issues
                          </CardTitle>
                        </CardHeader>

                        <CardContent>
                          <div className="text-2xl font-bold">
                            {metrics.totalIssues}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Average Score
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {metrics.averageScore}/5
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Most Common Issue
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-lg font-bold">
                            {metrics.mostCommonIssueType}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {metrics.mostCommonIssueCount} issues
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium">
                            Issues by Severity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {metrics.issuesBySeverity.major > 0 && (
                              <Badge variant="destructive">
                                {metrics.issuesBySeverity.major} Major
                              </Badge>
                            )}
                            {metrics.issuesBySeverity.moderate > 0 && (
                              <Badge variant="default">
                                {metrics.issuesBySeverity.moderate} Moderate
                              </Badge>
                            )}
                            {metrics.issuesBySeverity.minor > 0 && (
                              <Badge variant="secondary">
                                {metrics.issuesBySeverity.minor} Minor
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              )}

              {/* Two-column layout */}
              <div className="flex flex-1 overflow-hidden">
                {/* Left column - Issues */}
                <div className="w-full md:w-1/2 overflow-auto border-r">
                  <ScrollArea className="h-full">
                    <div className="p-4">
                      <h3 className="mb-4 text-lg font-semibold">Issues</h3>

                      {Object.entries(groupedIssues).map(
                        ([section, issues]) => (
                          <Accordion
                            type="single"
                            collapsible
                            key={section}
                            className="mb-4"
                          >
                            <AccordionItem value={section}>
                              <AccordionTrigger className="px-4 py-2 bg-muted/50 rounded-md">
                                <div className="flex items-center justify-between w-full">
                                  <span className="font-medium capitalize">
                                    {section}
                                  </span>
                                  <Badge variant="outline" className="mx-2">
                                    {issues.length}{" "}
                                    {issues.length === 1 ? "issue" : "issues"}
                                  </Badge>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="pt-2">
                                {issues.map((issue, index) => (
                                  <Accordion
                                    type="single"
                                    collapsible
                                    key={index}
                                    className="mb-2"
                                  >
                                    <AccordionItem
                                      value={`${section}-${index}`}
                                      className="border rounded-md overflow-hidden"
                                    >
                                      <AccordionTrigger className="px-4 py-2 hover:bg-muted/30">
                                        <div className="flex items-center justify-between text-left w-full">
                                          <span className="font-medium text-sm">
                                            {issue.correction_logic}
                                          </span>
                                        </div>
                                      </AccordionTrigger>
                                      <AccordionContent className="bg-muted/10 p-4">
                                        <div className="space-y-4">
                                          {/* Metrics Section */}
                                          {issue.metrics.map(
                                            (metric, metricIndex) => (
                                              <div
                                                key={metricIndex}
                                                className="space-y-2"
                                              >
                                                <div className="flex items-center justify-between">
                                                  <h4 className="font-medium">
                                                    {metric.type}
                                                  </h4>
                                                  <div className="flex items-center gap-2">
                                                    <Progress
                                                      value={metric.score * 20}
                                                      className="w-24"
                                                    />
                                                    <span className="text-sm">
                                                      {metric.score}/5
                                                    </span>
                                                  </div>
                                                </div>

                                                {metric.issues.length > 0 && (
                                                  <div className="space-y-2">
                                                    {metric.issues.map(
                                                      (
                                                        issueItem,
                                                        issueIndex
                                                      ) => (
                                                        <div
                                                          key={issueIndex}
                                                          className="rounded-md bg-muted/30 p-2"
                                                        >
                                                          <div className="flex items-start justify-between">
                                                            <div className="flex flex-wrap items-center gap-2 justify-between">
                                                              <p className="text-sm">
                                                                {issueItem.name}
                                                              </p>
                                                              <Badge
                                                                variant={
                                                                  issueItem.severity ===
                                                                  "major"
                                                                    ? "destructive"
                                                                    : issueItem.severity ===
                                                                      "moderate"
                                                                    ? "default"
                                                                    : "secondary"
                                                                }
                                                                className="mt-1"
                                                              >
                                                                {
                                                                  issueItem.severity
                                                                }
                                                              </Badge>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                )}
                                              </div>
                                            )
                                          )}

                                          {/* Original and Suggested Section */}
                                          <div className="border-t pt-4 mt-4">
                                            <div className="space-y-4">
                                              <div>
                                                <h5 className="text-sm font-medium">
                                                  Original:
                                                </h5>
                                                <div className="mt-1 rounded-md bg-muted/20 p-2">
                                                  <AsyncContentRenderer
                                                    resumeData={resumeData}
                                                    selector={issue.selector}
                                                    dateFormat={
                                                      resumeStyles?.datetype ||
                                                      "MMM yyyy"
                                                    }
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                <h5 className="text-sm font-medium">
                                                  Suggested:
                                                </h5>
                                                <div className="mt-1 rounded-md bg-muted/20 p-2">
                                                  <ContentRenderer
                                                    content={issue.final_output}
                                                    dateFormat={
                                                      resumeStyles?.datetype ||
                                                      "MMM yyyy"
                                                    }
                                                  />
                                                </div>
                                              </div>

                                              <div className="flex justify-end gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleDeleteIssue(
                                                      issue.selector
                                                    )
                                                  }
                                                >
                                                  <X className="mr-1 h-3 w-3" />
                                                  Delete
                                                </Button>
                                                <Button
                                                  variant="default"
                                                  size="sm"
                                                  onClick={() =>
                                                    handleAcceptIssue(
                                                      issue.selector,
                                                      issue.final_output
                                                    )
                                                  }
                                                >
                                                  <CheckCircle className="mr-1 h-3 w-3" />
                                                  Accept
                                                </Button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  </Accordion>
                                ))}
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        )
                      )}

                      {Object.keys(groupedIssues).length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center">
                          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                          <h4 className="text-lg font-medium">
                            No issues found
                          </h4>
                          <p className="text-muted-foreground">
                            Your resume looks great!
                          </p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right column - Resume preview */}
                <div className="hidden md:block md:w-1/2 overflow-auto bg-muted/10">
                  <div className="flex h-full items-center justify-center p-4">
                    <ResumeDisplay
                      resumeData={resumeData}
                      resumeStyle={resumeStyles}
                      templateNumber={resumeStyles.id}
                      key={resumeStyles.id}
                      className="resume-display-container"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={openResumeName} onOpenChange={setOpenResumeName}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Resume</DialogTitle>
            <DialogDescription>
              Enter a name for your new resume. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="resume-name" className="text-right">
                Resume Name
              </Label>
              <Input
                id="resume-name"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                className="col-span-3"
                placeholder="My Professional Resume"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAS} disabled={!resumeName.trim()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <PremiumModal
        credits={
          reviewType === "generic"
            ? creditList.get("generic") ?? 0
            : creditList.get("tailored") ?? 0
        }
        name={reviewType === "generic" ? "Generic Review" : "Tailored Review"}
        onClose={() => setOpen(false)}
        open={open}
      />
    </div>
  );
}
