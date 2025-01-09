"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  ChevronLeft,
  Save,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import BasicInfo from "@/components/onboarding/BasicInfo";
import SummaryProfiles from "@/components/onboarding/SummaryProfiles";
import SkillsProjects from "@/components/onboarding/SkillsProjects";
import EducationExperience from "@/components/onboarding/EducationExperience";
import AdditionalInfo from "@/components/onboarding/AdditionalInfo";
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
import ThemeAwareLogo from "./ThemeAwareLogo";

const steps = [
  { title: "Basic Info", description: "Personal details" },
  { title: "Summary & Profiles", description: "Professional overview" },
  { title: "Skills & Projects", description: "Technical expertise" },
  { title: "Education & Experience", description: "Academic & work history" },
  { title: "Additional Info", description: "Extra qualifications" },
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
        return (
          <BasicInfo updateFormData={updateFormData} formData={formData} />
        );
      case 1:
        return (
          <SummaryProfiles
            updateFormData={updateFormData}
            formData={formData}
          />
        );
      case 2:
        return (
          <SkillsProjects updateFormData={updateFormData} formData={formData} />
        );
      case 3:
        return (
          <EducationExperience
            updateFormData={updateFormData}
            formData={formData}
          />
        );
      case 4:
        return (
          <AdditionalInfo updateFormData={updateFormData} formData={formData} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            {/* <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-gradient-x">
              Resume Tweaker
            </h1> */}
            <h1 className="flex justify-center items-center w-full">
              <ThemeAwareLogo />
            </h1>
            <p className="text-muted-foreground">
              Complete your professional profile in {steps.length} simple steps
            </p>
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>
                {Math.round((currentStep + 1) * (100 / steps.length))}%
              </span>
            </div>
            <Progress
              value={(currentStep + 1) * (100 / steps.length)}
              className="h-2 transition-all duration-500"
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between items-center gap-2 overflow-x-auto py-4 px-2 scrollbar-hide">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`flex flex-col items-center min-w-[120px] transition-all duration-300
                  ${
                    index === currentStep
                      ? "scale-105"
                      : index < currentStep
                      ? "opacity-70"
                      : "opacity-50"
                  }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2
                    ${
                      index === currentStep
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/20"
                        : index < currentStep
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                >
                  {index < currentStep ? "✓" : index + 1}
                </div>
                <span className="text-sm font-medium text-nowrap">{step.title}</span>
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </span>
              </div>
            ))}
          </div>

          {/* Form Content */}
          <Card className="border shadow-lg bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 gap-4">
            <Button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              variant="outline"
              className="w-[120px] transition-all duration-300 hover:translate-x-[-4px]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="hidden sm:flex"
              >
                Skip
              </Button>
              <Button
                onClick={handleReset}
                variant="destructive"
                className="hidden sm:flex"
              >
                Reset
              </Button>
              <Button
                onClick={handleNext}
                disabled={isSaving}
                className="w-[160px] transition-all duration-300 hover:translate-x-[4px]"
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
                        Complete
                      </>
                    )}
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
