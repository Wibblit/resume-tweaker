"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setQuestions, setFormData } from "@/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, HelpCircle, Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";


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
  const [loading, setLoading] = useState<boolean>(false)

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setLocalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { toast } = useToast()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLocalFormData((prev) => ({ ...prev, resume: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    const numberOfQuestions = Math.floor(formData.duration / 2); // Assuming 2 minutes per question
    try {
      const response = await fetch("/api/generate-questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job: formData.job,
          position: formData.position,
          companyName: formData.companyName,
          jd: formData.jd,
          numberOfQuestions,
          interviewType: formData.interviewType,
        }),
      });
      if (!response.ok) {
        toast({
          description: "Unable to join the interview. Please try again.",
          title: "error",
          variant: "destructive",
        });
        setLoading(false)
      }
      const data = await response.json();
      dispatch(setQuestions(data.questions ? data.questions : []));
      dispatch(setFormData(formData));
      router.push(`/ai-interview/interview`);
      setLoading(false)
    } catch (error) {
      console.error("Error generating questions:", error);
      toast({
        description: "Unable to join the interview. Please try again.",
        title: "error",
        variant : "destructive"
      });
      setLoading(false)
    }
  };

  return (
    <Card className="max-w-2xl mx-auto bg-card text-card-foreground">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Interview Setup</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="job" className="text-foreground">
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
            <Label htmlFor="position" className="text-foreground">
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
            <Label htmlFor="companyName" className="text-foreground">
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
            <Label htmlFor="resume" className="text-foreground">
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
              >
                <Upload className="mr-2 h-4 w-4" /> Upload Resume
              </Button>
              <span className="text-sm text-muted-foreground">
                {formData.resume ? formData.resume.name : "No file chosen"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="jd" className="text-foreground">
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
            <Label htmlFor="duration" className="text-foreground">
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
            <Label htmlFor="interviewer" className="text-foreground">
              Interviewer Name
            </Label>
            <Input
              id="interviewer"
              name="interviewer"
              placeholder="e.g. John Doe"
              onChange={handleInputChange}
              required
              className="bg-background text-foreground"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label className="text-foreground">Interview Type</Label>
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
          >
            {loading ? (
              <div className="flex">
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
  );
}