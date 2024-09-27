"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import SidebarContent from "@/components/SideBar";
import { Menu, Plus, Trash } from "lucide-react";
import {
  ResumeData,
  Basics,
  Education,
  Experience,
  Project,
  Skill,
  SkillCategory,
  Summary,
  URL,
} from "@/types/types";
import { DatePicker } from "@/components/DatePicker";

const emptyResumeData: ResumeData = {
  basics: [
    {
      name: "",
      email: "",
      phone: "",
      location: "",
      headLine: "",
      url: { href: "", label: "" },
      picture: undefined,
    },
  ],
  summary: [{ content: "" }],
  profiles: [],
  skills: [{ id:"",categories: [] }],
  projects: [],
  education: [],
  experience: [],
  languages: [],
  volunteer: [],
  awards: [],
  publications: [],
  certifications: [],
  references: [],
};

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResumeData);
  const [credits, setCredits] = useState({ current: 12, max: 100 });

  const handleBasicsChange = (
    field: keyof Basics,
    value: string | File | URL | undefined
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

  const handleSkillChange = (
    categoryIndex: number,
    skillIndex: number,
    value: Partial<Skill>
  ) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skillData, i) => {
        if (i === 0) {
          const updatedCategories = skillData.categories.map(
            (category, cIndex) => {
              if (cIndex === categoryIndex) {
                const updatedSkills = category.skills.map((skill, sIndex) =>
                  sIndex === skillIndex ? { ...skill, ...value } : skill
                );
                return { ...category, skills: updatedSkills };
              }
              return category;
            }
          );
          return { ...skillData, categories: updatedCategories };
        }
        return skillData;
      }),
    }));
  };

  const handleAddSkillCategory = () => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skillData, i) => {
        if (i === 0) {
          return {
            ...skillData,
            categories: [
              ...skillData.categories,
              { id: Date.now().toString(), name: "", skills: [] },
            ],
          };
        }
        return skillData;
      }),
    }));
  };

  const handleAddSkill = (categoryIndex: number) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skillData, i) => {
        if (i === 0) {
          const updatedCategories = skillData.categories.map(
            (category, cIndex) => {
              if (cIndex === categoryIndex) {
                return {
                  ...category,
                  skills: [...category.skills, { name: "", level: "" }],
                };
              }
              return category;
            }
          );
          return { ...skillData, categories: updatedCategories };
        }
        return skillData;
      }),
    }));
  };

  const handleRemoveSkillCategory = (categoryIndex: number) => {
    setResumeData((prevData) => ({
      ...prevData,
      skills: prevData.skills.map((skillData, i) => {
        if (i === 0) {
          return {
            ...skillData,
            categories: skillData.categories.filter(
              (_, index) => index !== categoryIndex
            ),
          };
        }
        return skillData;
      }),
    }));
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      <aside className="hidden w-64 border-r border-border lg:block">
        <SidebarContent />
      </aside>

      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed left-4 top-4 z-40 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      <main className="flex-1 overflow-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-6 text-3xl font-bold">Profile</h1>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Credits</CardTitle>
              <CardDescription>
                Your current credit balance and level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(credits.current / credits.max) * 100}
                className="mb-2"
              />
              <p className="text-sm text-muted-foreground">
                {credits.current} / {credits.max} credits
              </p>
            </CardContent>
            <CardFooter>
              <Button>Upgrade</Button>
            </CardFooter>
          </Card>

          <Tabs defaultValue="personal" className="space-y-4">
            <TabsList>
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="professional">Professional Info</TabsTrigger>
              <TabsTrigger value="education">Education & Skills</TabsTrigger>
              <TabsTrigger value="projects">Projects & Experience</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.basics[0].name}
                        onChange={(e) =>
                          handleBasicsChange("name", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input
                        id="phone"
                        value={resumeData.basics[0].phone}
                        onChange={(e) =>
                          handleBasicsChange("phone", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.basics[0].email}
                        onChange={(e) =>
                          handleBasicsChange("email", e.target.value)
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.basics[0].location}
                        onChange={(e) =>
                          handleBasicsChange("location", e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headLine">Headline</Label>
                    <Input
                      id="headLine"
                      value={resumeData.basics[0].headLine}
                      onChange={(e) =>
                        handleBasicsChange("headLine", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">Website URL</Label>
                    <Input
                      id="url"
                      value={resumeData.basics[0].url.href}
                      onChange={(e) =>
                        handleBasicsChange("url", {
                          href: e.target.value,
                          label: resumeData.basics[0].url.label,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="urlLabel">Website Label</Label>
                    <Input
                      id="urlLabel"
                      value={resumeData.basics[0].url.label}
                      onChange={(e) =>
                        handleBasicsChange("url", {
                          href: resumeData.basics[0].url.href,
                          label: e.target.value,
                        })
                      }
                      placeholder="My Personal Website"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input
                      id="picture"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleBasicsChange("picture", file);
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Update your professional details here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Summary</Label>
                    <Textarea
                      value={resumeData.summary[0]?.content || ""}
                      onChange={(e) =>
                        handleArrayInputChange("summary", 0, {
                          content: e.target.value,
                        })
                      }
                      placeholder="Write a brief summary about yourself"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    {resumeData.skills[0]?.categories.map(
                      (category, categoryIndex) => (
                        <div key={category.id} className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Input
                              value={category.name}
                              onChange={(e) => {
                                const updatedCategory = {
                                  ...category,
                                  name: e.target.value,
                                };
                                handleArrayInputChange("skills", 0, {
                                  categories:
                                    resumeData.skills[0].categories.map(
                                      (c, i) =>
                                        i === categoryIndex
                                          ? updatedCategory
                                          : c
                                    ),
                                });
                              }}
                              placeholder="Category Name"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() =>
                                handleRemoveSkillCategory(categoryIndex)
                              }
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                          {category.skills.map((skill, skillIndex) => (
                            <div
                              key={skillIndex}
                              className="flex items-center space-x-2"
                            >
                              <Input
                                value={skill.name}
                                onChange={(e) =>
                                  handleSkillChange(categoryIndex, skillIndex, {
                                    name: e.target.value,
                                  })
                                }
                                placeholder="Skill Name"
                              />
                              <Input
                                value={skill.level || ""}
                                onChange={(e) =>
                                  handleSkillChange(categoryIndex, skillIndex, {
                                    level: e.target.value,
                                  })
                                }
                                placeholder="Skill Level"
                              />
                              <Button
                                size="icon"
                                variant="outline"
                                onClick={() => {
                                  const updatedSkills = category.skills.filter(
                                    (_, i) => i !== skillIndex
                                  );
                                  const updatedCategory = {
                                    ...category,
                                    skills: updatedSkills,
                                  };
                                  handleArrayInputChange("skills", 0, {
                                    categories:
                                      resumeData.skills[0].categories.map(
                                        (c, i) =>
                                          i === categoryIndex
                                            ? updatedCategory
                                            : c
                                      ),
                                  });
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <Button onClick={() => handleAddSkill(categoryIndex)}>
                            <Plus className="mr-2 h-4 w-4" /> Add Skill
                          </Button>
                        </div>
                      )
                    )}
                    <Button onClick={handleAddSkillCategory}>
                      <Plus className="mr-2 h-4 w-4" /> Add Skill Category
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education">
              <Card>
                <CardHeader>
                  <CardTitle>Education</CardTitle>
                  <CardDescription>
                    Update your educational background
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <Label>Education {index + 1}</Label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Input
                          placeholder="Institution"
                          value={edu.institution}
                          onChange={(e) =>
                            handleArrayInputChange("education", index, {
                              institution: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Degree"
                          value={edu.degree}
                          onChange={(e) =>
                            handleArrayInputChange("education", index, {
                              degree: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Field of Study"
                          value={edu.field}
                          onChange={(e) =>
                            handleArrayInputChange("education", index, {
                              field: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Specialization"
                          value={edu.specialization}
                          onChange={(e) =>
                            handleArrayInputChange("education", index, {
                              specialization: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Score"
                          value={edu.score}
                          onChange={(e) =>
                            handleArrayInputChange("education", index, {
                              score: e.target.value,
                            })
                          }
                        />
                        <DatePicker
                          placeholder="Start Date"
                          date={
                            edu.startDate ? new Date(edu.startDate) : undefined
                          }
                          setDate={(date) =>
                            handleArrayInputChange("education", index, {
                              startDate: date?.toISOString(),
                            })
                          }
                        />
                        <DatePicker
                          placeholder="End Date"
                          date={edu.endDate ? new Date(edu.endDate) : undefined}
                          setDate={(date) =>
                            handleArrayInputChange("education", index, {
                              endDate: date?.toISOString(),
                            })
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleRemoveArrayItem("education", index)
                        }
                      >
                        <Trash className="mr-2 h-4 w-4" /> Remove Education
                      </Button>
                    </div>
                  ))}
                  <Button onClick={() => handleAddArrayItem("education")}>
                    <Plus className="mr-2 h-4 w-4" /> Add Education
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle>Projects & Experience</CardTitle>
                  <CardDescription>
                    Update your projects and work experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Projects</Label>
                    {resumeData.projects.map((project, index) => (
                      <div key={index} className="space-y-2">
                        <Input
                          placeholder="Project Name"
                          value={project.name}
                          onChange={(e) =>
                            handleArrayInputChange("projects", index, {
                              name: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Summary"
                          value={project.summary}
                          onChange={(e) =>
                            handleArrayInputChange("projects", index, {
                              summary: e.target.value,
                            })
                          }
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <DatePicker
                            placeholder="Start Date"
                            date={
                              project.startDate
                                ? new Date(project.startDate)
                                : undefined
                            }
                            setDate={(date) =>
                              handleArrayInputChange("projects", index, {
                                startDate: date?.toISOString(),
                              })
                            }
                          />
                          <DatePicker
                            placeholder="End Date"
                            date={
                              project.endDate
                                ? new Date(project.endDate)
                                : undefined
                            }
                            setDate={(date) =>
                              handleArrayInputChange("projects", index, {
                                endDate: date?.toISOString(),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-url-${index}`}>
                            Project URL
                          </Label>
                          <Input
                            id={`project-url-${index}`}
                            placeholder="Project URL"
                            value={project.url?.href}
                            onChange={(e) =>
                              handleArrayInputChange("projects", index, {
                                url: {
                                  href: e.target.value,
                                  label: project.url?.label || e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`project-url-label-${index}`}>
                            URL Label
                          </Label>
                          <Input
                            id={`project-url-label-${index}`}
                            placeholder="URL Label"
                            value={project.url?.label}
                            onChange={(e) =>
                              handleArrayInputChange("projects", index, {
                                url: {
                                  href: project.url?.href || "",
                                  label: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleRemoveArrayItem("projects", index)
                          }
                        >
                          <Trash className="mr-2 h-4 w-4" /> Remove Project
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => handleAddArrayItem("projects")}>
                      <Plus className="mr-2 h-4 w-4" /> Add Project
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Work Experience</Label>
                    {resumeData.experience.map((exp, index) => (
                      <div key={index} className="space-y-2">
                        <Input
                          placeholder="Organization"
                          value={exp.organization}
                          onChange={(e) =>
                            handleArrayInputChange("experience", index, {
                              organization: e.target.value,
                            })
                          }
                        />
                        <Input
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) =>
                            handleArrayInputChange("experience", index, {
                              role: e.target.value,
                            })
                          }
                        />
                        <Textarea
                          placeholder="Summary"
                          value={exp.summary}
                          onChange={(e) =>
                            handleArrayInputChange("experience", index, {
                              summary: e.target.value,
                            })
                          }
                        />
                        <div className="grid gap-4 md:grid-cols-2">
                          <DatePicker
                            placeholder="Start Date"
                            date={
                              exp.startDate
                                ? new Date(exp.startDate)
                                : undefined
                            }
                            setDate={(date) =>
                              handleArrayInputChange("experience", index, {
                                startDate: date?.toISOString(),
                              })
                            }
                          />
                          <DatePicker
                            placeholder="End Date"
                            date={
                              exp.endDate ? new Date(exp.endDate) : undefined
                            }
                            setDate={(date) =>
                              handleArrayInputChange("experience", index, {
                                endDate: date?.toISOString(),
                              })
                            }
                          />
                        </div>
                        <Input
                          placeholder="Location"
                          value={exp.location}
                          onChange={(e) =>
                            handleArrayInputChange("experience", index, {
                              location: e.target.value,
                            })
                          }
                        />
                        <Button
                          variant="outline"
                          onClick={() =>
                            handleRemoveArrayItem("experience", index)
                          }
                        >
                          <Trash className="mr-2 h-4 w-4" /> Remove Experience
                        </Button>
                      </div>
                    ))}
                    <Button onClick={() => handleAddArrayItem("experience")}>
                      <Plus className="mr-2 h-4 w-4" /> Add Experience
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}