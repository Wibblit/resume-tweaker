"use client";

import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setFormData } from "@/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Upload,
  HelpCircle,
  Loader2,
  Briefcase,
  Building,
  User,
  FileText,
  Clock,
  UserCheck,
  Loader,
} from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { createWorker } from "tesseract.js";
import { Progress } from "@/components/ui/progress";
import pdfToImages from "@/lib/pdfToImages";
import Tesseract from "tesseract.js";
import { useSearchParams } from "next/navigation";
import * as tts from "@diffusionstudio/vits-web";
import { useAppSelector } from "@/hooks/hooks";
import { PremiumModal } from "../premium-modal";
import { creditList } from "@/utils/credits";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecentResume } from "@/types/types";

interface FormData {
  job: string;
  position: string;
  companyName: string;
  resume: File | null;
  jd: string;
  duration: number;
  interviewerPosition: string;
  interviewType: "comprehensive" | "adaptive";
}

export default function InterviewSetup({
  recentResumes,
}: {
  recentResumes: RecentResume[];
}) {
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
    interviewerPosition: "",
    interviewType:
      (searchParams.get("interviewStyle") as "comprehensive" | "adaptive") ??
      "comprehensive",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [resumeText, setResumeText] = useState("");
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);
  const [ttsModelDownloaded, setTtsModelDownloaded] = useState(false);
  const [ttsDownloadProgress, setTtsDownloadProgress] = useState(0);
  const [open, setOpen] = useState<boolean>(false);
  const [resumeOption, setResumeOption] = useState<"select" | "upload">(
    "select"
  );
  const [selectedResume, setSelectedResume] = useState("");
  const [userResumes, setUserResumes] = useState<RecentResume[]>();

  const onClose = () => setOpen(false);
  const { toast } = useToast();

  useEffect(() => {
    setUserResumes(recentResumes);
  }, [recentResumes]);

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
      if (storedModels.includes("en_US-hfc_female-medium")) {
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
      await tts.download("en_US-hfc_female-medium", (progress) => {
        setTtsDownloadProgress(
          Math.round((progress.loaded * 100) / progress.total)
        );
      });
      setTtsModelDownloaded(true);
    } catch (error) {
      console.error("Error downloading TTS model:", error);
      toast({
        description:
          "Failed to download the text-to-speech model. Some features may not work properly.",
        title: "Warning",
        variant: "destructive",
      });
    }
  }

  const loadings = useAppSelector((state) => state?.assets?.loading);
  const credits = useAppSelector((state) => state?.assets?.credits);

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

  const handleResumeSelect = (value: string) => {
    setSelectedResume(value);
    setResumeOption("select");
    setLocalFormData((prev) => ({ ...prev, resume: null }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (credits < (creditList.get(formData.interviewType) ?? 0)) {
      setOpen(true);
      return;
    }

    setLoading(true);
    const numberOfQuestions = Math.ceil(formData.duration / 2);
    const userSelectedResume = userResumes?.find(
      (resume) => resume.resumeName === selectedResume
    );
    console.log("selected resume", JSON.stringify(userSelectedResume));
    try {
      const queryParams = new URLSearchParams({
        job: formData.job,
        position: formData.position,
        companyName: formData.companyName,
        jd: formData.jd,
        numberOfQuestions: numberOfQuestions.toString(),
        interviewType: formData.interviewType,
        duration: formData.duration.toString(),
        resumeText:
          resumeOption === "select"
            ? JSON.stringify(userSelectedResume)
            : resumeText,
        interviewerPosition: formData.interviewerPosition,
        resumeOption,
        selectedResume,
      }).toString();
      dispatch(setFormData(formData));
      router.push(`/home/ai-interview/interview?${queryParams}`);
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
          <CardDescription>
            Prepare for your AI-powered interview experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!ttsModelDownloaded && (
            <div className="mb-6">
              <Label>
                Downloading Text-to-Speech model.{" "}
                <b>This process is done only once.</b>
              </Label>
              <Progress value={ttsDownloadProgress} className="mt-2" />
              <p className="text-sm text-muted-foreground mt-1">
                {ttsDownloadProgress}% complete
              </p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="job"
                  className="text-foreground flex items-center"
                >
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
                <Label
                  htmlFor="position"
                  className="text-foreground flex items-center"
                >
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
                <Label
                  htmlFor="companyName"
                  className="text-foreground flex items-center"
                >
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
                <Label
                  htmlFor="interviewerPosition"
                  className="text-foreground flex items-center"
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Interviewer
                </Label>
                <Input
                  id="interviewerPosition"
                  name="interviewerPosition"
                  placeholder="e.g. HR, Senior Developer"
                  onChange={handleInputChange}
                  required
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-foreground flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Resume
              </Label>
              <RadioGroup
                value={resumeOption}
                onValueChange={(value: "select" | "upload") =>
                  setResumeOption(value)
                }
                className="grid grid-cols-2 gap-4"
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

              {resumeOption === "select" ? (
                <div className="space-y-2">
                  <Select
                    value={selectedResume}
                    onValueChange={handleResumeSelect}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a resume" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadings ? (
                        <SelectItem value="loading" disabled>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading resumes...
                        </SelectItem>
                      ) : userResumes?.length === 0 ? (
                        <SelectItem value="no-resumes" disabled>
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
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Input
                      id="resume"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("resume")?.click()}
                      className="whitespace-nowrap"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Browse
                    </Button>
                  </div>
                  {formData.resume && (
                    <p className="text-sm text-muted-foreground">
                      Selected file: {formData.resume.name}
                    </p>
                  )}
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
              <Label
                htmlFor="duration"
                className="text-foreground flex items-center"
              >
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

            {loadings ? (
              <div className="flex items-center justify-center">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            ) : (
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
            )}
          </form>
        </CardContent>
      </Card>
      <PremiumModal
        onClose={onClose}
        open={open}
        name={
          formData.interviewType === "comprehensive"
            ? "Comprehensive Interview"
            : "Adaptive Interview"
        }
        credits={
          formData.interviewType === "comprehensive"
            ? creditList.get("comprehensive") ?? 0
            : creditList.get("adaptive") ?? 0
        }
      />
    </div>
  );
}
