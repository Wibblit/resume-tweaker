"use client";

import React, { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { UpdateProfileData, updateProfileImage } from "@/slices/profileSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  CreditCard,
  Loader,
  Save,
  Plus,
  Trash2,
  Loader2,
  History,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumeData, SkillCategory, Skill, URL } from "@/types/types";
import { RichInput } from "@/components/TextEditor";
import { CustomDatePicker } from "@/components/DatePicker";
import Base64Image from "@/components/base64toPhoto";
import { ErrorToastHandler } from "@/components/ErrorToastHandler";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { PaymentHistoryModal } from "./payment-history-model";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
// import { getPaymentStatus } from "@/actions/payments/getPaymentStatus";

export default function Profile({ profData }: { profData: ResumeData }) {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("personal");
  const [credits, setCredits] = useState({ current: 50, max: 10000 });
  const [isCreditsLoading, setIsCreditsLoading] = useState<boolean>(true);
  const [isChanged, setIsChanged] = useState(false);
  const [initialData, setInitialData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isImageChanged, setIsImageChanged] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isDeleteURL, setisDeleteURL] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (Object.keys(profData).length === 0) {
        toast({
          title: `Warning`,
          description: "No profile data saved",
        });
      } else {
        dispatch(UpdateProfileData(profData));
        setInitialData(profData);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []); // Run once on mount by leaving the dependency array empty

  useEffect(() => {
    const hasChanges =
      JSON.stringify(initialData) !== JSON.stringify(profileData);
    setIsChanged(hasChanges);
    console.log("Changes detected:", hasChanges);
  }, [profileData]);

  useEffect(() => {
    const fetchCredits = async () => {
      setIsCreditsLoading(true);
      try {
        // const paymentId = searchParams.get("payment_id");
        // console.log("searcheParams, paymentId", searchParams, paymentId)
        // if (paymentId) {
        //   const response = await getPaymentStatus(paymentId);
        // }
        const response = await fetch(`/api/get-credits`);
        if (response.status === 429) {
          toast({
            title: "Whoa there! You've hit the rate limit.",
            description: "Please slow down and try again in a few minutes.",
            variant: "destructive",
          });
          return;
        }
        const data = await response.json();
        console.log(data);
        setCredits((prev) => ({ ...prev, current: data?.Credits?.credits }));
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsCreditsLoading(false);
      }
    };

    fetchCredits();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log("Iam  in here");
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setIsChanged(true);
      setIsImageChanged(true);
    }
  };

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

  const DeleteProfilePicture = async () => {
    if (profileData.basics && profileData.basics[0].picture) {
      setisDeleteURL(profileData.basics[0].picture);
      setIsDelete(true);
    }

    dispatch(updateProfileImage(undefined));
    setImageFile(null);

    setImagePreview(null);
    setIsChanged(true);
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
      let updatedProfileData = JSON.parse(JSON.stringify(profileData));
      if (!imageFile && !isDelete) {
        toast({
          title: "Error",
          description: "Cannot find the image",
          variant: "destructive",
        });
        return;
      }
      if (isImageChanged) {
        const formData = new FormData();
        //@ts-ignore
        formData.append("file", imageFile);
        if (profileData.basics) {
          let prev = profileData.basics[0].picture;
          const response = await axios.post("/api/profile-file-ops", formData);
          if (updatedProfileData.basics)
            updatedProfileData.basics[0].picture = response?.data?.url;
          console.log(updatedProfileData);
          dispatch(updateProfileImage(response?.data?.url));
          if (prev) {
            await axios.delete(
              `/api/profile-file-ops?file=${encodeURIComponent(prev)}`
            );
          }
        }
        setIsImageChanged(false);
        setImageFile(null);
        setImagePreview(null);
      }

      if (isDelete && isDeleteURL) {
        await axios.delete(
          `/api/profile-file-ops?file=${encodeURIComponent(isDeleteURL)}`
        );
      }

      //@ts-ignore
      const result = await updateProfiles(updatedProfileData);
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
        });
      } else {
        console.error(result.message);
        toast({
          title: "Error",
          description: "Failed to save profile.",
          variant: "destructive",
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
                  {isImageChanged && imagePreview ? (
                    <div className="inline-block relative my-2">
                      <Trash2
                        onClick={DeleteProfilePicture}
                        className="w-4 h-4 text-red-500 -right-4 absolute -top-2 cursor-pointer"
                      />
                      <img
                        src={imagePreview ?? undefined}
                        alt="Preview"
                        width={128}
                        height={128}
                      />
                    </div>
                  ) : profileData.basics?.[0]?.picture ? (
                    <div className="inline-block relative my-2">
                      <Trash2
                        onClick={DeleteProfilePicture}
                        className="w-4 h-4 text-red-500 -right-4 absolute -top-2 cursor-pointer"
                      />
                      <img
                        src={profileData.basics[0].picture}
                        width={128}
                        height={128}
                        alt="Profile Picture"
                      />
                    </div>
                  ) : null}

                  <Input
                    id={`${field}-${entry.id}`}
                    onChange={handleFileChange}
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
  return (
    <div className="max-w-7xl mx-auto w-full p-2">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {isCreditsLoading ? (
        <Skeleton className="h-[200px] w-full" />
      ) : (
        <>
          <Card className="w-full">
            <div className="flex items-center justify-between p-6">
              <CardHeader className="p-0">
                <CardTitle className="text-2xl font-bold">Credits</CardTitle>
                <CardDescription>Your current credit balance</CardDescription>
              </CardHeader>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsModalOpen(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <History className="h-5 w-5" />
                <span className="sr-only">View payment history</span>
              </Button>
            </div>

            <CardContent className="pb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">{credits.current}</span>
                  <span className="text-lg text-muted-foreground">
                    credits available
                  </span>
                </div>
                <Link href="/pricing" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Buy Credits
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          <PaymentHistoryModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        </>
      )}
      {isLoading ? (
        <div className="container mx-auto space-y-4">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[150px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      ) : (
        <div className="my-5">
          <div className="flex justify-between items-center mb-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              {/* <div className="flex flex-wrap gap-4 justify-between items-center">
                <TabsList>
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                </TabsList>
                <Button
                  onClick={handleSaveChanges}
                  disabled={!isChanged || isSaving}
                  className="bg-primary w-full md:w-auto text-primary-foreground hover:bg-primary/90"
                >
                  {isSaving ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1 h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div> */}
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <TabsList className="w-full sm:w-auto flex justify-center sm:justify-start">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="professional">Professional</TabsTrigger>
                  <TabsTrigger value="additional">Additional</TabsTrigger>
                </TabsList>
                <Button
                  onClick={handleSaveChanges}
                  disabled={!isChanged || isSaving}
                  className="bg-primary w-full sm:w-auto text-primary-foreground hover:bg-primary/90 flex items-center justify-center"
                >
                  {isSaving ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-1 h-4 w-4" />
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
      )}
    </div>
  );
}
