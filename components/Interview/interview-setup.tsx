"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { setQuestions, setFormData } from "@/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, HelpCircle, Loader2, Briefcase, Building, User, FileText, Clock, UserCheck } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { createWorker } from 'tesseract.js';
import { Progress } from "@/components/ui/progress";
import pdfToImages from "@/lib/pdfToImages";
import Tesseract from "tesseract.js";
import * as tts from '@diffusionstudio/vits-web';

interface FormData {
  job: string;
  position: string;
  companyName: string;
  resume: File | null;
  jd: string;
  duration: number;
  interviewer: string;
  interviewType: "comprehensive" | "adaptive";
}

export default function InterviewSetup() {
  const router = useRouter();
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const [formData, setLocalFormData] = useState<FormData>({
    job: "",
    position: "",
    companyName: "",
    resume: null,
    jd: "",
    duration: 10,
    interviewer: "",
    interviewType: "comprehensive",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [resumeText, setResumeText] = useState("");
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);
  const [ttsModelDownloaded, setTtsModelDownloaded] = useState(false);
  const [ttsDownloadProgress, setTtsDownloadProgress] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    async function initWorker() {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            setOcrProgress(message.progress);
            console.log(message.progress === 1 ? "Done" : message.status);
          }
        },
      });
    }
    initWorker();

    async function checkStoredModels() {
      const storedModels = await tts.stored();
      if (storedModels.includes('en_US-hfc_female-medium')) {
        console.log('Already have the model')
        setTtsModelDownloaded(true);
      } else {
        downloadTtsModel();
      }
    }
    checkStoredModels();

    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  async function downloadTtsModel() {
    try {
      await tts.download('en_US-hfc_female-medium', (progress) => {
        setTtsDownloadProgress(Math.round(progress.loaded * 100 / progress.total));
      });
      setTtsModelDownloaded(true);
    } catch (error) {
      console.error('Error downloading TTS model:', error);
      toast({
        description: "Failed to download the text-to-speech model. Some features may not work properly.",
        title: "Warning",
        variant: "destructive",
      });
    }
  }

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const uploadedFile = e.target.files[0];
      setLocalFormData((prev) => ({ ...prev, resume: uploadedFile }));

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
        const pdfUrl = URL.createObjectURL(uploadedFile);
        const imageUrls = await pdfToImages(pdfUrl);
        for (let i = 0; i < imageUrls.length; i++) {
          const response = await worker?.recognize(imageUrls[i]);
          ocrText += " " + response?.data.text;
        }
      } else {
        const response = await worker?.recognize(uploadedFile);
        ocrText = response?.data.text || "";
      }

      setResumeText(ocrText);
      setIsOcrInProgress(false);
      setOcrProgress(1);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const numberOfQuestions = Math.floor(formData.duration / 2);
    try {
      const queryParams = new URLSearchParams({
        job: formData.job,
        position: formData.position,
        companyName: formData.companyName,
        jd: formData.jd,
        numberOfQuestions: numberOfQuestions.toString(),
        interviewType: formData.interviewType,
        duration: formData.duration.toString(),
        resumeText: resumeText,
      }).toString();
      dispatch(setFormData(formData));
      router.push(`/ai-interview/interview?${queryParams}`);
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        description: "Unable to join the interview. Please try again.",
        title: "error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-4xl mx-auto bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Interview Setup</CardTitle>
          <CardDescription>Prepare for your AI-powered interview experience</CardDescription>
        </CardHeader>
        <CardContent>
          {!ttsModelDownloaded && (
            <div className="mb-6">
              <Label>Downloading Text-to-Speech Model</Label>
              <Progress value={ttsDownloadProgress} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {ttsDownloadProgress}% complete
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="job" className="text-foreground flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job
                </Label>
                <Input
                  id="job"
                  name="job"
                  placeholder="e.g. Software Engineer"
                  onChange={handleInputChange}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-foreground flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Position
                </Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="e.g. Senior"
                  onChange={handleInputChange}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-foreground flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Company Name
                </Label>
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="e.g. Tech Corp"
                  onChange={handleInputChange}
                  required
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="interviewer" className="text-foreground flex items-center">
                  <UserCheck className="w-4 h-4 mr-2" />
                  Interviewer
                </Label>
                <Input
                  id="interviewer"
                  name="interviewer"
                  placeholder="e.g. HR, Senior Developer"
                  onChange={handleInputChange}
                  required
                  className="bg-background text-foreground"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="resume" className="text-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Upload Resume
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="resume"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  onClick={() => document.getElementById("resume")?.click()}
                  variant="secondary"
                  className="w-full bg-secondary text-secondary-foreground"
                  disabled={isOcrInProgress}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Resume
                </Button>
                <span className="text-sm text-muted-foreground">
                  {formData.resume ? formData.resume.name : "No file chosen"}
                </span>
              </div>
              {isOcrInProgress && (
                <div className="mt-4">
                  <Label>Extracting data from resume...</Label>
                  <Progress value={ocrProgress * 100} className="mt-2" />
                  <p className="text-sm text-muted-foreground mt-1">
                    {(ocrProgress * 100).toFixed(0)}% complete
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="jd" className="text-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Job Description (Optional)
              </Label>
              <Textarea
                id="jd"
                name="jd"
                placeholder="Paste job description here..."
                onChange={handleInputChange}
                className="bg-background text-foreground"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-foreground flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Duration (max 20 mins)
              </Label>
              <Slider
                id="duration"
                min={5}
                max={20}
                step={1}
                value={[formData.duration]}
                onValueChange={(value) =>
                  setLocalFormData((prev) => ({ ...prev, duration: value[0] }))
                }
                className="bg-secondary"
              />
              <span className="text-sm text-muted-foreground">
                {formData.duration} minutes
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label className="text-foreground flex items-center">
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Interview Type
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Comprehensive: A set of predefined questions.</p>
                      <p>Adaptive: Questions adjust based on your answers.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <RadioGroup
                defaultValue={formData.interviewType}
                onValueChange={(value) =>
                  setLocalFormData((prev) => ({
                    ...prev,
                    interviewType: value as "comprehensive" | "adaptive",
                  }))
                }
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="comprehensive" id="comprehensive" />
                  <Label htmlFor="comprehensive">Comprehensive Interview</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adaptive" id="adaptive" />
                  <Label htmlFor="adaptive">Adaptive Flow Interview</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-primary text-primary-foreground"
              disabled={loading || isOcrInProgress || !ttsModelDownloaded}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Starting Interview
                </div>
              ) : (
                "Start Interview"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}