// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "@/components/ui/sheet";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   ChevronLeft,
//   ChevronRight,
//   Plus,
//   UserPlus,
//   Briefcase,
//   GraduationCap,
//   Code,
//   Languages,
//   FileText,
//   Award,
//   Trophy,
//   Settings,
//   Heart,
//   Star,
//   Trash2,
//   Book,
// } from "lucide-react";
// import LeftSidePanel from "./LeftSidePanel";
// import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
// import { UpdateLeftBarData } from "@/slices/leftsidebarSlice";
<<<<<<< HEAD
// import { Skill, URL } from "@/types/types";
// import { RichInput } from "./TextEditor";
// import { useMediaQuery } from "react-responsive";
// import { ResumeData, ResumeSection } from "@/types/types";
// import { DatePicker } from "./DatePicker";
=======
// import { SkillCategory, Skill, URL } from "@/types/types";
// import { RichInput } from "./TextEditor";
// import { useMediaQuery } from "react-responsive";
// import { ResumeData, ResumeSection } from "@/types/types";
>>>>>>> caaaa7a (landing page hero section update)

// interface LeftSideBarProps {
//   activeSection: keyof ResumeData | "";
//   setActiveSection: React.Dispatch<React.SetStateAction<keyof ResumeData | "">>;
//   isPanelOpen: boolean;
//   setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
// }

// export default function LeftSideBar({
//   activeSection,
//   setActiveSection,
//   isPanelOpen,
//   setIsPanelOpen,
// }: LeftSideBarProps) {
//   const [isCollapsed, setIsCollapsed] = useState(false);
//   const [sidebarWidth, setSidebarWidth] = useState(320);
//   const sidebarRef = useRef<HTMLDivElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
//   const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});
//   const dispatch = useAppDispatch();
//   const resumeData = useAppSelector((state) => state.leftsidebar);
//   const isPhoneView = useMediaQuery({ maxWidth: 767 });

//   const resumeSections: ResumeSection[] = [
//     {
//       id: "basics",
//       icon: <UserPlus className="w-4 h-4" />,
//       title: "Basics",
//       fields: [
//         "url",
//         "name",
//         "email",
//         "phone",
//         "location",
//         "headLine",
//         "picture",
//       ],
//     },
//     {
//       id: "summary",
//       icon: <FileText className="w-4 h-4" />,
//       title: "Summary",
//       fields: ["content"],
//     },
//     {
//       id: "profiles",
//       icon: <Settings className="w-4 h-4" />,
//       title: "Profiles",
//       fields: ["url"],
//     },
//     {
//       id: "skills",
//       icon: <Code className="w-4 h-4" />,
//       title: "Skills",
<<<<<<< HEAD
//       fields: ["name", "skills"],
=======
//       fields: ["categories"],
>>>>>>> caaaa7a (landing page hero section update)
//     },
//     {
//       id: "projects",
//       icon: <FileText className="w-4 h-4" />,
//       title: "Projects",
//       fields: ["url", "name", "summary", "startDate", "endDate", "keywords"],
//     },
//     {
//       id: "education",
//       icon: <GraduationCap className="w-4 h-4" />,
//       title: "Education",
//       fields: [
//         "institution",
//         "degree",
//         "field",
//         "specialization",
//         "startDate",
//         "endDate",
//         "score",
//       ],
//     },
//     {
//       id: "experience",
//       icon: <Briefcase className="w-4 h-4" />,
//       title: "Experience",
//       fields: [
//         "organization",
//         "role",
//         "startDate",
//         "endDate",
//         "location",
//         "summary",
//       ],
//     },
//     {
//       id: "languages",
//       icon: <Languages className="w-4 h-4" />,
//       title: "Languages",
//       fields: ["name", "level"],
//     },
//     {
//       id: "volunteer",
//       icon: <Heart className="w-4 h-4" />,
//       title: "Volunteering",
//       fields: ["organization", "role", "location", "startDate", "endDate"],
//     },
//     {
//       id: "awards",
//       icon: <Trophy className="w-4 h-4" />,
//       title: "Awards",
//       fields: ["title", "awarder", "date", "summary"],
//     },
//     {
//       id: "publications",
//       icon: <Book className="w-4 h-4" />,
//       title: "Publications",
//       fields: ["name", "publisher", "publishedIn", "url", "date"],
//     },
//     {
//       id: "certifications",
//       icon: <Award className="w-4 h-4" />,
//       title: "Certifications",
//       fields: ["name", "issuer", "date", "url"],
//     },
//     {
//       id: "references",
//       icon: <Star className="w-4 h-4" />,
//       title: "References",
//       fields: ["name", "phone", "email"],
//     },
//   ];

//   useEffect(() => {
//     if (isPhoneView) {
//       setIsCollapsed(true);
//     }
//   }, [isPhoneView]);

//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       if (!isDragging) return;
//       const newWidth = e.clientX;
//       if (newWidth > 200 && newWidth < 600) {
//         setSidebarWidth(newWidth);
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//     };

//     document.addEventListener("mousemove", handleMouseMove);
//     document.addEventListener("mouseup", handleMouseUp);

//     return () => {
//       document.removeEventListener("mousemove", handleMouseMove);
//       document.removeEventListener("mouseup", handleMouseUp);
//     };
//   }, [isDragging]);

//   const createEmptyEntry = (section: keyof ResumeData) => {
//     const newEntry: any = { id: Date.now().toString() };
//     const sectionFields =
//       resumeSections.find((s) => s.id === section)?.fields || [];
//     sectionFields.forEach((field) => {
//       if (field === "url") {
//         newEntry[field] = { href: "", label: "" };
<<<<<<< HEAD
//       } else if (field === "skills" && section === "skills") {
//         newEntry[field] = [];
=======
//       } else if (field === "categories" && section === "skills") {
//         newEntry[field] = [{ id: Date.now().toString(), name: "", skills: [] }];
>>>>>>> caaaa7a (landing page hero section update)
//       } else {
//         newEntry[field] = "";
//       }
//     });
//     return newEntry;
//   };

//   const addEntry = (section: keyof ResumeData) => {
//     const updatedResumeData = { ...resumeData };
<<<<<<< HEAD
//     updatedResumeData[section] = [
//       ...updatedResumeData[section],
//       createEmptyEntry(section),
//     ];
=======
//     if (section === "skills") {
//       updatedResumeData[section] = updatedResumeData[section].map((entry) => ({
//         ...entry,
//         categories: [
//           ...entry.categories,
//           { id: Date.now().toString(), name: "", skills: [] },
//         ],
//       }));
//     } else {
//       updatedResumeData[section] = [
//         ...updatedResumeData[section],
//         createEmptyEntry(section),
//       ];
//     }
>>>>>>> caaaa7a (landing page hero section update)
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

//   const updateEntry = (
//     section: keyof ResumeData,
//     id: string,
//     field: string,
//     value: any
//   ) => {
//     const updatedResumeData = { ...resumeData };
//     updatedResumeData[section] = updatedResumeData[section].map((entry: any) =>
//       entry.id === id ? { ...entry, [field]: value } : entry
//     );
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

//   const deleteEntry = (section: keyof ResumeData, id: string) => {
//     const updatedResumeData = { ...resumeData };
//     //@ts-ignore
//     updatedResumeData[section] = updatedResumeData[section].filter(
//       (entry: any) => entry.id !== id
//     );
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

<<<<<<< HEAD
//   const addSkill = (entryId: string) => {
=======
//   const deleteSkillCategory = (entryId: string, categoryId: string) => {
>>>>>>> caaaa7a (landing page hero section update)
//     const updatedResumeData = { ...resumeData };
//     updatedResumeData.skills = updatedResumeData.skills.map((entry) => {
//       if (entry.id === entryId) {
//         return {
//           ...entry,
<<<<<<< HEAD
//           skills: [...entry.skills, { name: "", level: "" }],
=======
//           categories: entry.categories.filter(
//             (category) => category.id !== categoryId
//           ),
>>>>>>> caaaa7a (landing page hero section update)
//         };
//       }
//       return entry;
//     });
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

<<<<<<< HEAD
//   const deleteSkill = (entryId: string, skillIndex: number) => {
=======
//   const addSkill = (entryId: string, categoryId: string) => {
>>>>>>> caaaa7a (landing page hero section update)
//     const updatedResumeData = { ...resumeData };
//     updatedResumeData.skills = updatedResumeData.skills.map((entry) => {
//       if (entry.id === entryId) {
//         return {
//           ...entry,
<<<<<<< HEAD
//           skills: entry.skills.filter((_, index) => index !== skillIndex),
=======
//           categories: entry.categories.map((category) => {
//             if (category.id === categoryId) {
//               return {
//                 ...category,
//                 skills: [...category.skills, { name: "", level: undefined }],
//               };
//             }
//             return category;
//           }),
//         };
//       }
//       return entry;
//     });
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

//   const deleteSkill = (
//     entryId: string,
//     categoryId: string,
//     skillIndex: number
//   ) => {
//     const updatedResumeData = { ...resumeData };
//     updatedResumeData.skills = updatedResumeData.skills.map((entry) => {
//       if (entry.id === entryId) {
//         return {
//           ...entry,
//           categories: entry.categories.map((category) => {
//             if (category.id === categoryId) {
//               return {
//                 ...category,
//                 skills: category.skills.filter(
//                   (_, index) => index !== skillIndex
//                 ),
//               };
//             }
//             return category;
//           }),
>>>>>>> caaaa7a (landing page hero section update)
//         };
//       }
//       return entry;
//     });
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

//   const validateUrl = (url: string) => {
//     const pattern = new RegExp(
//       "^(https?:\\/\\/)?" +
//         "((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|" +
//         "((\\d{1,3}\\.){3}\\d{1,3}))" +
//         "(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*" +
//         "(\\?[;&a-zA-Z\\d%_.~+=-]*)?" +
//         "(\\#[-a-zA-Z\\d_]*)?$",
//       "i"
//     );

//     return !!pattern.test(url);
//   };

//   const handleUrlChange = (
//     section: keyof ResumeData,
//     id: string,
//     field: string,
//     value: string
//   ) => {
//     const errorKey = `${section}-${id}-${field}`;
//     if (value && !validateUrl(value)) {
//       setUrlErrors((prev) => ({
//         ...prev,
//         [errorKey]: "Please enter a valid URL",
//       }));
//     } else {
//       setUrlErrors((prev) => {
//         const newErrors = { ...prev };
//         delete newErrors[errorKey];
//         return newErrors;
//       });
//     }

//     const updatedResumeData = { ...resumeData };
//     const sectionData = updatedResumeData[section];
//     const updatedSection = sectionData.map((entry: any) => {
//       if (entry.id === id) {
//         const currentUrl = entry[field] as URL;
//         return {
//           ...entry,
//           [field]: {
//             href: value,
//             label: currentUrl?.label || "",
//           },
//         };
//       }
//       return entry;
//     });

//     updatedResumeData[section] = updatedSection;
//     dispatch(UpdateLeftBarData(updatedResumeData));
//   };

//   const renderEntryFields = (
//     section: keyof ResumeData,
//     entry: any,
//     index: number
//   ) => {
//     const fields = resumeSections.find((s) => s.id === section)?.fields || [];
//     return (
//       <div key={entry.id} className="mb-8">
<<<<<<< HEAD
//         <h3 className="text-lg font-semibold mb-4">
//           {section.charAt(0).toUpperCase() + section.slice(1)} {index + 1}
//         </h3>
//         <div className="space-y-4">
//           {fields.map((field) => (
//             <div key={field}>
//               <Label htmlFor={`${field}-${entry.id}`}>
//                 {field.charAt(0).toUpperCase() + field.slice(1)}
//               </Label>
=======
//         {section !== "skills" && (
//           <h3 className="text-lg font-semibold mb-4">
//             {section.charAt(0).toUpperCase() + section.slice(1)} {index + 1}
//           </h3>
//         )}
//         <div className="space-y-4">
//           {fields.map((field) => (
//             <div key={field}>
//               {field !== "categories" && (
//                 <Label htmlFor={`${field}-${entry.id}`}>
//                   {field.charAt(0).toUpperCase() + field.slice(1)}
//                 </Label>
//               )}
>>>>>>> caaaa7a (landing page hero section update)
//               {field === "summary" || field === "content" ? (
//                 <RichInput
//                   content={entry[field] || ""}
//                   section={section}
//                   onContentChange={(value) =>
//                     updateEntry(section, entry.id, field, value)
//                   }
//                 />
//               ) : field === "keywords" ? (
//                 <Input
//                   id={`${field}-${entry.id}`}
//                   value={(entry[field] || []).join(", ")}
//                   onChange={(e) =>
//                     updateEntry(
//                       section,
//                       entry.id,
//                       field,
//                       e.target.value.split(",").map((item) => item.trim())
//                     )
//                   }
//                   placeholder={`Enter ${field} (comma-separated)`}
//                 />
//               ) : field === "url" ? (
//                 <div className="space-y-2">
//                   <Input
//                     id={`${field}-href-${entry.id}`}
//                     value={(entry[field] as URL)?.href || ""}
//                     onChange={(e) =>
//                       handleUrlChange(section, entry.id, field, e.target.value)
//                     }
//                     placeholder="Enter URL"
//                     type="url"
//                   />
//                   {urlErrors[`${section}-${entry.id}-${field}`] && (
//                     <p className="text-sm text-red-500">
<<<<<<< HEAD
=======
                
>>>>>>> caaaa7a (landing page hero section update)
//                       {urlErrors[`${section}-${entry.id}-${field}`]}
//                     </p>
//                   )}
//                   <Input
//                     id={`${field}-label-${entry.id}`}
//                     value={(entry[field] as URL)?.label || ""}
//                     onChange={(e) =>
//                       updateEntry(section, entry.id, field, {
//                         ...(entry[field] as URL),
//                         label: e.target.value,
//                       })
//                     }
//                     placeholder="Enter label"
//                   />
//                 </div>
//               ) : field === "picture" ? (
//                 <Input
//                   id={`${field}-${entry.id}`}
//                   onChange={(e) => {
//                     const file = e.target.files?.[0];
//                     if (file) {
//                       updateEntry(section, entry.id, field, file);
//                     }
//                   }}
//                   type="file"
//                   accept="image/*"
//                 />
//               ) : field === "startDate" ||
//                 field === "endDate" ||
//                 field === "date" ? (
<<<<<<< HEAD
//                 <DatePicker
//                   placeholder={`Select ${field}`}
//                   date={entry[field] ? new Date(entry[field]) : undefined}
//                   setDate={(date) =>
//                     updateEntry(
//                       section,
//                       entry.id,
//                       field,
//                       date ? date.toISOString() : ""
//                     )
//                   }
=======
//                 <Input
//                   id={`${field}-${entry.id}`}
//                   value={entry[field] || ""}
//                   onChange={(e) =>
//                     updateEntry(section, entry.id, field, e.target.value)
//                   }
//                   placeholder={`Enter ${field} (YYYY-MM)`}
//                   type="month"
>>>>>>> caaaa7a (landing page hero section update)
//                 />
//               ) : field === "level" ? (
//                 <Select
//                   onValueChange={(value) =>
//                     updateEntry(section, entry.id, field, value)
//                   }
//                   defaultValue={entry[field] || undefined}
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select level" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {["Beginner", "Intermediate", "Advanced"].map((level) => (
//                       <SelectItem key={level} value={level}>
//                         {level}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
<<<<<<< HEAD
//               ) : field === "skills" && section === "skills" ? (
//                 <div className="space-y-4">
//                   {(entry.skills || []).map(
//                     (skill: Skill, skillIndex: number) => (
//                       <div
//                         key={skillIndex}
//                         className="flex items-center space-x-2 mb-2"
//                       >
//                         <Input
//                           value={skill.name}
//                           onChange={(e) => {
//                             const updatedSkills = [...entry.skills];
//                             updatedSkills[skillIndex] = {
//                               ...updatedSkills[skillIndex],
=======
//               ) : field === "categories" && section === "skills" ? (
//                 <div className="space-y-4">
//                   {((entry[field] as SkillCategory[]) || []).map(
//                     (category, categoryIndex) => (
//                       <div key={category.id} className="border p-4 rounded-md">
//                         <h4 className="text-md font-semibold mb-2">
//                           Category {categoryIndex + 1}
//                         </h4>
//                         <Input
//                           value={category.name}
//                           onChange={(e) => {
//                             const updatedCategories = [...entry[field]];
//                             updatedCategories[categoryIndex] = {
//                               ...updatedCategories[categoryIndex],
>>>>>>> caaaa7a (landing page hero section update)
//                               name: e.target.value,
//                             };
//                             updateEntry(
//                               section,
//                               entry.id,
<<<<<<< HEAD
//                               "skills",
//                               updatedSkills
//                             );
//                           }}
//                           placeholder="Skill name"
//                         />
//                         <Select
//                           onValueChange={(value) => {
//                             const updatedSkills = [...entry.skills];
//                             updatedSkills[skillIndex] = {
//                               ...updatedSkills[skillIndex],
//                               level: value,
//                             };
//                             updateEntry(
//                               section,
//                               entry.id,
//                               "skills",
//                               updatedSkills
//                             );
//                           }}
//                           defaultValue={skill.level}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select level" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {["Beginner", "Intermediate", "Advanced"].map(
//                               (level) => (
//                                 <SelectItem key={level} value={level}>
//                                   {level}
//                                 </SelectItem>
//                               )
//                             )}
//                           </SelectContent>
//                         </Select>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() => deleteSkill(entry.id, skillIndex)}
//                         >
//                           <Trash2 className="w-4 h-4" />
=======
//                               field,
//                               updatedCategories
//                             );
//                           }}
//                           placeholder="Category name"
//                           className="mb-2"
//                         />
//                         {category.skills.map((skill, skillIndex) => (
//                           <div
//                             key={skillIndex}
//                             className="flex items-center space-x-2 mb-2"
//                           >
//                             <Input
//                               value={skill.name}
//                               onChange={(e) => {
//                                 const updatedCategories = [...entry[field]];
//                                 const updatedSkills = [
//                                   ...updatedCategories[categoryIndex].skills,
//                                 ];
//                                 updatedSkills[skillIndex] = {
//                                   ...updatedSkills[skillIndex],
//                                   name: e.target.value,
//                                 };
//                                 updatedCategories[categoryIndex] = {
//                                   ...updatedCategories[categoryIndex],
//                                   skills: updatedSkills,
//                                 };
//                                 updateEntry(
//                                   section,
//                                   entry.id,
//                                   field,
//                                   updatedCategories
//                                 );
//                               }}
//                               placeholder="Skill name"
//                             />
//                             <Select
//                               onValueChange={(value) => {
//                                 const updatedCategories = [...entry[field]];
//                                 const updatedSkills = [
//                                   ...updatedCategories[categoryIndex].skills,
//                                 ];
//                                 updatedSkills[skillIndex] = {
//                                   ...updatedSkills[skillIndex],
//                                   level: value,
//                                 };
//                                 updatedCategories[categoryIndex] = {
//                                   ...updatedCategories[categoryIndex],
//                                   skills: updatedSkills,
//                                 };
//                                 updateEntry(
//                                   section,
//                                   entry.id,
//                                   field,
//                                   updatedCategories
//                                 );
//                               }}
//                               defaultValue={skill.level}
//                             >
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Select level" />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {["Beginner", "Intermediate", "Advanced"].map(
//                                   (level) => (
//                                     <SelectItem key={level} value={level}>
//                                       {level}
//                                     </SelectItem>
//                                   )
//                                 )}
//                               </SelectContent>
//                             </Select>
//                             <Button
//                               variant="destructive"
//                               size="sm"
//                               onClick={() =>
//                                 deleteSkill(entry.id, category.id, skillIndex)
//                               }
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         ))}
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => addSkill(entry.id, category.id)}
//                           className="mr-2"
//                         >
//                           Add Skill
//                         </Button>
//                         <Button
//                           variant="destructive"
//                           size="sm"
//                           onClick={() =>
//                             deleteSkillCategory(entry.id, category.id)
//                           }
//                         >
//                           Delete Category
>>>>>>> caaaa7a (landing page hero section update)
//                         </Button>
//                       </div>
//                     )
//                   )}
<<<<<<< HEAD
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => addSkill(entry.id)}
//                     className="w-full"
//                   >
//                     Add Skill
//                   </Button>
=======
>>>>>>> caaaa7a (landing page hero section update)
//                 </div>
//               ) : (
//                 <Input
//                   id={`${field}-${entry.id}`}
//                   value={entry[field] || ""}
//                   onChange={(e) =>
//                     updateEntry(section, entry.id, field, e.target.value)
//                   }
//                   placeholder={`Enter ${field}`}
//                 />
//               )}
//             </div>
//           ))}
<<<<<<< HEAD
//           {section !== "basics" && section !== "summary" && (
//             <Button
//               variant="destructive"
//               size="sm"
//               onClick={() => deleteEntry(section, entry.id)}
//             >
//               <Trash2 className="w-4 h-4 mr-2" /> Delete
//             </Button>
//           )}
=======
//           {section !== "basics" &&
//             section !== "summary" &&
//             section !== "skills" && (
//               <Button
//                 variant="destructive"
//                 size="sm"
//                 onClick={() => deleteEntry(section, entry.id)}
//               >
//                 <Trash2 className="w-4 h-4 mr-2" /> Delete
//               </Button>
//             )}
>>>>>>> caaaa7a (landing page hero section update)
//         </div>
//       </div>
//     );
//   };

//   const renderSheetContent = (section: keyof ResumeData) => {
//     const sectionEntries = resumeData[section] || [];

//     return (
//       <div className="flex flex-col h-full">
//         <ScrollArea className="flex-grow pr-4 my-8">
//           {sectionEntries.map((entry, index) =>
//             renderEntryFields(section, entry, index)
//           )}
//           {sectionEntries.length === 0 && (
//             <p className="text-center text-muted-foreground">
//               No entries yet. Add some!
//             </p>
//           )}
//         </ScrollArea>
//         {section !== "basics" && section !== "summary" && (
//           <div className="mt-4 space-y-2 mb-12">
//             <Button onClick={() => addEntry(section)} className="w-full">
//               <Plus className="w-4 h-4 mr-2" />
<<<<<<< HEAD
//               Add New Entry
=======
//               {section === "skills" ? "Add New Category" : "Add New Entry"}
>>>>>>> caaaa7a (landing page hero section update)
//             </Button>
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <>
//       {isPhoneView ? (
//         <LeftSidePanel<ResumeData>
//           sections={resumeSections}
//           activeSection={activeSection}
//           setActiveSection={setActiveSection}
//           renderSheetContent={renderSheetContent}
//           isPanelOpen={isPanelOpen}
//           setIsPanelOpen={setIsPanelOpen}
//         />
//       ) : (
//         <div
//           ref={sidebarRef}
//           className={`relative h-screen border-r transition-all duration-300 ease-in-out ${
//             isCollapsed ? "w-16" : ""
//           }`}
//           style={{ width: isCollapsed ? "4rem" : `${sidebarWidth}px` }}
//         >
//           <div className="flex flex-col h-full">
//             <div className="p-4 border-b flex justify-between items-center">
//               {!isCollapsed && (
//                 <h2 className="text-lg font-semibold">Resume Sections</h2>
//               )}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsCollapsed(!isCollapsed)}
//               >
//                 {isCollapsed ? (
//                   <ChevronRight className="h-4 w-4" />
//                 ) : (
//                   <ChevronLeft className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//             <ScrollArea className="flex-grow">
//               <div className="p-4 space-y-4">
//                 {resumeSections.map((section) => (
//                   <Sheet key={section.id}>
//                     <SheetTrigger asChild>
//                       <Button
//                         variant={
//                           activeSection === section.id ? "default" : "ghost"
//                         }
//                         className={`w-full justify-start ${
//                           isCollapsed ? "px-2" : ""
//                         }`}
//                         onClick={() => setActiveSection(section.id)}
//                       >
//                         {section.icon}
//                         {!isCollapsed && (
//                           <span className="ml-2">{section.title}</span>
//                         )}
//                       </Button>
//                     </SheetTrigger>
//                     <SheetContent
//                       side="left"
//                       className="w-[400px] sm:w-[540px]"
//                     >
//                       <SheetHeader>
//                         <SheetTitle>Edit {section.title}</SheetTitle>
//                         <SheetDescription>
//                           Modify or add new entries to this section.
//                         </SheetDescription>
//                       </SheetHeader>
//                       {renderSheetContent(section.id)}
//                     </SheetContent>
//                   </Sheet>
//                 ))}
//               </div>
//             </ScrollArea>
//           </div>
//           <div
//             className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-border hover:bg-muted"
//             onMouseDown={() => setIsDragging(true)}
//           />
//         </div>
//       )}
//     </>
//   );
// }

<<<<<<< HEAD
"use client";

=======
>>>>>>> caaaa7a (landing page hero section update)
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
<<<<<<< HEAD
=======
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
>>>>>>> caaaa7a (landing page hero section update)
  ChevronLeft,
  ChevronRight,
  Plus,
  UserPlus,
  Briefcase,
  GraduationCap,
  Code,
  Languages,
  FileText,
  Award,
  Trophy,
  Settings,
  Heart,
  Star,
  Trash2,
  Book,
<<<<<<< HEAD
} from "lucide-react";
import LeftSidePanel from "./LeftSidePanel";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { UpdateLeftBarData } from "@/slices/leftsidebarSlice";
import { Skill, URL } from "@/types/types";
import { RichInput } from "./TextEditor";
import { useMediaQuery } from "react-responsive";
import { ResumeData, ResumeSection } from "@/types/types";
import { CustomDatePicker } from "./DatePicker";
=======
  Import,
  RotateCcw,
} from "lucide-react";
import LeftSidePanel from "./LeftSidePanel";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { UpdateLeftBarData, Reset } from "@/slices/leftsidebarSlice";
import { SkillCategory, Skill, URL } from "@/types/types";
import { RichInput } from "./TextEditor";
import { useMediaQuery } from "react-responsive";
import { ResumeData, ResumeSection } from "@/types/types";
>>>>>>> caaaa7a (landing page hero section update)

interface LeftSideBarProps {
  activeSection: keyof ResumeData | "";
  setActiveSection: React.Dispatch<React.SetStateAction<keyof ResumeData | "">>;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function LeftSideBar({
  activeSection,
  setActiveSection,
  isPanelOpen,
  setIsPanelOpen,
}: LeftSideBarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [urlErrors, setUrlErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useAppDispatch();
  const resumeData = useAppSelector((state) => state.leftsidebar);
<<<<<<< HEAD
=======
  const profileData = useAppSelector((state) => state.profile);
>>>>>>> caaaa7a (landing page hero section update)
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const resumeSections: ResumeSection[] = [
    {
      id: "basics",
      icon: <UserPlus className="w-4 h-4" />,
      title: "Basics",
      fields: [
        "url",
        "name",
        "email",
        "phone",
        "location",
        "headLine",
        "picture",
      ],
    },
    {
      id: "summary",
      icon: <FileText className="w-4 h-4" />,
      title: "Summary",
      fields: ["content"],
    },
    {
      id: "profiles",
      icon: <Settings className="w-4 h-4" />,
      title: "Profiles",
      fields: ["url"],
    },
    {
      id: "skills",
      icon: <Code className="w-4 h-4" />,
      title: "Skills",
<<<<<<< HEAD
      fields: ["name", "skills"],
=======
      fields: ["categories"],
>>>>>>> caaaa7a (landing page hero section update)
    },
    {
      id: "projects",
      icon: <FileText className="w-4 h-4" />,
      title: "Projects",
      fields: ["url", "name", "summary", "startDate", "endDate", "keywords"],
    },
    {
      id: "education",
      icon: <GraduationCap className="w-4 h-4" />,
      title: "Education",
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
      icon: <Briefcase className="w-4 h-4" />,
      title: "Experience",
      fields: [
        "organization",
        "role",
        "startDate",
        "endDate",
        "location",
        "summary",
      ],
    },
    {
      id: "languages",
      icon: <Languages className="w-4 h-4" />,
      title: "Languages",
      fields: ["name", "level"],
    },
    {
      id: "volunteer",
      icon: <Heart className="w-4 h-4" />,
      title: "Volunteering",
      fields: ["organization", "role", "location", "startDate", "endDate"],
    },
    {
      id: "awards",
      icon: <Trophy className="w-4 h-4" />,
      title: "Awards",
      fields: ["title", "awarder", "date", "summary"],
    },
    {
      id: "publications",
      icon: <Book className="w-4 h-4" />,
      title: "Publications",
      fields: ["name", "publisher", "publishedIn", "url", "date"],
    },
    {
      id: "certifications",
      icon: <Award className="w-4 h-4" />,
      title: "Certifications",
      fields: ["name", "issuer", "date", "url"],
    },
    {
      id: "references",
      icon: <Star className="w-4 h-4" />,
      title: "References",
      fields: ["name", "phone", "email"],
    },
  ];

  useEffect(() => {
    if (isPhoneView) {
      setIsCollapsed(true);
    }
  }, [isPhoneView]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

<<<<<<< HEAD
=======
  const handleImportFromProfile = () => {
    //@ts-ignore
    dispatch(UpdateLeftBarData(profileData));
  };

  const handleClearAll = () => {
    dispatch(Reset());
  };

>>>>>>> caaaa7a (landing page hero section update)
  const createEmptyEntry = (section: keyof ResumeData) => {
    const newEntry: any = { id: Date.now().toString() };
    const sectionFields =
      resumeSections.find((s) => s.id === section)?.fields || [];
    sectionFields.forEach((field) => {
      if (field === "url") {
        newEntry[field] = { href: "", label: "" };
<<<<<<< HEAD
      } else if (field === "skills" && section === "skills") {
        newEntry[field] = [];
=======
      } else if (field === "categories" && section === "skills") {
        newEntry[field] = [{ id: Date.now().toString(), name: "", skills: [] }];
>>>>>>> caaaa7a (landing page hero section update)
      } else {
        newEntry[field] = "";
      }
    });
    return newEntry;
  };

  const addEntry = (section: keyof ResumeData) => {
    const updatedResumeData = { ...resumeData };
<<<<<<< HEAD
    updatedResumeData[section] = [
      ...updatedResumeData[section],
      createEmptyEntry(section),
    ];
=======
    if (section === "skills") {
      updatedResumeData[section] = updatedResumeData[section].map((entry) => ({
        ...entry,
        categories: [
          ...entry.categories,
          { id: Date.now().toString(), name: "", skills: [] },
        ],
      }));
    } else {
      updatedResumeData[section] = [
        ...updatedResumeData[section],
        createEmptyEntry(section),
      ];
    }
>>>>>>> caaaa7a (landing page hero section update)
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const updateEntry = (
    section: keyof ResumeData,
    id: string,
    field: string,
    value: any
  ) => {
    const updatedResumeData = { ...resumeData };
    updatedResumeData[section] = updatedResumeData[section].map((entry: any) =>
      entry.id === id ? { ...entry, [field]: value } : entry
    );
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const deleteEntry = (section: keyof ResumeData, id: string) => {
    const updatedResumeData = { ...resumeData };
    //@ts-ignore
    updatedResumeData[section] = updatedResumeData[section].filter(
      (entry: any) => entry.id !== id
    );
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

<<<<<<< HEAD
  const addSkill = (entryId: string) => {
=======
  const deleteSkillCategory = (entryId: string, categoryId: string) => {
>>>>>>> caaaa7a (landing page hero section update)
    const updatedResumeData = { ...resumeData };
    updatedResumeData.skills = updatedResumeData.skills.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
<<<<<<< HEAD
          skills: [...entry.skills, { name: "", level: "" }],
=======
          categories: entry.categories.filter(
            (category) => category.id !== categoryId
          ),
>>>>>>> caaaa7a (landing page hero section update)
        };
      }
      return entry;
    });
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

<<<<<<< HEAD
  const deleteSkill = (entryId: string, skillIndex: number) => {
=======
  const addSkill = (entryId: string, categoryId: string) => {
>>>>>>> caaaa7a (landing page hero section update)
    const updatedResumeData = { ...resumeData };
    updatedResumeData.skills = updatedResumeData.skills.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
<<<<<<< HEAD
          skills: entry.skills.filter((_, index) => index !== skillIndex),
=======
          categories: entry.categories.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                skills: [...category.skills, { name: "", level: undefined }],
              };
            }
            return category;
          }),
        };
      }
      return entry;
    });
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const deleteSkill = (
    entryId: string,
    categoryId: string,
    skillIndex: number
  ) => {
    const updatedResumeData = { ...resumeData };
    updatedResumeData.skills = updatedResumeData.skills.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          categories: entry.categories.map((category) => {
            if (category.id === categoryId) {
              return {
                ...category,
                skills: category.skills.filter(
                  (_, index) => index !== skillIndex
                ),
              };
            }
            return category;
          }),
>>>>>>> caaaa7a (landing page hero section update)
        };
      }
      return entry;
    });
    dispatch(UpdateLeftBarData(updatedResumeData));
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

    const updatedResumeData = { ...resumeData };
<<<<<<< HEAD
    const sectionData = updatedResumeData[section];
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

    updatedResumeData[section] = updatedSection;
=======
    updatedResumeData[section] = updatedResumeData[section].map(
      (entry: any) => {
        if (entry.id === id) {
          return {
            ...entry,
            [field]: {
              ...entry[field],
              href: value,
            },
          };
        }
        return entry;
      }
    );
>>>>>>> caaaa7a (landing page hero section update)
    dispatch(UpdateLeftBarData(updatedResumeData));
  };

  const renderEntryFields = (
    section: keyof ResumeData,
    entry: any,
    index: number
  ) => {
    const fields = resumeSections.find((s) => s.id === section)?.fields || [];
    return (
      <div key={entry.id} className="mb-8">
<<<<<<< HEAD
        <h3 className="text-lg font-semibold mb-4">
          {section.charAt(0).toUpperCase() + section.slice(1)} {index + 1}
        </h3>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field}>
              <Label htmlFor={`${field}-${entry.id}`}>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
=======
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
>>>>>>> caaaa7a (landing page hero section update)
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
<<<<<<< HEAD
                    <p className="text-sm  text-red-500">
=======
                    <p className="text-sm text-red-500">
>>>>>>> caaaa7a (landing page hero section update)
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
<<<<<<< HEAD
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
=======
                <Input
                  id={`${field}-${entry.id}`}
                  value={entry[field] || ""}
                  onChange={(e) =>
                    updateEntry(section, entry.id, field, e.target.value)
                  }
                  placeholder={`Enter ${field} (YYYY-MM)`}
                  type="month"
>>>>>>> caaaa7a (landing page hero section update)
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
<<<<<<< HEAD
                    {["Beginner", "Intermediate", "Advanced"].map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
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
=======
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
>>>>>>> caaaa7a (landing page hero section update)
                              name: e.target.value,
                            };
                            updateEntry(
                              section,
                              entry.id,
<<<<<<< HEAD
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
=======
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
>>>>>>> caaaa7a (landing page hero section update)
                        </Button>
                      </div>
                    )
                  )}
<<<<<<< HEAD
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(entry.id)}
                    className="w-full"
                  >
                    Add Skill
                  </Button>
=======
>>>>>>> caaaa7a (landing page hero section update)
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
<<<<<<< HEAD
          {section !== "basics" && section !== "summary" && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteEntry(section, entry.id)}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          )}
=======
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
>>>>>>> caaaa7a (landing page hero section update)
        </div>
      </div>
    );
  };

  const renderSheetContent = (section: keyof ResumeData) => {
    const sectionEntries = resumeData[section] || [];

    return (
      <div className="flex flex-col h-full">
        <ScrollArea className="flex-grow pr-4 my-8">
          {sectionEntries.map((entry, index) =>
            renderEntryFields(section, entry, index)
          )}
          {sectionEntries.length === 0 && (
            <p className="text-center text-muted-foreground">
              No entries yet. Add some!
            </p>
          )}
        </ScrollArea>
        {section !== "basics" && section !== "summary" && (
          <div className="mt-4 space-y-2 mb-12">
            <Button onClick={() => addEntry(section)} className="w-full">
              <Plus className="w-4 h-4 mr-2" />
<<<<<<< HEAD
              Add New Entry
=======
              {section === "skills" ? "Add New Category" : "Add New Entry"}
>>>>>>> caaaa7a (landing page hero section update)
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {isPhoneView ? (
        <LeftSidePanel<ResumeData>
          sections={resumeSections}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          renderSheetContent={renderSheetContent}
          isPanelOpen={isPanelOpen}
          setIsPanelOpen={setIsPanelOpen}
        />
      ) : (
        <div
          ref={sidebarRef}
          className={`relative h-screen border-r transition-all duration-300 ease-in-out ${
            isCollapsed ? "w-16" : ""
          }`}
          style={{ width: isCollapsed ? "4rem" : `${sidebarWidth}px` }}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
              {!isCollapsed && (
                <h2 className="text-lg font-semibold">Resume Sections</h2>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronLeft className="h-4 w-4" />
                )}
              </Button>
            </div>
<<<<<<< HEAD
=======
            {!isCollapsed && (
              <div className="p-4 border-b flex justify-start">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Import className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Import from Profile
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to overwrite the fields with
                              profile data?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleImportFromProfile}
                            >
                              Import
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Import from Profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Reset Data</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reset? Your data will be
                              cleared.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleClearAll}>
                              Reset
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
>>>>>>> caaaa7a (landing page hero section update)
            <ScrollArea className="flex-grow">
              <div className="p-4 space-y-4">
                {resumeSections.map((section) => (
                  <Sheet key={section.id}>
                    <SheetTrigger asChild>
                      <Button
                        variant={
                          activeSection === section.id ? "default" : "ghost"
                        }
                        className={`w-full justify-start ${
                          isCollapsed ? "px-2" : ""
                        }`}
                        onClick={() => setActiveSection(section.id)}
                      >
                        {section.icon}
                        {!isCollapsed && (
                          <span className="ml-2">{section.title}</span>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="left"
                      className="w-[400px] sm:w-[540px]"
                    >
                      <SheetHeader>
                        <SheetTitle>Edit {section.title}</SheetTitle>
                        <SheetDescription>
                          Modify or add new entries to this section.
                        </SheetDescription>
                      </SheetHeader>
                      {renderSheetContent(section.id)}
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </ScrollArea>
          </div>
          <div
            className="absolute top-0 right-0 w-1 h-full cursor-ew-resize bg-border hover:bg-muted"
            onMouseDown={() => setIsDragging(true)}
          />
        </div>
      )}
    </>
  );
}