"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { UpdateProfileData } from "@/slices/profileSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { updateProfiles } from "@/actions/updateProfile";
import { CreditCard, Loader, Save, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeData, SkillCategory, Skill, URL } from "@/types/types";
import { RichInput } from "@/components/TextEditor";
import { CustomDatePicker } from "@/components/DatePicker";
import Base64Image from "@/components/base64toPhoto";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("personal");
  const [credits, setCredits] = useState({ current: 50, max: 100 });
  const [isChanged, setIsChanged] = useState(false);
  const [initialData, setInitialData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});

  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileResponse] = await Promise.all([
          fetch("/api/get-profile"),
          // fetch("/api/get-credits"),
        ]);
        if (profileResponse.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        const profileData = await profileResponse.json();
        // const creditsData = await creditsResponse.json();

        console.log(profileData.profileData);
        dispatch(UpdateProfileData(profileData.profileData));
        setInitialData(profileData.profileData);
        // setCredits(creditsData.credits);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Run once on mount by leaving the dependency array empty

  useEffect(() => {
    const hasChanges =
      JSON.stringify(initialData) !== JSON.stringify(profileData);
    setIsChanged(hasChanges);
    console.log("Changes detected:", hasChanges);
  }, [profileData]);

  const resumeSections = [
    {
      id: "basics",
      fields: [
        "name",
        "email",
        "phone",
        "location",
        "headLine",
        "url",
        "picture",
      ],
    },
    { id: "summary", fields: ["content"] },
    { id: "profiles", fields: ["url"] },
    { id: "skills", fields: ["name", "skills"] },
    {
      id: "projects",
      fields: ["url", "name", "summary", "startDate", "endDate", "keywords"],
    },
    {
      id: "education",
      fields: [
        "institution",
        "degree",
        "field",
        "specialization",
        "startDate",
        "endDate",
        "score",
      ],
    },
    {
      id: "experience",
      fields: [
        "organization",
        "role",
        "startDate",
        "endDate",
        "location",
        "summary",
      ],
    },
    { id: "languages", fields: ["name", "level"] },
    {
      id: "volunteer",
      fields: ["organization", "role", "location", "startDate", "endDate"],
    },
    { id: "awards", fields: ["title", "awarder", "date", "summary"] },
    {
      id: "publications",
      fields: ["name", "publisher", "publishedIn", "url", "date"],
    },
    { id: "certifications", fields: ["name", "issuer", "date", "url"] },
    { id: "references", fields: ["name", "phone", "email"] },
  ];

  const createEmptyEntry = (section: keyof ResumeData) => {
    const newEntry: any = { id: Date.now().toString() };
    const sectionFields =
      resumeSections.find((s) => s.id === section)?.fields || [];
    sectionFields.forEach((field) => {
      if (field === "url") {
        newEntry[field] = { href: "", label: "" };
      } else if (field === "skills" && section === "skills") {
        newEntry[field] = [];
      } else {
        newEntry[field] = "";
      }
    });
    return newEntry;
  };

  const addEntry = (section: keyof ResumeData) => {
    const updatedProfileData = { ...profileData };
    updatedProfileData[section] = [
      ...updatedProfileData[section]!,
      createEmptyEntry(section),
    ];
    dispatch(UpdateProfileData(updatedProfileData));
  };

  const updateEntry = (
    section: keyof ResumeData,
    id: string,
    field: string,
    value: any
  ) => {
    const updatedProfileData = { ...profileData };
    updatedProfileData[section] = updatedProfileData[section]?.map(
      (entry: any) => (entry.id === id ? { ...entry, [field]: value } : entry)
    );
    dispatch(UpdateProfileData(updatedProfileData));
  };


const DeleteProfilePicture = () => {
  // Clone `basics[0]` to make it mutable
  const updatedProfileData = {
    ...profileData,
    basics:
      profileData.basics && profileData.basics.length
        ? [
            { ...profileData.basics[0], picture: "" }, // Update the picture property
            ...profileData.basics.slice(1), // Keep the rest of the basics intact
          ]
        : [], // Fallback to an empty array if `basics` is undefined or empty
  };

  console.log(updatedProfileData);

  // Dispatch the updated resume data only if basics exist
  if (updatedProfileData.basics.length > 0) {
    dispatch(UpdateProfileData(updatedProfileData));
  }
};



  const deleteEntry = (section: keyof ResumeData, id: string) => {
    const updatedProfileData = { ...profileData };
    //@ts-ignore
    updatedProfileData[section] = updatedProfileData[section].filter(
      (entry: any) => entry.id !== id
    );
    dispatch(UpdateProfileData(updatedProfileData));
  };

  const addSkill = (entryId: string) => {
    const updatedProfileData = { ...profileData };
    updatedProfileData.skills = updatedProfileData.skills?.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          skills: [...entry.skills, { name: "", level: "" }],
        };
      }
      return entry;
    });
    dispatch(UpdateProfileData(updatedProfileData));
  };

  const deleteSkill = (entryId: string, skillIndex: number) => {
    const updatedProfileData = { ...profileData };
    updatedProfileData.skills = updatedProfileData.skills?.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          skills: entry.skills.filter((_, index) => index !== skillIndex),
        };
      }
      return entry;
    });
    dispatch(UpdateProfileData(updatedProfileData));
  };

  const validateUrl = (url: string) => {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" +
        "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
        "((\\d{1,3}\\.){3}\\d{1,3}))" +
        "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
        "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
        "(\\#[-a-zA-Z\\d_]*)?$",
      "i"
    );
    return !!pattern.test(url);
  };

  const handleUrlChange = (
    section: keyof ResumeData,
    id: string,
    field: string,
    value: string
  ) => {
    const errorKey = `${section}-${id}-${field}`;
    if (value && !validateUrl(value)) {
      setUrlErrors((prev) => ({
        ...prev,
        [errorKey]: "Please enter a valid URL",
      }));
    } else {
      setUrlErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }

    updateEntry(section, id, field, { href: value, label: "" });
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      //@ts-ignore
      const result = await updateProfiles(profileData);
       if (result.status === 429) {
         toast({
           title: "Whoa there! You've hit the rate limit.",
           description: "Please slow down and try again in a few minutes.",
           variant: "destructive",
         });
         return;
       }
      if (result.success) {
        setInitialData(profileData);
        setIsChanged(false);
        console.log(result.message);
        toast({
          title: "Success",
          description: "Profile has been saved successfully.",
        })
      } else {
        console.error(result.message);
        toast({
          title: "Error",
          description: "Failed to save profile.",
          variant : "destructive"
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
       toast({
         title: "Error",
         description: "Failed to save profile.",
         variant: "destructive",
       });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradeCredits = () => {
    console.log("Upgrading credits");
    // Implement credit upgrade logic here
  };

  const renderEntryFields = (
    section: keyof ResumeData,
    entry: any,
    index: number
  ) => {
    const fields = resumeSections.find((s) => s.id === section)?.fields || [];
    return (
      <div key={entry.id} className="mb-8">
        {section !== "skills" && (
          <h3 className="text-lg font-semibold mb-4">
            {section.charAt(0).toUpperCase() + section.slice(1)} {index + 1}
          </h3>
        )}
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <Label htmlFor={`${field}-${entry.id}`}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              {field === "summary" || field === "content" ? (
                <RichInput
                  content={entry[field] || ""}
                  section={section}
                  onContentChange={(value) =>
                    updateEntry(section, entry.id, field, value)
                  }
                />
              ) : field === "keywords" ? (
                <Input
                  id={`${field}-${entry.id}`}
                  value={(entry[field] || []).join(", ")}
                  onChange={(e) =>
                    updateEntry(
                      section,
                      entry.id,
                      field,
                      e.target.value.split(",").map((item) => item.trim())
                    )
                  }
                  placeholder={`Enter ${field} (comma-separated)`}
                />
              ) : field === "url" ? (
                <div className="space-y-2">
                  <Input
                    id={`${field}-href-${entry.id}`}
                    value={(entry[field] as URL)?.href || ""}
                    onChange={(e) =>
                      handleUrlChange(section, entry.id, field, e.target.value)
                    }
                    placeholder="Enter URL"
                    type="url"
                  />
                  {urlErrors[`${section}-${entry.id}-${field}`] && (
                    <p className="text-sm text-red-500">
                      {urlErrors[`${section}-${entry.id}-${field}`]}
                    </p>
                  )}
                  <Input
                    id={`${field}-label-${entry.id}`}
                    value={(entry[field] as URL)?.label || ""}
                    onChange={(e) =>
                      updateEntry(section, entry.id, field, {
                        ...(entry[field] as URL),
                        label: e.target.value,
                      })
                    }
                    placeholder="Enter label"
                  />
                </div>
              ) : field === "picture" ? (
                <div className="flex-col items-center justify-center">
                  {profileData?.basics && profileData?.basics[0]?.picture && (
                          <div className="inline-block relative my-2">
                            <Trash2 onClick={DeleteProfilePicture} className="w-4 h-4 text-red-500 -right-4 absolute -top-2 cursor-pointer" />
                      <Base64Image
                        base64String={profileData?.basics[0]?.picture}
                        width={150}
                        height={150}
                        alt={profileData?.basics[0].name}
                      />
                    </div>
                  )}
                  <Input
                    id={`${field}-${entry.id}`}
                    // onChange={(e) => {
                    //   const file = e.target.files?.[0];
                    //   if (file) {
                    //     updateEntry(section, entry.id, field, file);
                    //   }
                    // }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          const base64String = reader.result as string;
                          updateEntry(section, entry.id, field, base64String); // Pass base64 string
                        };
                        reader.readAsDataURL(file); // This will encode the file as base64
                      }
                    }}
                    type="file"
                    accept="image/*"
                  />
                </div>
              ) : field === "startDate" ||
                field === "endDate" ||
                field === "date" ? (
                <CustomDatePicker
                  date={entry[field] ? new Date(entry[field]) : undefined}
                  onSelect={(date) =>
                    updateEntry(
                      section,
                      entry.id,
                      field,
                      date ? date.toISOString() : ""
                    )
                  }
                />
              ) : field === "level" ? (
                <Select
                  onValueChange={(value) =>
                    updateEntry(section, entry.id, field, value)
                  }
                  defaultValue={entry[field] || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Beginner", "Intermediate", "Advanced", "Native"].map(
                      (level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              ) : field === "skills" && section === "skills" ? (
                <div className="space-y-4">
                  {(entry.skills || []).map(
                    (skill: Skill, skillIndex: number) => (
                      <div
                        key={skillIndex}
                        className="flex items-center space-x-2 mb-2"
                      >
                        <Input
                          value={skill.name}
                          onChange={(e) => {
                            const updatedSkills = [...entry.skills];
                            updatedSkills[skillIndex] = {
                              ...updatedSkills[skillIndex],
                              name: e.target.value,
                            };
                            updateEntry(
                              section,
                              entry.id,
                              "skills",
                              updatedSkills
                            );
                          }}
                          placeholder="Skill name"
                        />
                        <Select
                          onValueChange={(value) => {
                            const updatedSkills = [...entry.skills];
                            updatedSkills[skillIndex] = {
                              ...updatedSkills[skillIndex],
                              level: value,
                            };
                            updateEntry(
                              section,
                              entry.id,
                              "skills",
                              updatedSkills
                            );
                          }}
                          defaultValue={skill.level}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {["Beginner", "Intermediate", "Advanced"].map(
                              (level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSkill(entry.id, skillIndex)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(entry.id)}
                    className="w-full"
                  >
                    Add Skill
                  </Button>
                </div>
              ) : (
                <Input
                  id={`${field}-${entry.id}`}
                  value={entry[field] || ""}
                  onChange={(e) =>
                    updateEntry(section, entry.id, field, e.target.value)
                  }
                  placeholder={`Enter ${field}`}
                />
              )}
            </div>
          ))}
          {section !== "basics" && section !== "summary" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteEntry(section, entry.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
        </div>
      </div>
    );
  };

  const renderSection = (section: keyof ResumeData, title: string) => (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {profileData[section]?.map((entry: any, index: number) =>
            renderEntryFields(section, entry, index)
          )}
          {section !== "basics" && section !== "summary" && (
            <Button onClick={() => addEntry(section)}>
              Add {title.slice(0, -1)}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[150px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress
            value={(credits.current / credits.max) * 100}
            className="mb-2"
          />
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {credits.current} / {credits.max} credits
            </p>
          </div>
          <Button
            onClick={handleUpgradeCredits}
            variant="outline"
            size="sm"
            className="mt-4 py-4 px-6 dark:bg-white dark:text-black text-white bg-black"
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Upgrade
          </Button>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>
            <Button
              onClick={handleSaveChanges}
              disabled={!isChanged || isSaving}
              className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90 py-1"
            >
              {isSaving ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto mt-4">
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileData.basics?.map((basic, index) =>
                    renderEntryFields("basics", basic, index)
                  )}
                </CardContent>
              </Card>

              {renderSection("profiles", "Profiles")}
            </TabsContent>

            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  {profileData.summary?.map((sum, index) =>
                    renderEntryFields("summary", sum, index)
                  )}
                </CardContent>
              </Card>

              {renderSection("skills", "Skills")}
              {renderSection("experience", "Experience")}
              {renderSection("education", "Education")}
            </TabsContent>

            <TabsContent value="additional">
              {renderSection("projects", "Projects")}
              {renderSection("languages", "Languages")}
              {renderSection("volunteer", "Volunteer Experience")}
              {renderSection("awards", "Awards")}
              {renderSection("publications", "Publications")}
              {renderSection("certifications", "Certifications")}
              {renderSection("references", "References")}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}