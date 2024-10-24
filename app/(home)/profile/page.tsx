// "use client";

// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { UpdateProfileData } from "@/slices/profileSlice";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { updateProfiles } from "@/actions/updateProfile";
// import { CreditCard, Loader, Save } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// // Assuming ResumeData type is imported or defined elsewhere
// import type { ResumeData } from "@/types/types";

// export default function Component() {
//   const dispatch = useDispatch();
//   const profileData = useSelector(
//     (state: { profile: ResumeData }) => state.profile
//   );
//   const [activeTab, setActiveTab] = useState("personal");
//   const [credits, setCredits] = useState({ current: 50, max: 100 });
//   const [isChanged, setIsChanged] = useState(false);
//   const [initialData, setInitialData] = useState<ResumeData | null>(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isLoadingProfile, setIsLoadingProfile] = useState(true);
//   const [isLoadingCredits, setIsLoadingCredits] = useState(true);

//   useEffect(() => {
//     const fetchProfileData = async () => {
//       try {
//         const response = await fetch("/api/get-profile");
//         const data = await response.json();
//         dispatch(UpdateProfileData(data.profileData));
//         setInitialData(data.profileData);
//       } catch (error) {
//         console.error("Error fetching profile data:", error);
//       } finally {
//         setIsLoadingProfile(false);
//       }
//     };

//     const fetchCredits = async () => {
//       try {
//         const response = await fetch("/api/get-credits");
//         const data = await response.json();
//         setCredits(data.credits);
//       } catch (error) {
//         console.error("Error fetching credits:", error);
//       } finally {
//         setIsLoadingCredits(false);
//       }
//     };

//     fetchProfileData();
//     fetchCredits();
//   }, [dispatch]);

//   useEffect(() => {
//     if (initialData) {
//       setIsChanged(JSON.stringify(initialData) !== JSON.stringify(profileData));
//     }
//   }, [profileData, initialData]);

//   const handleUpdateField = (
//     section: keyof ResumeData,
//     index: number,
//     field: string,
//     value: any
//   ) => {
//     const updatedData = JSON.parse(JSON.stringify(profileData));
//     if (field.includes(".")) {
//       const [parentField, childField] = field.split(".");
//       updatedData[section][index] = {
//         ...updatedData[section][index],
//         [parentField]: {
//           ...updatedData[section][index][parentField],
//           [childField]: value,
//         },
//       };
//     } else {
//       updatedData[section][index] = {
//         ...updatedData[section][index],
//         [field]: value,
//       };
//     }
//     dispatch(UpdateProfileData(updatedData));
//   };

//   const handleAddItem = (section: keyof ResumeData) => {
//     const updatedData = JSON.parse(JSON.stringify(profileData));
//     updatedData[section].push({});
//     dispatch(UpdateProfileData(updatedData));
//   };

//   const handleRemoveItem = (section: keyof ResumeData, index: number) => {
//     const updatedData = JSON.parse(JSON.stringify(profileData));
//     updatedData[section].splice(index, 1);
//     dispatch(UpdateProfileData(updatedData));
//   };

//   const handleSaveChanges = async () => {
//     setIsSaving(true);
//     try {
//       const result = await updateProfiles(profileData);
//       if (result.success) {
//         setInitialData(profileData);
//         setIsChanged(false);
//         console.log(result.message);
//       } else {
//         console.error(result.message);
//       }
//     } catch (error) {
//       console.error("Error saving profile:", error);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleUpgradeCredits = () => {
//     console.log("Upgrading credits");
//   };

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-3xl font-bold mb-6">Profile</h1>

//       <Card className="mb-6">
//         <CardHeader>
//           <CardTitle>Credits</CardTitle>
//         </CardHeader>
//         <CardContent>
//           {isLoadingCredits ? (
//             <div className="space-y-2">
//               <Skeleton className="h-4 w-full" />
//               <Skeleton className="h-4 w-3/4" />
//             </div>
//           ) : (
//             <>
//               <Progress
//                 value={(credits.current / credits.max) * 100}
//                 className="mb-2"
//               />
//               <div className="flex justify-between items-center">
//                 <p className="text-sm text-muted-foreground">
//                   {credits.current} / {credits.max} credits
//                 </p>
//                 <Button
//                   onClick={handleUpgradeCredits}
//                   variant="outline"
//                   size="sm"
//                 >
//                   <CreditCard className="mr-2 h-4 w-4" />
//                   Upgrade
//                 </Button>
//               </div>
//             </>
//           )}
//         </CardContent>
//       </Card>

//       <div className="flex justify-between items-center mb-4">
//         <Tabs
//           value={activeTab}
//           onValueChange={setActiveTab}
//           className="flex-grow"
//         >
//           <div className="flex justify-between items-center">
//             <TabsList>
//               <TabsTrigger value="personal">Personal</TabsTrigger>
//               <TabsTrigger value="professional">Professional</TabsTrigger>
//               <TabsTrigger value="additional">Additional</TabsTrigger>
//             </TabsList>
//             <Button
//               onClick={handleSaveChanges}
//               disabled={!isChanged || isSaving}
//               className="ml-4 bg-primary text-primary-foreground hover:bg-primary/90 py-1"
//             >
//               {isSaving ? (
//                 <Loader className="mr-2 h-4 w-4 animate-spin" />
//               ) : (
//                 <Save className="mr-2 h-4 w-4" />
//               )}
//               {isSaving ? "Saving..." : "Save Changes"}
//             </Button>
//           </div>

//           <ScrollArea className="h-[calc(100vh-300px)] overflow-y-auto">
//             {isLoadingProfile ? (
//               <div className="space-y-4">
//                 <Skeleton className="h-[200px] w-full" />
//                 <Skeleton className="h-[150px] w-full" />
//                 <Skeleton className="h-[300px] w-full" />
//               </div>
//             ) : (
//               <>
//                 <TabsContent value="personal">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Personal Information</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.basics.map((basic, index) => (
//                           <div key={index} className="space-y-2">
//                             <Input
//                               value={basic.name}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "basics",
//                                   index,
//                                   "name",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Name"
//                             />
//                             <Input
//                               value={basic.email}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "basics",
//                                   index,
//                                   "email",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Email"
//                               type="email"
//                             />
//                             <Input
//                               value={basic.phone}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "basics",
//                                   index,
//                                   "phone",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Phone"
//                             />
//                             <Input
//                               value={basic.location}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "basics",
//                                   index,
//                                   "location",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Location"
//                             />
//                             <Input
//                               value={basic.headLine}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "basics",
//                                   index,
//                                   "headLine",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Headline"
//                             />
//                             <Input
//                               value={basic.url?.href}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "basics",
//                                   index,
//                                   "url.href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Website URL"
//                             />
//                             <Input
//                               type="file"
//                               onChange={(e) => {
//                                 const file = e.target.files?.[0];
//                                 if (file) {
//                                   handleUpdateField(
//                                     "basics",
//                                     index,
//                                     "picture",
//                                     file
//                                   );
//                                 }
//                               }}
//                               accept="image/*"
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Profiles</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.profiles.map((profile, index) => (
//                           <div key={index} className="space-y-2">
//                             <Input
//                               value={profile.url?.href}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "profiles",
//                                   index,
//                                   "url.href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Profile URL"
//                             />
//                             <Input
//                               value={profile.url?.label}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "profiles",
//                                   index,
//                                   "url.label",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Profile Label"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("profiles", index)
//                               }
//                             >
//                               Remove Profile
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("profiles")}>
//                           Add Profile
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 <TabsContent value="professional">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Professional Summary</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.summary.map((sum, index) => (
//                           <Textarea
//                             key={index}
//                             value={sum.content}
//                             onChange={(e) =>
//                               handleUpdateField(
//                                 "summary",
//                                 index,
//                                 "content",
//                                 e.target.value
//                               )
//                             }
//                             placeholder="Professional summary"
//                           />
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Skills</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.skills.map((skillSet, skillSetIndex) => (
//                           <div key={skillSetIndex} className="space-y-2">
//                             {skillSet.categories.map(
//                               (category, categoryIndex) => (
//                                 <div key={categoryIndex} className="space-y-2">
//                                   <Input
//                                     value={category.name}
//                                     onChange={(e) => {
//                                       const updatedCategories = [
//                                         ...skillSet.categories,
//                                       ];
//                                       updatedCategories[categoryIndex] = {
//                                         ...category,
//                                         name: e.target.value,
//                                       };
//                                       handleUpdateField(
//                                         "skills",
//                                         skillSetIndex,
//                                         "categories",
//                                         updatedCategories
//                                       );
//                                     }}
//                                     placeholder="Category name"
//                                   />
//                                   {category.skills &&
//                                     category.skills.map((skill, skillIndex) => (
//                                       <div
//                                         key={skillIndex}
//                                         className="flex space-x-2"
//                                       >
//                                         <Input
//                                           value={skill.name}
//                                           onChange={(e) => {
//                                             const updatedCategories = [
//                                               ...skillSet.categories,
//                                             ];
//                                             const updatedSkills = [
//                                               ...category.skills,
//                                             ];
//                                             updatedSkills[skillIndex] = {
//                                               ...skill,
//                                               name: e.target.value,
//                                             };
//                                             updatedCategories[categoryIndex] = {
//                                               ...category,
//                                               skills: updatedSkills,
//                                             };
//                                             handleUpdateField(
//                                               "skills",
//                                               skillSetIndex,
//                                               "categories",
//                                               updatedCategories
//                                             );
//                                           }}
//                                           placeholder="Skill name"
//                                         />
//                                         <Select
//                                           value={skill.level}
//                                           onValueChange={(value) => {
//                                             const updatedCategories = [
//                                               ...skillSet.categories,
//                                             ];
//                                             const updatedSkills = [
//                                               ...category.skills,
//                                             ];
//                                             updatedSkills[skillIndex] = {
//                                               ...skill,
//                                               level: value,
//                                             };
//                                             updatedCategories[categoryIndex] = {
//                                               ...category,
//                                               skills: updatedSkills,
//                                             };
//                                             handleUpdateField(
//                                               "skills",
//                                               skillSetIndex,
//                                               "categories",
//                                               updatedCategories
//                                             );
//                                           }}
//                                         >
//                                           <SelectTrigger>
//                                             <SelectValue placeholder="Select level" />
//                                           </SelectTrigger>
//                                           <SelectContent>
//                                             <SelectItem value="Beginner">
//                                               Beginner
//                                             </SelectItem>
//                                             <SelectItem value="Intermediate">
//                                               Intermediate
//                                             </SelectItem>
//                                             <SelectItem value="Advanced">
//                                               Advanced
//                                             </SelectItem>
//                                           </SelectContent>
//                                         </Select>
//                                         <Button
//                                           variant="destructive"
//                                           onClick={() => {
//                                             const updatedCategories = [
//                                               ...skillSet.categories,
//                                             ];
//                                             const updatedSkills =
//                                               category.skills.filter(
//                                                 (_, idx) => idx !== skillIndex
//                                               );
//                                             updatedCategories[categoryIndex] = {
//                                               ...category,
//                                               skills: updatedSkills,
//                                             };
//                                             handleUpdateField(
//                                               "skills",
//                                               skillSetIndex,
//                                               "categories",
//                                               updatedCategories
//                                             );
//                                           }}
//                                         >
//                                           Remove Skill
//                                         </Button>
//                                       </div>
//                                     ))}
//                                   <Button
//                                     onClick={() => {
//                                       const updatedCategories = [
//                                         ...skillSet.categories,
//                                       ];
//                                       if (
//                                         !updatedCategories[categoryIndex].skills
//                                       ) {
//                                         updatedCategories[
//                                           categoryIndex
//                                         ].skills = [];
//                                       }
//                                       updatedCategories[
//                                         categoryIndex
//                                       ].skills.push({
//                                         name: "",
//                                         level: "Beginner",
//                                       });
//                                       handleUpdateField(
//                                         "skills",
//                                         skillSetIndex,
//                                         "categories",
//                                         updatedCategories
//                                       );
//                                     }}
//                                   >
//                                     Add Skill
//                                   </Button>
//                                 </div>
//                               )
//                             )}
//                             <Button
//                               onClick={() => {
//                                 const updatedCategories = [
//                                   ...skillSet.categories,
//                                   {
//                                     id: Date.now().toString(),
//                                     name: "",
//                                     skills: [],
//                                   },
//                                 ];
//                                 handleUpdateField(
//                                   "skills",
//                                   skillSetIndex,
//                                   "categories",
//                                   updatedCategories
//                                 );
//                               }}
//                             >
//                               Add Category
//                             </Button>
//                           </div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Experience</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.experience.map((exp, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={exp.organization}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "experience",
//                                   index,
//                                   "organization",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Organization"
//                             />
//                             <Input
//                               value={exp.role}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "experience",
//                                   index,
//                                   "role",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Role"
//                             />
//                             <Input
//                               type="date"
//                               value={exp.startDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "experience",
//                                   index,
//                                   "startDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               type="date"
//                               value={exp.endDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "experience",
//                                   index,
//                                   "endDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               value={exp.location}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "experience",
//                                   index,
//                                   "location",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Location"
//                             />
//                             <Textarea
//                               value={exp.summary}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "experience",
//                                   index,
//                                   "summary",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Summary"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("experience", index)
//                               }
//                             >
//                               Remove Experience
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("experience")}>
//                           Add Experience
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Education</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.education.map((edu, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={edu.institution}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "institution",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Institution"
//                             />
//                             <Input
//                               value={edu.degree}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "degree",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Degree"
//                             />
//                             <Input
//                               value={edu.field}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "field",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Field of Study"
//                             />
//                             <Input
//                               value={edu.specialization}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "specialization",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Specialization"
//                             />
//                             <Input
//                               type="date"
//                               value={edu.startDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "startDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               type="date"
//                               value={edu.endDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "endDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               value={edu.score}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "education",
//                                   index,
//                                   "score",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Score"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("education", index)
//                               }
//                             >
//                               Remove Education
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("education")}>
//                           Add Education
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>

//                 <TabsContent value="additional">
//                   <Card>
//                     <CardHeader>
//                       <CardTitle>Projects</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.projects.map((project, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={project.name}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "projects",
//                                   index,
//                                   "name",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Project Name"
//                             />
//                             <Textarea
//                               value={project.summary}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "projects",
//                                   index,
//                                   "summary",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Project Summary"
//                             />
//                             <Input
//                               type="date"
//                               value={project.startDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "projects",
//                                   index,
//                                   "startDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               type="date"
//                               value={project.endDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "projects",
//                                   index,
//                                   "endDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               value={project.url?.href}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "projects",
//                                   index,
//                                   "url.href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Project URL"
//                             />
//                             <Input
//                               value={project.keywords?.join(", ")}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "projects",
//                                   index,
//                                   "keywords",
//                                   e.target.value.split(", ")
//                                 )
//                               }
//                               placeholder="Keywords (comma-separated)"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("projects", index)
//                               }
//                             >
//                               Remove Project
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("projects")}>
//                           Add Project
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Languages</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.languages.map((lang, index) => (
//                           <div key={index} className="space-y-2">
//                             <Input
//                               value={lang.name}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "languages",
//                                   index,
//                                   "name",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Language"
//                             />
//                             <Select
//                               value={lang.level}
//                               onValueChange={(value) =>
//                                 handleUpdateField(
//                                   "languages",
//                                   index,
//                                   "level",
//                                   value
//                                 )
//                               }
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select proficiency level" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 <SelectItem value="Beginner">
//                                   Beginner
//                                 </SelectItem>
//                                 <SelectItem value="Intermediate">
//                                   Intermediate
//                                 </SelectItem>
//                                 <SelectItem value="Advanced">
//                                   Advanced
//                                 </SelectItem>
//                                 <SelectItem value="Native">Native</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("languages", index)
//                               }
//                             >
//                               Remove Language
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("languages")}>
//                           Add Language
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Volunteer Experience</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.volunteer.map((vol, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={vol.organization}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "volunteer",
//                                   index,
//                                   "organization",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Organization"
//                             />
//                             <Input
//                               value={vol.role}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "volunteer",
//                                   index,
//                                   "role",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Role"
//                             />
//                             <Input
//                               type="date"
//                               value={vol.startDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "volunteer",
//                                   index,
//                                   "startDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               type="date"
//                               value={vol.endDate}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "volunteer",
//                                   index,
//                                   "endDate",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               value={vol.location}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "volunteer",
//                                   index,
//                                   "location",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Location"
//                             />
//                             <Textarea
//                               value={vol.summary}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "volunteer",
//                                   index,
//                                   "summary",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Summary"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("volunteer", index)
//                               }
//                             >
//                               Remove Volunteer Experience
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("volunteer")}>
//                           Add Volunteer Experience
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Awards</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.awards.map((award, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={award.title}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "awards",
//                                   index,
//                                   "title",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Award Title"
//                             />
//                             <Input
//                               value={award.awarder}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "awards",
//                                   index,
//                                   "awarder",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Awarder"
//                             />
//                             <Input
//                               type="date"
//                               value={award.date}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "awards",
//                                   index,
//                                   "date",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Textarea
//                               value={award.summary}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "awards",
//                                   index,
//                                   "summary",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Award Summary"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() => handleRemoveItem("awards", index)}
//                             >
//                               Remove Award
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("awards")}>
//                           Add Award
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Publications</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.publications.map((pub, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={pub.name}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "publications",
//                                   index,
//                                   "name",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Publication Name"
//                             />
//                             <Input
//                               value={pub.publisher}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "publications",
//                                   index,
//                                   "publisher",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Publisher"
//                             />
//                             <Input
//                               value={pub.publishedIn}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "publications",
//                                   index,
//                                   "publishedIn",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Published In"
//                             />
//                             <Input
//                               value={pub.url?.href}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "publications",
//                                   index,
//                                   "url.href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="URL"
//                             />
//                             <Input
//                               type="date"
//                               value={pub.date}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "publications",
//                                   index,
//                                   "date",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("publications", index)
//                               }
//                             >
//                               Remove Publication
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("publications")}>
//                           Add Publication
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>Certifications</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.certifications.map((cert, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={cert.name}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "certifications",
//                                   index,
//                                   "name",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Certification Name"
//                             />
//                             <Input
//                               value={cert.issuer}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "certifications",
//                                   index,
//                                   "issuer",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Issuer"
//                             />
//                             <Input
//                               type="date"
//                               value={cert.date}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "certifications",
//                                   index,
//                                   "date",
//                                   e.target.value
//                                 )
//                               }
//                             />
//                             <Input
//                               value={cert.url?.href}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "certifications",
//                                   index,
//                                   "url.href",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="URL"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("certifications", index)
//                               }
//                             >
//                               Remove Certification
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("certifications")}>
//                           Add Certification
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>

//                   <Card className="mt-4">
//                     <CardHeader>
//                       <CardTitle>References</CardTitle>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {profileData.references.map((ref, index) => (
//                           <div
//                             key={index}
//                             className="space-y-2 border p-4 rounded"
//                           >
//                             <Input
//                               value={ref.name}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "references",
//                                   index,
//                                   "name",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Reference Name"
//                             />
//                             <Input
//                               value={ref.phone}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "references",
//                                   index,
//                                   "phone",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Phone"
//                             />
//                             <Input
//                               value={ref.email}
//                               onChange={(e) =>
//                                 handleUpdateField(
//                                   "references",
//                                   index,
//                                   "email",
//                                   e.target.value
//                                 )
//                               }
//                               placeholder="Email"
//                             />
//                             <Button
//                               variant="destructive"
//                               onClick={() =>
//                                 handleRemoveItem("references", index)
//                               }
//                             >
//                               Remove Reference
//                             </Button>
//                           </div>
//                         ))}
//                         <Button onClick={() => handleAddItem("references")}>
//                           Add Reference
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </TabsContent>
//               </>
//             )}
//           </ScrollArea>
//         </Tabs>
//       </div>
//     </div>
//   );
// }

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

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const profileData = useAppSelector((state) => state.profile);
  const [activeTab, setActiveTab] = useState("personal");
  const [credits, setCredits] = useState({ current: 50, max: 100 });
  const [isChanged, setIsChanged] = useState(false);
  const [initialData, setInitialData] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isLoadingCredits, setIsLoadingCredits] = useState(true);
  const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch("/api/get-profile");
        const data = await response.json();
        dispatch(UpdateProfileData(data.profileData));
        setInitialData(data.profileData);
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/get-credits");
        const data = await response.json();
        setCredits(data.credits);
      } catch (error) {
        console.error("Error fetching credits:", error);
      } finally {
        setIsLoadingCredits(false);
      }
    };

    fetchProfileData();
    fetchCredits();
  }, [dispatch]);

  useEffect(() => {
    if (initialData) {
      setIsChanged(JSON.stringify(initialData) !== JSON.stringify(profileData));
    }
  }, [profileData, initialData]);

  const createEmptyEntry = (section: keyof ResumeData) => {
    const newEntry: any = { id: Date.now().toString() };
    const sectionFields = getFieldsForSection(section);
    sectionFields.forEach((field) => {
      if (field === "url") {
        newEntry[field] = { href: "", label: "" };
      } else if (field === "categories" && section === "skills") {
        newEntry[field] = [];
      } else {
        newEntry[field] = "";
      }
    });
    return newEntry;
  };

  const updateEntry = (
    section: keyof ResumeData,
    id: string,
    field: string,
    value: any
  ) => {
    const updatedData = { ...profileData };
    updatedData[section] = updatedData[section].map((entry: any) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    dispatch(UpdateProfileData(updatedData));
  };

  const addEntry = (section: keyof ResumeData) => {
    const updatedData = { ...profileData };
    if (section === "skills") {
      if (!updatedData.skills || updatedData.skills.length === 0) {
        updatedData.skills = [];
      }
      updatedData.skills.push({
        id: Date.now().toString(),
        name: "",
        skills: [],
      });
    } else {
      if (!Array.isArray(updatedData[section])) {
        updatedData[section] = [];
      }
      updatedData[section].push(createEmptyEntry(section));
    }
    dispatch(UpdateProfileData(updatedData));
  };

  const deleteEntry = (section: keyof ResumeData, id: string) => {
    const updatedData = { ...profileData };
    //@ts-ignore
    updatedData[section] = updatedData[section].filter(
      (entry: any) => entry.id !== id
    );
    dispatch(UpdateProfileData(updatedData));
  };

  const deleteSkillCategory = (entryId: string, categoryId: string) => {
    const updatedData = { ...profileData };
    updatedData.skills = updatedData.skills.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          categories: entry.skills.filter(
          //@ts-ignore
            (category) => category.id !== categoryId
          ),
        };
      }
      return entry;
    });
    dispatch(UpdateProfileData(updatedData));
  };

  const addSkill = (entryId: string, categoryId: string) => {
    const updatedData = { ...profileData };
    updatedData.skills = updatedData.skills.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          categories: entry.skills.map((category) => {
            return category;
          }),
        };
      }
      return entry;
    });
    dispatch(UpdateProfileData(updatedData));
  };

  const deleteSkill = (
    entryId: string,
    categoryId: string,
    skillIndex: number
  ) => {
    const updatedData = { ...profileData };
    updatedData.skills = updatedData.skills.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          categories: entry.skills.map((category) => {
            
            return category;
          }),
        };
      }
      return entry;
    });
    dispatch(UpdateProfileData(updatedData));
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

    const updatedData = { ...profileData };
    const sectionData = updatedData[section];
    const updatedSection = sectionData.map((entry: any) => {
      if (entry.id === id) {
        const currentUrl = entry[field] as URL;
        return {
          ...entry,
          [field]: {
            href: value,
            label: currentUrl?.label || "",
          },
        };
      }
      return entry;
    });

    updatedData[section] = updatedSection;
    dispatch(UpdateProfileData(updatedData));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      //@ts-ignore
      const result = await updateProfiles(profileData);
      if (result.success) {
        setInitialData(profileData);
        setIsChanged(false);
        console.log(result.message);
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgradeCredits = () => {
    console.log("Upgrading credits");
  };

  const getFieldsForSection = (section: keyof ResumeData): string[] => {
    switch (section) {
      case "basics":
        return [
          "url",
          "name",
          "email",
          "phone",
          "location",
          "headLine",
          "picture",
        ];
      case "summary":
        return ["content"];
      case "profiles":
        return ["url"];
      case "skills":
        return ["categories"];
      case "projects":
        return ["url", "name", "summary", "startDate", "endDate", "keywords"];
      case "education":
        return [
          "institution",
          "degree",
          "field",
          "specialization",
          "startDate",
          "endDate",
          "score",
        ];
      case "experience":
        return [
          "organization",
          "role",
          "startDate",
          "endDate",
          "location",
          "summary",
        ];
      case "languages":
        return ["name", "level"];
      case "volunteer":
        return ["organization", "role", "location", "startDate", "endDate"];
      case "awards":
        return ["title", "awarder", "date", "summary"];
      case "publications":
        return ["name", "publisher", "publishedIn", "url", "date"];
      case "certifications":
        return ["name", "issuer", "date", "url"];
      case "references":
        return ["name", "phone", "email"];
      default:
        return [];
    }
  };

  const renderEntryFields = (
    section: keyof ResumeData,
    entry: any,
    index: number
  ) => {
    const fields = getFieldsForSection(section);
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
              {field !== "categories" && (
                <Label htmlFor={`${field}-${entry.id}`}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Label>
              )}
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
                <Input
                  id={`${field}-${entry.id}`}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      updateEntry(section, entry.id, field, file);
                    }
                  }}
                  type="file"
                  accept="image/*"
                />
              ) : field === "startDate" ||
                field === "endDate" ||
                field === "date" ? (
                <Input
                  id={`${field}-${entry.id}`}
                  value={entry[field] || ""}
                  onChange={(e) =>
                    updateEntry(section, entry.id, field, e.target.value)
                  }
                  placeholder={`Enter ${field} (YYYY-MM)`}
                  type="month"
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
              ) : field === "categories" && section === "skills" ? (
                <div className="space-y-4">
                  {((entry[field] as SkillCategory[]) || []).map(
                    (category, categoryIndex) => (
                      <div key={category.id} className="border p-4 rounded-md">
                        <h4 className="text-md font-semibold mb-2">
                          Category {categoryIndex + 1}
                        </h4>
                        <Input
                          value={category.name}
                          onChange={(e) => {
                            const updatedCategories = [...entry[field]];
                            updatedCategories[categoryIndex] = {
                              ...updatedCategories[categoryIndex],
                              name: e.target.value,
                            };
                            updateEntry(
                              section,
                              entry.id,
                              field,
                              updatedCategories
                            );
                          }}
                          placeholder="Category name"
                          className="mb-2"
                        />
                        {category.skills.map((skill, skillIndex) => (
                          <div
                            key={skillIndex}
                            className="flex items-center space-x-2 mb-2"
                          >
                            <Input
                              value={skill.name}
                              onChange={(e) => {
                                const updatedCategories = [...entry[field]];
                                const updatedSkills = [
                                  ...updatedCategories[categoryIndex].skills,
                                ];
                                updatedSkills[skillIndex] = {
                                  ...updatedSkills[skillIndex],
                                  name: e.target.value,
                                };
                                updatedCategories[categoryIndex] = {
                                  ...updatedCategories[categoryIndex],
                                  skills: updatedSkills,
                                };
                                updateEntry(
                                  section,
                                  entry.id,
                                  field,
                                  updatedCategories
                                );
                              }}
                              placeholder="Skill name"
                            />
                            <Select
                              onValueChange={(value) => {
                                const updatedCategories = [...entry[field]];
                                const updatedSkills = [
                                  ...updatedCategories[categoryIndex].skills,
                                ];
                                updatedSkills[skillIndex] = {
                                  ...updatedSkills[skillIndex],
                                  level: value,
                                };
                                updatedCategories[categoryIndex] = {
                                  ...updatedCategories[categoryIndex],
                                  skills: updatedSkills,
                                };
                                updateEntry(
                                  section,
                                  entry.id,
                                  field,
                                  updatedCategories
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
                              onClick={() =>
                                deleteSkill(entry.id, category.id, skillIndex)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addSkill(entry.id, category.id)}
                          className="mr-2"
                        >
                          Add Skill
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteSkillCategory(entry.id, category.id)
                          }
                        >
                          Delete Category
                        </Button>
                      </div>
                    )
                  )}
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
          {section !== "basics" &&
            section !== "summary" &&
            section !== "skills" && (
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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Credits</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingCredits ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <>
              <Progress
                value={(credits.current / credits.max) * 100}
                className="mb-2"
              />
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {credits.current} / {credits.max} credits
                </p>
                <Button
                  onClick={handleUpgradeCredits}
                  variant="outline"
                  size="sm"
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Upgrade
                </Button>
              </div>
            </>
          )}
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
            {isLoadingProfile ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-[150px] w-full" />
                <Skeleton className="h-[300px] w-full" />
              </div>
            ) : (
              <>
                <TabsContent value="personal">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profileData.basics.map((basic, index) =>
                        renderEntryFields("basics", basic, index)
                      )}
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Profiles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.profiles.map((profile, index) =>
                          renderEntryFields("profiles", profile, index)
                        )}
                        <Button onClick={() => addEntry("profiles")}>
                          Add Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="professional">
                  <Card>
                    <CardHeader>
                      <CardTitle>Professional Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {profileData.summary.map((sum, index) =>
                        renderEntryFields("summary", sum, index)
                      )}
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Skills</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.skills.map((skillEntry, index) =>
                          renderEntryFields("skills", skillEntry, index)
                        )}
                        <Button onClick={() => addEntry("skills")}>
                          Add Skill Category
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.experience.map((exp, index) =>
                          renderEntryFields("experience", exp, index)
                        )}
                        <Button onClick={() => addEntry("experience")}>
                          Add Experience
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.education.map((edu, index) =>
                          renderEntryFields("education", edu, index)
                        )}
                        <Button onClick={() => addEntry("education")}>
                          Add Education
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="additional">
                  <Card>
                    <CardHeader>
                      <CardTitle>Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.projects.map((project, index) =>
                          renderEntryFields("projects", project, index)
                        )}
                        <Button onClick={() => addEntry("projects")}>
                          Add Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Languages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.languages.map((lang, index) =>
                          renderEntryFields("languages", lang, index)
                        )}
                        <Button onClick={() => addEntry("languages")}>
                          Add Language
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Volunteer Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.volunteer.map((vol, index) =>
                          renderEntryFields("volunteer", vol, index)
                        )}
                        <Button onClick={() => addEntry("volunteer")}>
                          Add Volunteer Experience
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Awards</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.awards.map((award, index) =>
                          renderEntryFields("awards", award, index)
                        )}
                        <Button onClick={() => addEntry("awards")}>
                          Add Award
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Publications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.publications.map((pub, index) =>
                          renderEntryFields("publications", pub, index)
                        )}
                        <Button onClick={() => addEntry("publications")}>
                          Add Publication
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>Certifications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.certifications.map((cert, index) =>
                          renderEntryFields("certifications", cert, index)
                        )}
                        <Button onClick={() => addEntry("certifications")}>
                          Add Certification
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="mt-4">
                    <CardHeader>
                      <CardTitle>References</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.references.map((ref, index) =>
                          renderEntryFields("references", ref, index)
                        )}
                        <Button onClick={() => addEntry("references")}>
                          Add Reference
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </>
            )}
          </ScrollArea>
        </Tabs>
      </div>
    </div>
  );
}