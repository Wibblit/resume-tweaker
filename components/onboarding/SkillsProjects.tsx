"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ResumeData, SkillCategory, Skill, Project } from "@/types/types";
import { CustomDatePicker } from "../DatePicker";

interface SkillsProjectsProps {
  updateFormData: (data: Partial<ResumeData>) => void;
  formData: ResumeData;
}

export default function SkillsProjects({
  updateFormData,
  formData,
}: SkillsProjectsProps): JSX.Element {
  const [skills, setSkills] = useState<SkillCategory[]>(formData.skills || []);
  const [projects, setProjects] = useState<Project[]>(formData.projects || []);

  const updateSkills = (newSkills: SkillCategory[]): void => {
    setSkills(newSkills);
    updateFormData({ skills: newSkills });
  };

  const addSkillCategory = (): void => {
    const newCategory: SkillCategory = {
      id: Date.now().toString(),
      name: "",
      skills: [],
    };
    updateSkills([...skills, newCategory]);
  };

  const updateSkillCategory = (
    categoryId: string,
    field: keyof SkillCategory,
    value: string
  ): void => {
    const updatedSkills = skills.map((category) =>
      category.id === categoryId ? { ...category, [field]: value } : category
    );
    updateSkills(updatedSkills);
  };

  const removeSkillCategory = (categoryId: string): void => {
    const updatedSkills = skills.filter(
      (category) => category.id !== categoryId
    );
    updateSkills(updatedSkills);
  };

  const addSkill = (categoryId: string): void => {
    const updatedSkills = skills.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          skills: [...category.skills, { name: "", level: "Beginner" }],
        };
      }
      return category;
    });
    updateSkills(updatedSkills);
  };

  const updateSkill = (
    categoryId: string,
    skillIndex: number,
    field: keyof Skill,
    value: string
  ): void => {
    const updatedSkills = skills.map((category) => {
      if (category.id === categoryId) {
        const updatedSkills = [...category.skills];
        updatedSkills[skillIndex] = {
          ...updatedSkills[skillIndex],
          [field]: value,
        };
        return { ...category, skills: updatedSkills };
      }
      return category;
    });
    updateSkills(updatedSkills);
  };

  const removeSkill = (categoryId: string, skillIndex: number): void => {
    const updatedSkills = skills.map((category) => {
      if (category.id === categoryId) {
        const updatedSkills = category.skills.filter(
          (_, index) => index !== skillIndex
        );
        return { ...category, skills: updatedSkills };
      }
      return category;
    });
    updateSkills(updatedSkills);
  };

  const addProject = (): void => {
    const newProject: Project = {
      name: "",
      summary: "",
      startDate: "",
      endDate: "",
      url: { href: "", label: "" },
      keywords: [],
    };
    setProjects([...projects, newProject]);
    updateFormData({ projects: [...projects, newProject] });
  };

  const updateProject = (
    index: number,
    field: keyof Project | "url.href" | "url.label",
    value: string
  ): void => {
    const updatedProjects = projects.map((project, i) => {
      if (i === index) {
        if (field === "url.href" || field === "url.label") {
          return {
            ...project,
            url: {
              ...project.url,
              [field.split(".")[1]]: value,
            },
          };
        } else if (field === "keywords") {
          return {
            ...project,
            [field]: value.split(",").map((k) => k.trim()),
          };
        } else {
          return {
            ...project,
            [field]: value,
          };
        }
      }
      return project;
    });
    setProjects(updatedProjects);
    updateFormData({ projects: updatedProjects });
  };

  const removeProject = (index: number): void => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    updateFormData({ projects: updatedProjects });
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        {skills.map((category) => (
          <div key={category.id} className="mb-4 p-4 border rounded-md">
            <div className="flex items-center justify-between mb-2">
              <Input
                value={category.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateSkillCategory(category.id, "name", e.target.value)
                }
                placeholder="Skill Category"
                className="w-full mr-2"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkillCategory(category.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              {category.skills.map((skill, skillIndex) => (
                <div
                  key={skillIndex}
                  className="flex items-center space-x-2 mb-2"
                >
                  <Input
                    value={skill.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      updateSkill(
                        category.id,
                        skillIndex,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Skill name"
                  />
                  <Select
                    value={skill.level}
                    onValueChange={(value: string) =>
                      updateSkill(category.id, skillIndex, "level", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Beginner", "Intermediate", "Advanced"].map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeSkill(category.id, skillIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={() => addSkill(category.id)}
                variant="outline"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" /> Add Skill
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={addSkillCategory} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Skill Category
        </Button>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        {projects.map((project, index) => (
          <div key={index} className="mb-4 p-4 border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={project.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "name", e.target.value)
                }
                placeholder="Project Name"
              />
              <Input
                value={project.summary}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "summary", e.target.value)
                }
                placeholder="Project Summary"
              />
              <div className="flex flex-col gap-y-2">
                <Label className="py-1">Start Date</Label>
                <CustomDatePicker
                  date={
                    project.startDate === "Present"
                      ? new Date(1970, 0, 1)
                      : project.startDate
                      ? new Date(project.startDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    updateProject(
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
                  date={
                    project.endDate === "Present"
                      ? new Date(1970, 0, 1)
                      : project.endDate
                      ? new Date(project.endDate)
                      : undefined
                  }
                  onSelect={(date) =>
                    updateProject(
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
                value={project.url.href}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "url.href", e.target.value)
                }
                placeholder="Project URL"
              />
              <Input
                value={project.url.label}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "url.label", e.target.value)
                }
                placeholder="Project URL Label"
              />
              <Input
                value={project.keywords.join(", ")}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  updateProject(index, "keywords", e.target.value)
                }
                placeholder="Keywords (comma-separated)"
                className="md:col-span-2"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeProject(index)}
              className="mt-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button onClick={addProject} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>
    </div>
  );
}
