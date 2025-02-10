"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { ResumeData } from "@/types/types";
import React from "react";
import { CustomDatePicker } from "../DatePicker";

interface EducationExperienceProps {
  updateFormData: (data: Partial<ResumeData>) => void;
  formData: ResumeData;
}

export default function EducationExperience({
  updateFormData,
  formData,
}: EducationExperienceProps): JSX.Element {
  const education = formData.education || [];
  const experience = formData.experience || [];

  const addEducation = (): void => {
    updateFormData({
      education: [
        ...education,
        {
          institution: "",
          degree: "",
          field: "",
          specialization: "",
          startDate: "",
          endDate: "",
          score: "",
        },
      ],
    });
  };

  const updateEducation = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    updateFormData({ education: updatedEducation });
  };

  const removeEducation = (index: number): void => {
    updateFormData({ education: education.filter((_, i) => i !== index) });
  };

  const addExperience = (): void => {
    updateFormData({
      experience: [
        ...experience,
        {
          organization: "",
          role: "",
          startDate: "",
          endDate: "",
          location: "",
          summary: "",
        },
      ],
    });
  };

  const updateExperience = (
    index: number,
    field: string,
    value: string
  ): void => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    updateFormData({ experience: updatedExperience });
  };

  const removeExperience = (index: number): void => {
    updateFormData({ experience: experience.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {education.map((edu, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={edu.institution}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(index, "institution", e.target.value)
                }
                placeholder="Institution"
              />
              <Input
                value={edu.degree}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(index, "degree", e.target.value)
                }
                placeholder="Degree"
              />
              <Input
                value={edu.field}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(index, "field", e.target.value)
                }
                placeholder="Field of Study"
              />
              <Input
                value={edu.specialization}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(index, "specialization", e.target.value)
                }
                placeholder="Specialization"
              />
              <div className="flex flex-col gap-y-2">
                <Label className="py-1">Start Date</Label>
                <CustomDatePicker
                  date={edu.startDate === "Present" ? new Date(1970, 0, 1) : edu.startDate ? new Date(edu.startDate) : undefined}
                  onSelect={(date) =>
                    updateEducation(
                      index,
                      "startDate",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="py-1">End Date</Label>
                <CustomDatePicker
                  date={edu.endDate === "Present" ? new Date(1970, 0, 1) : edu.endDate ? new Date(edu.endDate) : undefined}
                  onSelect={(date) =>
                    updateEducation(
                      index,
                      "endDate",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <Input
                value={edu.score}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateEducation(index, "score", e.target.value)
                }
                placeholder="Score/Grade"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEducation(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addEducation} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Education
        </Button>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Experience</h2>
        {experience.map((exp, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={exp.organization}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateExperience(index, "organization", e.target.value)
                }
                placeholder="Organization"
              />
              <Input
                value={exp.role}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateExperience(index, "role", e.target.value)
                }
                placeholder="Role"
              />
              <div className="flex flex-col gap-y-2">
                <Label className="py-1">Start Date</Label>
                <CustomDatePicker
                  date={exp.startDate ? new Date(1970, 0, 1) : exp.startDate ? new Date(exp.startDate) : undefined}
                  onSelect={(date) =>
                    updateExperience(
                      index,
                      "startDate",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <Label className="py-1">End Date</Label>
                <CustomDatePicker
                  date={exp.endDate === "Present" ? new Date(1970, 0, 1) : exp.endDate ? new Date(exp.endDate) : undefined}
                  onSelect={(date) =>
                    updateExperience(
                      index,
                      "endDate",
                      date
                        ? date.getTime() === new Date(1970, 0, 1).getTime()
                          ? "Present"
                          : date.toISOString()
                        : ""
                    )
                  }
                />
              </div>
              <Input
                value={exp.location}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateExperience(index, "location", e.target.value)
                }
                placeholder="Location"
              />
              <Textarea
                value={exp.summary}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateExperience(index, "summary", e.target.value)
                }
                placeholder="Summary of responsibilities and achievements"
                className="md:col-span-2"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExperience(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addExperience} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Experience
        </Button>
      </div>
    </div>
  );
}
