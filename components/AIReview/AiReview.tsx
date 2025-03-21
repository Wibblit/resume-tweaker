"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import pdfToImages from "@/lib/pdfToImages";
import Tesseract, { createWorker, PSM } from "tesseract.js";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { format, parseISO } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  Loader2,
  Loader,
  X,
  Save,
  CheckCircle,
  Printer
} from "lucide-react";
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
import { useSearchParams } from "next/navigation";
import { creditList } from "@/utils/credits";
import { useAppSelector, useAppDispatch } from "@/hooks/hooks";
import { updateCredits } from "@/slices/userAssets";
import { PremiumModal } from "../premium-modal";
import { Badge } from "../ui/badge";
// import jp from "jsonpath";
import { ScrollArea } from "../ui/scroll-area";
import { saveResumeData } from "@/actions/saveResumeData";
import ResumeDisplay from "../resumeViewer";
import { initialState } from "@/slices/rightsidebarSlice";
import { formatDate } from '@/utils/formatDate';
import { DialogTitle } from "@radix-ui/react-dialog";
import { DEFAULT_RESUME_STYLES, testresume } from "@/data/reviewData";
import { getPropertyServer, updateResumeDataServer, processAcceptAllChanges } from '@/lib/resumereview/resumeActions';
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
interface ContentRendererProps {
  content: any;
  className?: string;
  dateFormat?: string;
}


const PAGE_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

const MM_TO_PX = 3.7795275591;

const getProperty = async (obj: any, selector: string) => {
  return await getPropertyServer(obj, selector);
};

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

  // Count issues by type
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

  // Find most common issue type
  let mostCommonIssueType = "";
  let mostCommonIssueCount = 0;

  Object.entries(issuesByType).forEach(([type, count]) => {
    if (count > mostCommonIssueCount) {
      mostCommonIssueType = type;
      mostCommonIssueCount = count;
    }
  });

  // Calculate average score across all metrics
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

  // Count issues by severity
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
    // Extract the major section from the selector
    let majorSection = suggestion.selector;
    // Find the first occurrence of [, (, or . and use everything before it
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


const ContentRenderer: React.FC<ContentRendererProps> = ({
  content,
  className = "",
  dateFormat = "MMM yyyy"
}) => {
  const isHTML = (str: string): boolean => {
    return /<[a-z][\s\S]*>/i.test(str);
  };

  const isJSONString = (str: string): boolean => {
    try {
      const parsed = JSON.parse(str);
      return typeof parsed === 'object' && parsed !== null;
    } catch {
      return false;
    }
  };

  const formatDateValue = (value: any, format: string) => {
    try {
      if (typeof value !== 'string') {
        return String(value);
      }
      return formatDate(value, format);
    } catch {
      return String(value);
    }
  };

  const shouldFormatDate = (key: string, value: any) => {
    const dateFields = ['startDate', 'endDate', 'date'];
    return dateFields.includes(key) && typeof value === 'string';
  };


  const renderObject = (obj: any, depth = 0): JSX.Element => {
    const entries = Object.entries(obj).filter(([key]) => key !== 'id');

    return (
      <div className={`space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
        {entries.map(([key, value], index) => {
          // Skip rendering if value is null or undefined
          if (value == null) return null;

          const formattedKey = key.replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase());

          return (
            <div key={index} className="flex flex-col">
              <div className="flex items-baseline">
                <span className="text-sm font-medium text-muted-foreground min-w-[120px]">
                  {formattedKey}:
                </span>
                <span className="text-sm ml-2 flex-1">
                  {typeof value === 'object' ? (
                    renderObject(value, depth + 1)
                  ) : (
                    <span className="text-foreground">
                      {shouldFormatDate(key, value)
                        ? (typeof value === 'object' ? String(value) : formatDateValue(value, dateFormat))
                        : String(value)}                    </span>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderArray = (arr: any[]): JSX.Element => {
    return (
      <div className="space-y-4">
        {arr.map((item, index) => (
          <div
            key={index}
            className="relative pl-4 border-l-2 border-primary/50 dark:border-primary/30"
          >
            <div className="absolute -left-1 top-0 h-2 w-2 rounded-full bg-primary"></div>
            {typeof item === 'object' ? renderObject(item) : String(item)}
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (content == null) {
      return <span className="text-muted-foreground italic">No content</span>;
    }

    if (typeof content === 'object') {
      return Array.isArray(content)
        ? renderArray(content)
        : renderObject(content);
    }

    const stringContent = String(content);

    if (isJSONString(stringContent)) {
      const parsed = JSON.parse(stringContent);
      return Array.isArray(parsed)
        ? renderArray(parsed)
        : renderObject(parsed);
    }

    if (isHTML(stringContent)) {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: stringContent }}
          className="prose prose-sm max-w-none dark:prose-invert"
        />
      );
    }

    return <span className="whitespace-pre-wrap">{stringContent}</span>;
  };

  return (
    <div className={`rounded-md p-2 ${className}`}>
      {renderContent()}
    </div>
  );
};

interface AsyncContentRendererProps {
  resumeData: any;
  selector: string;
  className?: string;
  dateFormat?: string;
}

const AsyncContentRenderer = ({
  resumeData,
  selector,
  className,
  dateFormat
}: AsyncContentRendererProps) => {
  const [content, setContent] = useState<any>("Loading...");

  useEffect(() => {
    const fetchContent = async () => {
      if (resumeData) {
        const result = await getPropertyServer(resumeData, selector);
        setContent(result);
      }
    };
    fetchContent();
  }, [resumeData, selector]);

  return (
    <ContentRenderer
      content={content}
      className={className}
      dateFormat={dateFormat}
    />
  );
};


export default function AIReview({
  recentResumes,
}: {
  recentResumes: UserResume[];
}) {
  const searchParams = useSearchParams();
  const [reviewType, setReviewType] = useState(
    searchParams.get("reviewType") ?? "generic"
  );
  const [resumeOption, setResumeOption] = useState<"select" | "upload">(
    "select"
  );
  const loading = useAppSelector((state) => state?.assets?.loading);
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");

  console.log(selectedResume);

  const [aiSuggestions, setAiSuggestions] = useState<AIReviewResult[] | null>(
    null
  );

  console.log(aiSuggestions);
  type DataItem = {
    selector: string;
    final_output: string;
  };

  function extractFinalOutput(data: DataItem[]): DataItem[] {
    return data.map(({ selector, final_output }) => ({
      selector,
      final_output,
    }));
  }

  const testparseresume = JSON.parse(testresume);
  const [resumeData, setResumeData] = useState(testparseresume);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userResumes, setUserResumes] = useState<UserResume[]>();
  const [resuLoading, setresuLoading] = useState<boolean>(false);
  const [funcdisabler, setFuncDisabler] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resumeText, setResumeText] = useState("");
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);
  const dispatch = useAppDispatch();
  const credits = useAppSelector((state) => state?.assets?.credits);
  const [cancelTokenSource, setCancelTokenSource] =
    useState<CancelTokenSource | null>(null);
  const [resumeStyles, setResumeStyles] = useState<ResumeStyles>(initialState);

  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [open, setOpen] = useState<boolean>(false);
  const sentences = [
    "Analyzing your resume",
    "Checking for grammar issues",
    "Evaluating readability",
    "Assessing content repetition",
    "Reviewing overall structure",
    "Building change list",
  ];


  const handleAcceptAllAndSave = async () => {
    try {
      if (!aiSuggestions || !resumeData) return;

      const data = extractFinalOutput(aiSuggestions);
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

  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentSentenceIndex((prevIndex) => (prevIndex + 1) % sentences.length);
      }, 3000); // Change sentence every 3 seconds

      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const onClose = () => {
    setOpen(false);
  };

  const metrics = aiSuggestions ? processMetrics(aiSuggestions) : null;

  // Group issues by major section
  const groupedIssues = aiSuggestions
    ? groupIssuesBySection(aiSuggestions)
    : {};

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

  useEffect(() => {
    setUserResumes(recentResumes);
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const uploadedFile = event.target.files?.[0];
      if (!uploadedFile) return;

      setIsOcrInProgress(true);
      setOcrProgress(0);

      const worker = workerRef.current;
      if (!worker) {
        throw new Error("OCR worker not initialized");
      }

      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      await worker.setParameters({
        tessjs_create_hocr: "1",
        tessedit_pageseg_mode: Tesseract.PSM.AUTO_OSD,
      });

      let ocrText = "";

      if (uploadedFile.type === "application/pdf") {
        setFile(uploadedFile);
        const pdfUrl = URL.createObjectURL(uploadedFile);
        console.log("PDF URL:", pdfUrl);
        const imageUrls = await pdfToImages(pdfUrl);

        for (let i = 0; i < imageUrls.length; i++) {
          const response = await worker.recognize(imageUrls[i]);
          ocrText += " " + response?.data.text;
        }

        // Parse the OCR text
        try {
          const parseResponse = await fetch('/api/parse-resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: ocrText }),
          });

          if (!parseResponse.ok) {
            throw new Error('Failed to parse resume');
          }

          const parsedData = await parseResponse.json();
          console.log('Parsed resume:', parsedData);
          // Set the resume data and styles
          setResumeData(parsedData.resume);
          setResumeStyles(DEFAULT_RESUME_STYLES);
          setResumeText(JSON.stringify(parsedData.resume));
          setIsUploadDialogOpen(false);
          setResumeOption("upload");
        } catch (error) {
          console.error('Error parsing resume:', error);
          toast({
            title: "Error",
            description: "Failed to parse the resume. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "Error",
        description: "Failed to process the file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOcrInProgress(false);
      setOcrProgress(1);
    }
  };

  const handleResumeSelect = (value: string) => {
    if (!resuLoading || funcdisabler) {
      //console.log("Now you called master!!");
      setSelectedResume(value);
      setResumeOption("select");
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (credits < (creditList.get(reviewType) ?? 0)) {
      setOpen(true);
      return;
    }
    setIsLoading(true);
    setAiSuggestions(null);
    setShowResultsDialog(true);

    const source = axios.CancelToken.source();
    setCancelTokenSource(source);

    try {
      //console.log(reviewType);
      const response = await axios.post(
        `/api/get-resume-review`,
        {
          resumeId: selectedResume,
          resumeOption,
          resumeText,
          jd: jd,
          reviewType: reviewType,
        },
        {
          cancelToken: source.token,
        }
      );
      if (resumeOption === "upload") {
        // For uploaded resumes, we already have the data and styles
        setResumeStyles(DEFAULT_RESUME_STYLES);
      } else {
        // For selected resumes, use the response data
        setResumeData(response?.data?.resume);
        setResumeStyles(response?.data?.styles);
      }
      if (response?.data?.statusCode === 402) {
        return toast({
          variant: "destructive", // Set the toast type to error
          description:
            response?.data.message || "Insufficient credits to proceed.", // Use the message from the API
          title: "Insufficient credits",
        });
      }
      // console.log("here!!!!",response.data.review.finalStageResults)

      if (!response.data.output.finalStageResults) {
        toast({
          title: `Error ${response.status}`,
          description: response.data.message,
          variant: "destructive",
        });
      }
      setJd("");
      setAiSuggestions(response.data.output.finalStageResults);
      // setAiSuggestions(parsed);
      dispatch(
        updateCredits(
          credits -
          ((reviewType === "tailored"
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
  const handleDeleteIssue = (selector: string) => {
    if (!aiSuggestions) return;

    const updatedSuggestions = aiSuggestions.filter(
      (suggestion) => suggestion.selector !== selector
    );

    setAiSuggestions(updatedSuggestions);
    console.log(`Deleted issue with selector: ${selector}`);
  };

  const handleSave = async (
    { value }: { value?: any } = { value: undefined }
  ) => {
    console.log("Saved");
    try {
      // console.log(resumeStyles);
      console.log(
        "Attempting to save resume data...",
        resumeData,
        selectedResume
      );
      let data = value ? value : resumeData;
      const res = await saveResumeData(
        data,
        undefined,
        selectedResume,
        "reviewupdate"
      );
      console.log("saveResumeData function:", saveResumeData);

      console.log("Response received:", res);
      if (res.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }
      //console.log("Reusme Update suceess");
      toast({
        title: "Success",
        description: "Resume updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save the resume.",
        variant: "destructive",
      });
    }
  };

  const updateResumeData = async (selector: string, finalOutput: string) => {
    if (!resumeData) return;

    try {
      const updatedData = await updateResumeDataServer(resumeData, selector, finalOutput);
      setResumeData(updatedData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong while updating. Please try again.",
        variant: "destructive",
      });
    }
  };

  // console.log(resumeData, resumeStyles);

  const handleAcceptIssue = (selector: string, finalOutput: string) => {
    if (!aiSuggestions) return;

    const updatedSuggestions = aiSuggestions.filter(
      (suggestion) => suggestion.selector !== selector
    );

    setAiSuggestions(updatedSuggestions);
    updateResumeData(selector, finalOutput);
    toast({
      title: "Success",
      description: "Changes have been queued. Please save.",
    });

    // console.log(
    //   `Accepted issue with selector: ${selector}, final output: ${finalOutput}`
    // );
  };

  // In AiReview.tsx
  const handlePrint = () => {
    const pagesHTML = Array.from(document.querySelectorAll("[data-page]"))
      .map((el) => el.outerHTML)
      .join("");
  
    // Get all styles from document
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
  
    // Print-specific styles
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
        /* Hide all other elements */
        body > *:not(#resume-pages) {
          display: none !important;
        }
      }
    `;
  
    // Create print iframe
    const printFrame = document.createElement("iframe");
    printFrame.style.display = "none";
    document.body.appendChild(printFrame);
  
    // Write content to iframe
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
  
    // Wait for content to load then print
    setTimeout(() => {
      printFrame.contentWindow?.print();
      document.body.removeChild(printFrame);
    }, 500);
  };
  
  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      <div className="flex h-[calc(100vh-60px)] md:h-[calc(100vh-20px)] w-full items-center justify-center p-4">
        <motion.main
          className="flex-1 max-w-4xl p-4 md:py-12 rounded-xl border "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto max-w-3xl">
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
                      <DialogTitle></DialogTitle>
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
                          accept=".pdf"
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
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              ) : (
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
                    "Start Resume Review"
                  )}
                </Button>
              )}
            </form>
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
              {/* Header with exit and save buttons */}
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
                  <Button
                    onClick={handlePrint}
                    variant="outline"
                    size="sm"
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    Print Resume
                  </Button>
                  <Button
                    onClick={handleAcceptAllAndSave}
                    variant="default"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Accept All & Save
                  </Button>
                  <Button
                    onClick={() => handleSave()}
                    variant="default"
                    size="sm"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Metrics row */}
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
                          <div className="text-2xl font-bold">{metrics.averageScore}/5</div>
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
                                          {issue.metrics.map((metric, metricIndex) => (
                                            <div key={metricIndex} className="space-y-2">
                                              <div className="flex items-center justify-between">
                                                <h4 className="font-medium">{metric.type}</h4>
                                                <div className="flex items-center gap-2">
                                                  <Progress value={metric.score * 20} className="w-24" />
                                                  <span className="text-sm">{metric.score}/5</span>
                                                </div>
                                              </div>

                                              {metric.issues.length > 0 && (
                                                <div className="space-y-2">
                                                  {metric.issues.map((issueItem, issueIndex) => (
                                                    <div key={issueIndex} className="rounded-md bg-muted/30 p-2">
                                                      <div className="flex items-start justify-between">
                                                        <div className="flex flex-wrap items-center gap-2 justify-between">
                                                          <p className="text-sm">{issueItem.name}</p>
                                                          <Badge
                                                            variant={
                                                              issueItem.severity === "major"
                                                                ? "destructive"
                                                                : issueItem.severity === "moderate"
                                                                  ? "default"
                                                                  : "secondary"
                                                            }
                                                            className="mt-1"
                                                          >
                                                            {issueItem.severity}
                                                          </Badge>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  ))}
                                                </div>
                                              )}
                                            </div>
                                          ))}

                                          {/* Original and Suggested Section - Shown once at the end */}
                                          <div className="border-t pt-4 mt-4">
                                            <div className="space-y-4">
                                              <div>
                                                <h5 className="text-sm font-medium">Original:</h5>
                                                <div className="mt-1 rounded-md bg-muted/20 p-2">
                                                  <AsyncContentRenderer
                                                    resumeData={resumeData}
                                                    selector={issue.selector}
                                                    dateFormat={resumeStyles?.datetype || "MMM yyyy"}
                                                  />
                                                </div>
                                              </div>

                                              <div>
                                                <h5 className="text-sm font-medium">Suggested:</h5>
                                                <div className="mt-1 rounded-md bg-muted/20 p-2">
                                                  <ContentRenderer
                                                    content={issue.final_output}
                                                    dateFormat={resumeStyles?.datetype || "MMM yyyy"}
                                                  />
                                                </div>
                                              </div>

                                              <div className="flex justify-end gap-2">
                                                <Button
                                                  variant="outline"
                                                  size="sm"
                                                  onClick={() => handleDeleteIssue(issue.selector)}
                                                >
                                                  <X className="mr-1 h-3 w-3" />
                                                  Delete
                                                </Button>
                                                <Button
                                                  variant="default"
                                                  size="sm"
                                                  onClick={() => handleAcceptIssue(issue.selector, issue.final_output)}
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

                {/* Right column - Resume preview (placeholder) */}
                <div className="hidden md:block md:w-1/2 overflow-auto bg-muted/10">
                  <div className="flex h-full items-center justify-center p-4">
                    <ResumeDisplay
                      resumeData={resumeData}
                      resumeStyle={resumeStyles}
                      templateNumber={resumeStyles.id}
                      key={resumeStyles.id}
                      className="resume-display-container"
                    />
                    {/* <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 text-muted-foreground" />
                      <h3 className="mt-4 text-lg font-medium">
                        Resume Preview
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        This area would display a preview of your resume
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PremiumModal
        credits={
          reviewType === "generic"
            ? creditList.get("generic") ?? 0
            : creditList.get("tailored") ?? 0
        }
        name={reviewType === "generic" ? "Generic Review" : "Tailored Review"}
        onClose={onClose}
        open={open}
      />
    </div>
  );
}
