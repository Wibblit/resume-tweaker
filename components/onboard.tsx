"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, Save, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BasicInfo from "./onboarding/BasicInfo";
import SummaryProfiles from "./onboarding/SummaryProfiles";
import SkillsProjects from "./onboarding/SkillsProjects";
import EducationExperience from "./onboarding/EducationExperience";
import AdditionalInfo from "./onboarding/AdditionalInfo";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  UpdateProfileData,
  Reset,
  setFullProfileData,
  updatePartialProfileData,
} from "@/slices/profileSlice";
import { ResumeData } from "@/types/types";
import { useRouter } from "next/navigation";
import { updateProfiles } from "@/actions/updateProfile";

const steps: string[] = [
  "Basic Info",
  "Summary & Profiles",
  "Skills & Projects",
  "Education & Experience",
  "Additional Info",
];

export default function Onboarding(): JSX.Element {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const formData = useSelector((state: RootState) => state.profile);
  const router = useRouter();

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSaving(true);
      try {
        console.log("Saving data:", formData);
        dispatch(setFullProfileData(formData));
        await updateProfiles(formData);
        router.push("/home");
      } catch (error) {
        console.error("Error saving profile:", error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = (): void => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleReset = (): void => {
    dispatch(Reset());
  };

  const updateFormData = (newData: Partial<ResumeData>): void => {
    dispatch(updatePartialProfileData(newData as ResumeData));
  };

  const renderStep = (): JSX.Element | null => {
    switch (currentStep) {
      case 0:
        return <BasicInfo updateFormData={updateFormData} formData={formData} />;
      case 1:
        return <SummaryProfiles updateFormData={updateFormData} formData={formData} />;
      case 2:
        return <SkillsProjects updateFormData={updateFormData} formData={formData} />;
      case 3:
        return <EducationExperience updateFormData={updateFormData} formData={formData} />;
      case 4:
        return <AdditionalInfo updateFormData={updateFormData} formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Resume Tweaker</h1>
          <p className="text-muted-foreground">Complete your profile in {steps.length} easy steps</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round((currentStep + 1) * (100 / steps.length))}%</span>
          </div>
          <Progress value={(currentStep + 1) * (100 / steps.length)} className="h-2" />
        </div>

        <div className="flex justify-center gap-2 overflow-x-auto py-2">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${index === currentStep 
                  ? "bg-primary text-primary-foreground" 
                  : index < currentStep 
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
            >
              {step}
            </div>
          ))}
        </div>

        <Card className="border-2">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center pt-4">
          <Button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            variant="outline"
            className="w-[120px]"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleSkip} variant="ghost">
              Skip
            </Button>
            <Button onClick={handleReset} variant="destructive">
              Reset
            </Button>
            <Button 
              onClick={handleNext}
              disabled={isSaving}
              className="w-[160px]"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save & Continue
                    </>
                  )}
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}