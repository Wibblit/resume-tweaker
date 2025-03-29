"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Loader2 } from "lucide-react";
import { RecentResume as UserResume } from "@/types/types";
import Tesseract, { createWorker } from "tesseract.js";
import pdfToImages from "@/lib/pdfToImages";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_RESUME_STYLES } from "@/data/reviewData";

interface AIReviewSetupProps {
  recentResumes: UserResume[];
  onSubmit: (formData: {
    resumeOption: "select" | "upload";
    selectedResume: string;
    resumeText: string;
    jd: string;
    reviewType: string;
  }) => void;
  isLoading: boolean;
  setResumeData: (data: any) => void;
  setResumeStyles: (styles: any) => void;
}

export default function AIReviewSetup({
  recentResumes,
  onSubmit,
  isLoading,
  setResumeData,
  setResumeStyles,
}: AIReviewSetupProps) {
  const searchParams = useSearchParams();
  const [reviewType, setReviewType] = useState(
    searchParams.get("reviewType") ?? "generic"
  );
  const [resumeOption, setResumeOption] = useState<"select" | "upload">("select");
  const [selectedResume, setSelectedResume] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jd, setJd] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [userResumes, setUserResumes] = useState<UserResume[]>();
  const [resuLoading, setresuLoading] = useState<boolean>(false);
  const [funcdisabler, setFuncDisabler] = useState<boolean>(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    async function worker() {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            setOcrProgress(message.progress);
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
  }, [recentResumes]);

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
        const imageUrls = await pdfToImages(pdfUrl);

        for (let i = 0; i < imageUrls.length; i++) {
          const response = await worker.recognize(imageUrls[i]);
          ocrText += " " + response?.data.text;
        }

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
      setSelectedResume(value);
      setResumeOption("select");
      setFile(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Hehe")
    onSubmit({
      resumeOption,
      selectedResume,
      resumeText,
      jd,
      reviewType,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="resume-option">Resume Option</Label>
        <RadioGroup
          id="resume-option"
          value={resumeOption}
          onValueChange={(value: "select" | "upload") => setResumeOption(value)}
          className="mt-2 flex gap-4"
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
          <Select value={selectedResume} onValueChange={handleResumeSelect}>
            <SelectTrigger className="w-full mt-2">
              <SelectValue placeholder="Choose a resume" />
            </SelectTrigger>
            <SelectContent>
              {resuLoading ? (
                <SelectItem value={"null"} className="flex items-center justify-center">
                  <Loader2 className="mr-4 h-4 w-4 animate-spin" />
                </SelectItem>
              ) : userResumes?.length === 0 ? (
                <SelectItem value="noresumes">No resumes found</SelectItem>
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
          <div className="mt-2 flex items-center gap-2">
            <Input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="w-[70%]"
              disabled={resumeOption !== "upload" || isOcrInProgress}
            />

            <Button
              type="button"
              size="icon"
              variant="outline"
              disabled={resumeOption !== "upload" || isOcrInProgress}
              className="flex-1"
              onClick={() => document.getElementById("resume-upload")?.click()}

            >
              <Upload className="h-4 w-4" /> Browse
            </Button>

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
          className="mt-2 flex gap-4"
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
          "Start Resume Review"
        )}
      </Button>
    </form>
  );
}