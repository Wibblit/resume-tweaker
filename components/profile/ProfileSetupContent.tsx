"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ResumeData } from "@/types/types";
import { emptyResumeData } from "@/lib/constants";
import PersonalInfoTab from "./PersonalInfoTab";
import ProfessionalInfoTab from "./ProfessionalInfoTab";
import EducationTab from "./EducationTab";
import ProjectsExperienceTab from "./ProjectsExperienceTab";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const sections = [
  { id: "personal", title: "Personal Information", component: PersonalInfoTab },
  {
    id: "professional",
    title: "Professional Information",
    component: ProfessionalInfoTab,
  },
  { id: "education", title: "Education", component: EducationTab },
  {
    id: "projects",
    title: "Projects & Experience",
    component: ProjectsExperienceTab,
  },
];

export default function ProfileSetupContent() {
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [currentSection, setCurrentSection] = useState(0);
  const router = useRouter();

  const handleBasicsChange = (
    field: keyof ResumeData["basics"][0],
    value: any
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      basics: [{ ...prevData.basics[0], [field]: value }],
    }));
  };

  const handleArrayInputChange = <T extends keyof ResumeData>(
    field: T,
    index: number,
    value: Partial<ResumeData[T][number]>
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: prevData[field].map((item, i) =>
        i === index ? { ...item, ...value } : item
      ),
    }));
  };

  const handleAddArrayItem = <T extends keyof ResumeData>(field: T) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: [...prevData[field], {} as ResumeData[T][number]],
    }));
  };

  const handleRemoveArrayItem = <T extends keyof ResumeData>(
    field: T,
    index: number
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      [field]: prevData[field].filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      // Handle form submission
      console.log("Form submitted:", resumeData);
      // You can add your submission logic here
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSkip = () => {
    if (currentSection === sections.length - 1) {
      router.push("/home");
    } else {
      handleNext();
    }
  };

  const CurrentSectionComponent = sections[currentSection].component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>{sections[currentSection].title}</CardTitle>
          <CardDescription>
            Step {currentSection + 1} of {sections.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentSectionComponent
                resumeData={resumeData}
                handleBasicsChange={handleBasicsChange}
                handleArrayInputChange={handleArrayInputChange}
                handleAddArrayItem={handleAddArrayItem}
                handleRemoveArrayItem={handleRemoveArrayItem}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentSection === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button variant="secondary" onClick={handleSkip}>
            Skip for now
          </Button>
          <Button onClick={handleNext}>
            {currentSection === sections.length - 1 ? "Submit" : "Next"}
            {currentSection < sections.length - 1 && (
              <ChevronRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
