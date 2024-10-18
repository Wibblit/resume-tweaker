"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  updateBasics,
  updateProfileSection,
  updateNestedField,
  addItemToSection,
  removeItemFromSection,
  updateSkillCategory,
  addSkillToCategory,
  removeSkillFromCategory,
  addSkillCategory,
  removeSkillCategory,
  addProfile,
  updateProfile,
  removeProfile,
  setFullProfileData,
} from "@/slices/profileSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppSelector } from "@/hooks/hooks";
import { updateProfiles } from "@/actions/updateProfile";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ResumeData } from "@/slices/profileSlice";

export default function ProfilePage() {
  const profileData : ResumeData  = useAppSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [credits, setCredits] = useState({ current: 12, max: 100 });
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/get-profile");

        const { profileData } = response.data;
        console.log(profileData);

        if (profileData) {
          const parsedData = {
            basics: profileData.basics,
            summary: profileData.summary,
            profiles: profileData.profiles,
            skills: profileData.skills,
            projects: profileData.projects,
            education: profileData.education,
            experience: profileData.experience,
            languages: profileData.languages,
            volunteer: profileData.volunteer,
            awards: profileData.awards,
            publications: profileData.publications,
            certifications: profileData.certifications,
            references: profileData.references,
          };

          dispatch(setFullProfileData(parsedData));
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resume data:", error);
      }
    };

    fetchProfileData();
  }, [dispatch]);

  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [profileData]);

  const handleSaveChanges = async () => {
    console.log(profileData);
    setLoading(true);
    try {
      //@ts-ignore
      const response = await updateProfiles(profileData);
      console.log(response);

      if (response.success) {
        setHasUnsavedChanges(false);
        toast({
          title: "Success",
          description: "Changes updated successfully",
        });
        console.log("Resume data saved successfully");
      } else {
        toast({
          title: "Error",
          description: "Cannot update changes",
          variant: "destructive",
        });
        console.error("Failed to save resume data");
      }
    } catch (error) {
      console.error("Error saving resume data:", error);
    }
    setLoading(false);
  };

  const handleUpdateBasics = (field: string, value: any) => {
    dispatch(updateBasics({ field, value }));
  };

  const handleUpdateNestedField = (
    section: keyof ResumeData,
    index: number,
    field: string,
    value: any
  ) => {
    dispatch(updateNestedField({ section, index, field, value }));
  };

  const handleAddItemToSection = (section: keyof ResumeData, item: any) => {
    dispatch(addItemToSection({ section, item }));
  };

  const handleRemoveItemFromSection = (
    section: keyof ResumeData,
    index: number
  ) => {
    dispatch(removeItemFromSection({ section, index }));
  };

  const handleUpdateSkillCategory = (
    categoryIndex: number,
    field: string,
    value: any
  ) => {
    dispatch(updateSkillCategory({ categoryIndex, field, value }));
  };

  const handleAddSkillToCategory = (categoryIndex: number, skill: any) => {
    dispatch(addSkillToCategory({ categoryIndex, skill }));
  };

  const handleRemoveSkillFromCategory = (
    categoryIndex: number,
    skillIndex: number
  ) => {
    dispatch(removeSkillFromCategory({ categoryIndex, skillIndex }));
  };

  const handleAddSkillCategory = () => {
    dispatch(
      addSkillCategory({ id: Date.now().toString(), name: "", skills: [] })
    );
  };

  const handleRemoveSkillCategory = (categoryIndex: number) => {
    dispatch(removeSkillCategory(categoryIndex));
  };

  const handleAddProfile = () => {
    dispatch(addProfile({ url: { href: "", label: "" } }));
  };

  const handleUpdateProfile = (
    index: number,
    url: { href: string; label: string }
  ) => {
    dispatch(updateProfile({ index, url }));
  };

  const handleRemoveProfile = (index: number) => {
    dispatch(removeProfile(index));
  };

  const tabs = [
    { value: "personal", label: "Personal" },
    { value: "professional", label: "Professional" },
    { value: "additional", label: "Additional" },
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

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

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="w-full h-96" /> {/* A larger skeleton */}
        </div>
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-3 py-1.5 text-sm font-medium"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button
              onClick={handleSaveChanges}
              disabled={!hasUnsavedChanges}
              className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </div>

          <TabsContent value="personal">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profileData.basics[0].name}
                      onChange={(e) =>
                        handleUpdateBasics("name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.basics[0].email}
                      onChange={(e) =>
                        handleUpdateBasics("email", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.basics[0].phone}
                      onChange={(e) =>
                        handleUpdateBasics("phone", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.basics[0].location}
                      onChange={(e) =>
                        handleUpdateBasics("location", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="headLine">Headline</Label>
                    <Input
                      id="headLine"
                      value={profileData.basics[0].headLine}
                      onChange={(e) =>
                        handleUpdateBasics("headLine", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">Website</Label>
                    <Input
                      id="url"
                      value={profileData.basics[0].url.href}
                      onChange={(e) =>
                        handleUpdateBasics("url", {
                          ...profileData.basics[0].url,
                          href: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="picture">Profile Picture</Label>
                    <Input
                      id="picture"
                      type="file"
                      onChange={(e) =>
                        handleUpdateBasics("picture", e.target.files?.[0])
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Profiles</Label>
                    {profileData.profiles.map((profile, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={profile.url.label}
                          onChange={(e) =>
                            handleUpdateProfile(index, {
                              ...profile.url,
                              label: e.target.value,
                            })
                          }
                          placeholder="Profile Label (e.g., LinkedIn, GitHub)"
                        />
                        <Input
                          value={profile.url.href}
                          onChange={(e) =>
                            handleUpdateProfile(index, {
                              ...profile.url,
                              href: e.target.value,
                            })
                          }
                          placeholder="Profile URL"
                        />
                        <Button
                          onClick={() => handleRemoveProfile(index)}
                          variant="destructive"
                          size="sm"
                        >
                          Remove Profile
                        </Button>
                      </div>
                    ))}
                    <Button onClick={handleAddProfile} variant="outline">
                      Add Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="professional">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={profileData.summary[0].content}
                      onChange={(e) =>
                        dispatch(
                          updateProfileSection({
                            section: "summary",
                            data: [{ content: e.target.value }],
                          })
                        )
                      }
                      rows={4}
                    />
                  </div>

                  <div className="space-y-4">
                    <Label>Skills</Label>
                    {profileData.skills[0].categories.map(
                      (category, categoryIndex) => (
                        <div key={category.id} className="space-y-2">
                          <Input
                            value={category.name}
                            onChange={(e) =>
                              handleUpdateSkillCategory(
                                categoryIndex,
                                "name",
                                e.target.value
                              )
                            }
                            placeholder="Category name"
                          />
                          {category.skills.map((skill, skillIndex) => (
                            <div key={skillIndex} className="flex space-x-2">
                              <Input
                                value={skill.name}
                                onChange={(e) => {
                                  const updatedSkills = [...category.skills];
                                  updatedSkills[skillIndex] = {
                                    ...skill,
                                    name: e.target.value,
                                  };
                                  handleUpdateSkillCategory(
                                    categoryIndex,
                                    "skills",
                                    updatedSkills
                                  );
                                }}
                                placeholder="Skill name"
                              />
                              <select
                                value={skill.level}
                                onChange={(e) => {
                                  const updatedSkills = [...category.skills];
                                  updatedSkills[skillIndex] = {
                                    ...skill,
                                    level: e.target.value,
                                  };
                                  handleUpdateSkillCategory(
                                    categoryIndex,
                                    "skills",
                                    updatedSkills
                                  );
                                }}
                                className="border rounded p-2"
                              >
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">
                                  Intermediate
                                </option>
                                <option value="Advanced">Advanced</option>
                              </select>
                              <Button
                                onClick={() =>
                                  handleRemoveSkillFromCategory(
                                    categoryIndex,
                                    skillIndex
                                  )
                                }
                                variant="destructive"
                                size="sm"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                          <Button
                            onClick={() =>
                              handleAddSkillToCategory(categoryIndex, {
                                name: "",
                                level: "Beginner",
                              })
                            }
                            variant="outline"
                            size="sm"
                          >
                            Add Skill
                          </Button>
                          <Button
                            onClick={() =>
                              handleRemoveSkillCategory(categoryIndex)
                            }
                            variant="destructive"
                            size="sm"
                          >
                            Remove Category
                          </Button>
                        </div>
                      )
                    )}
                    <Button onClick={handleAddSkillCategory} variant="outline">
                      Add Skill Category
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Experience</Label>
                    {profileData.experience.map((exp, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={exp.organization}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "experience",
                              index,
                              "organization",
                              e.target.value
                            )
                          }
                          placeholder="Organization"
                        />
                        <Input
                          value={exp.role}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "experience",
                              index,
                              "role",
                              e.target.value
                            )
                          }
                          placeholder="Role"
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={exp.startDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "experience",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="date"
                            value={exp.endDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "experience",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Input
                          value={exp.location}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "experience",
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="Location"
                        />
                        <Textarea
                          value={exp.summary}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "experience",
                              index,
                              "summary",
                              e.target.value
                            )
                          }
                          placeholder="Summary"
                          rows={3}
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("experience", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Experience
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("experience", {
                          organization: "",
                          role: "",
                          startDate: "",
                          endDate: "",
                          location: "",
                          summary: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Experience
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Education</Label>
                    {profileData.education.map((edu, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={edu.institution}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "education",
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                          placeholder="Institution"
                        />
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "education",
                              index,
                              "degree",
                              e.target.value
                            )
                          }
                          placeholder="Degree"
                        />
                        <Input
                          value={edu.field}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "education",
                              index,
                              "field",
                              e.target.value
                            )
                          }
                          placeholder="Field of Study"
                        />
                        <Input
                          value={edu.specialization}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "education",
                              index,
                              "specialization",
                              e.target.value
                            )
                          }
                          placeholder="Specialization"
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={edu.startDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "education",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="date"
                            value={edu.endDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "education",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Input
                          value={edu.score}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "education",
                              index,
                              "score",
                              e.target.value
                            )
                          }
                          placeholder="Score/Grade"
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("education", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Education
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("education", {
                          institution: "",
                          degree: "",
                          field: "",
                          specialization: "",
                          startDate: "",
                          endDate: "",
                          score: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Education
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="additional">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Projects</Label>
                    {profileData.projects.map((project, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={project.name}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "projects",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Project Name"
                        />
                        <Textarea
                          value={project.summary}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "projects",
                              index,
                              "summary",
                              e.target.value
                            )
                          }
                          placeholder="Project Summary"
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={project.startDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "projects",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="date"
                            value={project.endDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "projects",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Input
                          value={project.url.href}
                          onChange={(e) =>
                            handleUpdateNestedField("projects", index, "url", {
                              ...project.url,
                              href: e.target.value,
                            })
                          }
                          placeholder="Project URL"
                        />
                        <Input
                          value={project.keywords.join(", ")}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "projects",
                              index,
                              "keywords",
                              e.target.value.split(", ")
                            )
                          }
                          placeholder="Keywords (comma-separated)"
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("projects", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Project
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("projects", {
                          name: "",
                          summary: "",
                          startDate: "",
                          endDate: "",
                          url: { href: "", label: "" },
                          keywords: [],
                        })
                      }
                      variant="outline"
                    >
                      Add Project
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Languages</Label>
                    {profileData.languages.map((language, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={language.name}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "languages",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Language"
                        />
                        <Input
                          value={language.level}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "languages",
                              index,
                              "level",
                              e.target.value
                            )
                          }
                          placeholder="Proficiency Level"
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("languages", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("languages", {
                          name: "",
                          level: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Language
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Volunteer Experience</Label>
                    {profileData.volunteer.map((vol, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={vol.organization}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "volunteer",
                              index,
                              "organization",
                              e.target.value
                            )
                          }
                          placeholder="Organization"
                        />
                        <Input
                          value={vol.role}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "volunteer",
                              index,
                              "role",
                              e.target.value
                            )
                          }
                          placeholder="Role"
                        />
                        <div className="flex space-x-2">
                          <Input
                            type="date"
                            value={vol.startDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "volunteer",
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                          <Input
                            type="date"
                            value={vol.endDate}
                            onChange={(e) =>
                              handleUpdateNestedField(
                                "volunteer",
                                index,
                                "endDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <Input
                          value={vol.location}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "volunteer",
                              index,
                              "location",
                              e.target.value
                            )
                          }
                          placeholder="Location"
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("volunteer", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Volunteer Experience
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("volunteer", {
                          organization: "",
                          role: "",
                          startDate: "",
                          endDate: "",
                          location: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Volunteer Experience
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Awards</Label>
                    {profileData.awards.map((award, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={award.title}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "awards",
                              index,
                              "title",
                              e.target.value
                            )
                          }
                          placeholder="Award Title"
                        />
                        <Input
                          value={award.awarder}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "awards",
                              index,
                              "awarder",
                              e.target.value
                            )
                          }
                          placeholder="Awarder"
                        />
                        <Input
                          type="date"
                          value={award.date}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "awards",
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                        <Textarea
                          value={award.summary}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "awards",
                              index,
                              "summary",
                              e.target.value
                            )
                          }
                          placeholder="Award Summary"
                          rows={3}
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("awards", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Award
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("awards", {
                          title: "",
                          awarder: "",
                          date: "",
                          summary: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Award
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Publications</Label>
                    {profileData.publications.map((pub, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={pub.name}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "publications",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Publication Name"
                        />
                        <Input
                          value={pub.publisher}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "publications",
                              index,
                              "publisher",
                              e.target.value
                            )
                          }
                          placeholder="Publisher"
                        />
                        <Input
                          value={pub.publishedIn}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "publications",
                              index,
                              "publishedIn",
                              e.target.value
                            )
                          }
                          placeholder="Published In"
                        />
                        <Input
                          value={pub.url.href}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "publications",
                              index,
                              "url",
                              { ...pub.url, href: e.target.value }
                            )
                          }
                          placeholder="URL"
                        />
                        <Input
                          type="date"
                          value={pub.date}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "publications",
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("publications", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Publication
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("publications", {
                          name: "",
                          publisher: "",
                          publishedIn: "",
                          url: { href: "", label: "" },
                          date: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Publication
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>Certifications</Label>
                    {profileData.certifications.map((cert, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={cert.name}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "certifications",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Certification Name"
                        />
                        <Input
                          value={cert.issuer}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "certifications",
                              index,
                              "issuer",
                              e.target.value
                            )
                          }
                          placeholder="Issuer"
                        />
                        <Input
                          type="date"
                          value={cert.date}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "certifications",
                              index,
                              "date",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          value={cert.url.href}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "certifications",
                              index,
                              "url",
                              { ...cert.url, href: e.target.value }
                            )
                          }
                          placeholder="URL"
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("certifications", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Certification
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("certifications", {
                          name: "",
                          issuer: "",
                          date: "",
                          url: { href: "", label: "" },
                        })
                      }
                      variant="outline"
                    >
                      Add Certification
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <Label>References</Label>
                    {profileData.references.map((ref, index) => (
                      <div key={index} className="space-y-2 p-4 border rounded">
                        <Input
                          value={ref.name}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "references",
                              index,
                              "name",
                              e.target.value
                            )
                          }
                          placeholder="Reference Name"
                        />
                        <Input
                          value={ref.phone}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "references",
                              index,
                              "phone",
                              e.target.value
                            )
                          }
                          placeholder="Phone"
                        />
                        <Input
                          value={ref.email}
                          onChange={(e) =>
                            handleUpdateNestedField(
                              "references",
                              index,
                              "email",
                              e.target.value
                            )
                          }
                          placeholder="Email"
                        />
                        <Button
                          onClick={() =>
                            handleRemoveItemFromSection("references", index)
                          }
                          variant="destructive"
                          size="sm"
                        >
                          Remove Reference
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() =>
                        handleAddItemToSection("references", {
                          name: "",
                          phone: "",
                          email: "",
                        })
                      }
                      variant="outline"
                    >
                      Add Reference
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
