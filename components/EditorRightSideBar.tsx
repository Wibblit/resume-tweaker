// "use client";

// import { useState, useEffect } from "react";
// import { useTheme } from "next-themes";
// import { useMediaQuery } from "react-responsive";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
//   SheetClose,
//   SheetFooter,
// } from "@/components/ui/sheet";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";
// import { Switch } from "@/components/ui/switch";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   ChevronRight,
//   ChevronDown,
//   Search,
//   GripVertical,
//   Settings,
// } from "lucide-react";
// import {
//   UpdateBaseColor,
//   UpdateFont,
//   UpdateFontSize,
//   UpdateLineHeight,
//   UpdateMargin,
//   UpdateId,
//   UpdatePaperFormat,
//   updateSectionOrder,
// } from "@/slices/rightsidebarSlice";
// import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
// import { DownloadPDF } from "@/slices/rightsidebarSlice";
// import { SectionName } from "@/types/types";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "react-beautiful-dnd";
// import { ResetStyle } from "@/slices/rightsidebarSlice";

// const fonts = [
//   "Arial",
//   "Calibri",
//   "Cambria",
//   "Comfortaa",
//   "Courier New",
//   "EB Garamond",
//   "Fira Sans",
//   "Georgia",
//   "Helvetica",
//   "Lato",
//   "Lora",
//   "Merriweather",
//   "Montserrat",
//   "Nunito",
//   "Open Sans",
//   "Oswald",
//   "Playfair Display",
//   "Poppins",
//   "Roboto",
//   "Roboto Serif",
//   "Source Sans Pro",
//   "Times New Roman",
//   "Ubuntu",
//   "Verdana",
// ];

// interface RightSideBarProps {
//   printFrameRef: React.RefObject<HTMLIFrameElement>;
// }

// const templates = [
//   {
//     id: 1,
//     name: "Classic Charm",
//     image: "/templates/template1.png",
//   },
//   { id: 2, name: "Artistic Flair", image: "/templates/template2.jpg" },
//   { id: 3, name: "Executive Edge", image: "/templates/template3.jpg" },
//   { id: 4, name: "Fresh Start", image: "/templates/template4.png" },
//   { id: 5, name: "Eco Essence", image: "/templates/template5.png" },
// ];

// const abbrv = {
//   summary: "summary",
//   experience: "exp.",
//   education: "edu.",
//   skills: "skills",
//   projects: "projects",
//   certifications: "certs.",
//   languages: "langs.",
//   profiles: "profiles",
//   basics: "basics",
//   references: "refs.",
//   volunteerings: "vols.",
//   publications: "publs.",
//   awards: "awards",
// };

// interface DraggableSectionProps {
//   section: SectionName;
//   index: number;
// }

// const DraggableSection: React.FC<DraggableSectionProps> = ({
//   section,
//   index,
// }) => (
//   <Draggable draggableId={section} index={index}>
//     {(provided) => (
//       <div
//         ref={provided.innerRef}
//         {...provided.draggableProps}
//         {...provided.dragHandleProps}
//         className="p-1 md:p-2 mb-2 bg-primary flex items-center text-primary-foreground rounded-md shadow-sm text-xs"
//       >
//         <div className="flex-shrink-0 md:mr-2 mr-[2px]">
//           <GripVertical className="h-3 w-3 md:w-4 md:h-4 text-primary-foreground/85" />
//         </div>
//           <p className="truncate text-xs md:text-sm text-black">
//             {abbrv[section].charAt(0).toUpperCase() + abbrv[section].slice(1)}
//           </p>
//       </div>
//     )}
//   </Draggable>
// );

// export default function RightSideBar({ printFrameRef }: RightSideBarProps) {
//   const { theme, setTheme } = useTheme();
//   const [dark, setDark] = useState<boolean>(theme === "dark");
//   const [paperFormat, setPaperFormat] = useState<string>("a4");
//   const [selectedTemplate, setSelectedTemplate] = useState<string>("");
//   const [selectedFont, setSelectedFont] = useState<string>("Arial");
//   const [searchFont, setSearchFont] = useState<string>("");
//   const dispatch = useAppDispatch();
//   const sectionOrder = useAppSelector(
//     (state) => state.rightsidebar.sectionOrder
//   );
//   const fontSize = useAppSelector((state) => state.rightsidebar.fontSize);
//   const templateID = useAppSelector((state) => state.rightsidebar.id);
//   const lineHeight = useAppSelector((state) => state.rightsidebar.lineHeight);
//   const margin = useAppSelector((state) => state.rightsidebar.margin);
//   const font = useAppSelector((state) => state.rightsidebar.font);
//   const id = useAppSelector((state) => state.rightsidebar.id);

//   const isPhoneView = useMediaQuery({ maxWidth: 767 });
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   useEffect(() => {
//     setSelectedFont(font);
//   }, [id]);

//   const onDragEnd = (result: DropResult) => {
//     if (!result.destination) return;

//     const sourceColumn = result.source.droppableId as
//       | "column1"
//       | "column2"
//       | "column3";
//     const destColumn = result.destination.droppableId as
//       | "column1"
//       | "column2"
//       | "column3";

//     const newSectionOrder = {
//       ...sectionOrder,
//       [sourceColumn]: [...sectionOrder[sourceColumn]],
//       [destColumn]: [...sectionOrder[destColumn]],
//     };

//     const [movedItem] = newSectionOrder[sourceColumn].splice(
//       result.source.index,
//       1
//     );

//     newSectionOrder[destColumn].splice(result.destination.index, 0, movedItem);

//     dispatch(
//       updateSectionOrder({
//         column: sourceColumn,
//         order: newSectionOrder[sourceColumn],
//       })
//     );
//     if (sourceColumn !== destColumn) {
//       dispatch(
//         updateSectionOrder({
//           column: destColumn,
//           order: newSectionOrder[destColumn],
//         })
//       );
//     }
//   };

//   const handleDarkModeChange = (checked: boolean) => {
//     setDark(checked);
//     setTheme(checked ? "dark" : "light");
//   };

//   const handleMarginChange = (value: number[]) => {
//     dispatch(UpdateMargin(value[0]));
//   };

//   const handleLineHeightChange = (value: number[]) => {
//     dispatch(UpdateLineHeight(value[0]));
//   };
//   const handleFontSizeChange = (value: number[]) => {
//     dispatch(UpdateFontSize(value[0]));
//   };

//   const handlePaperFormatChange = (value: string) => {
//     setPaperFormat(value);
//     dispatch(UpdatePaperFormat(value));
//   };

//   const handleExport = (format: "JSON" | "PDF") => {
//     console.log(`Exporting as ${format}`);
//   };

//   const filteredFonts = fonts.filter((font) =>
//     font.toLowerCase().includes(searchFont.toLowerCase())
//   );

//   const renderContent = () => (
//     <div className="flex flex-col h-full">
//       <ScrollArea className="flex-grow">
//         <div className="p-4 space-y-6">
//           <div>
//             <Label htmlFor="template-select">Template</Label>
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button
//                   id="template-select"
//                   variant="outline"
//                   className="w-full justify-between mt-2"
//                 >
//                   {selectedTemplate || "Select a template"}
//                   <ChevronRight className="h-4 w-4 opacity-50" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full">
//                 <SheetHeader>
//                   <SheetTitle>Choose a Template</SheetTitle>
//                   <SheetDescription>
//                     Select a template for your resume.
//                   </SheetDescription>
//                 </SheetHeader>
//                 <ScrollArea className="flex-grow mt-4">
//                   <div className="grid grid-cols-2 gap-4 pr-4">
//                     {templates.map((template) => (
//                       <SheetClose asChild key={template.id}>
//                         <Button
//                           variant="outline"
//                           className="h-auto p-0 flex flex-col items-stretch hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
//                           onClick={() => {
//                             setSelectedTemplate(template.name);
//                             dispatch(UpdateId(template.id));
//                           }}
//                         >
//                           <div className="relative w-full pt-[133%] overflow-hidden rounded-t-md">
//                             <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
//                             <img
//                               src={template.image}
//                               alt={`${template.name} template`}
//                               className="absolute inset-0 w-full h-full object-cover"
//                             />
//                           </div>
//                           <div className="p-2 text-center font-medium">
//                             {template.name}
//                           </div>
//                         </Button>
//                       </SheetClose>
//                     ))}
//                   </div>
//                 </ScrollArea>
//               </SheetContent>
//             </Sheet>
//           </div>
//           <div>
//             <Label>Section Order</Label>
//             <DragDropContext onDragEnd={onDragEnd}>
//               <div className="grid grid-cols-3 gap-1 mt-2">
//                 {(["column1", "column2", "column3"] as const).map(
//                   (columnId) => (
//                     <Droppable key={columnId} droppableId={columnId}>
//                       {(provided) => (
//                         <div
//                           ref={provided.innerRef}
//                           {...provided.droppableProps}
//                           className="bg-muted p-2 rounded-md"
//                         >
//                           <h3 className="text-sm font-semibold mb-2">
//                             {columnId === "column1"
//                               ? "Sidebar"
//                               : columnId === "column2"
//                               ? "Main"
//                               : "Unused"}
//                           </h3>
//                           {sectionOrder[columnId].map((section, index) => {
//                             switch (templateID) {
//                               case 4:
//                                 if (
//                                   section === "basics" ||
//                                   section === "profiles"
//                                 ) {
//                                   return null;
//                                 }
//                                 return (
//                                   <DraggableSection
//                                     key={section}
//                                     section={section}
//                                     index={index}
//                                   />
//                                 );
//                               default:
//                                 return (
//                                   <DraggableSection
//                                     key={section}
//                                     section={section}
//                                     index={index}
//                                   />
//                                 );
//                             }
//                           })}
//                           {provided.placeholder}
//                         </div>
//                       )}
//                     </Droppable>
//                   )
//                 )}
//               </div>
//             </DragDropContext>
//           </div>
//           <div>
//             <Label>Font Family</Label>
//             <Sheet>
//               <SheetTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className="w-full justify-between mt-2"
//                 >
//                   <span style={{ fontFamily: selectedFont }}>
//                     {selectedFont}
//                   </span>
//                   <ChevronRight className="h-4 w-4 opacity-50" />
//                 </Button>
//               </SheetTrigger>
//               <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
//                 <SheetHeader>
//                   <SheetTitle>Choose a Font</SheetTitle>
//                   <SheetDescription>
//                     Select a font family for your resume.
//                   </SheetDescription>
//                 </SheetHeader>
//                 <div className="flex-grow flex flex-col overflow-hidden">
//                   <div className="relative my-4">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Search fonts"
//                       value={searchFont}
//                       onChange={(e) => setSearchFont(e.target.value)}
//                       className="pl-8"
//                     />
//                   </div>
//                   <ScrollArea className="flex-grow">
//                     <div className="grid grid-cols-1 gap-2 pr-4">
//                       {filteredFonts.map((font, index) => (
//                         <SheetClose key={index} asChild>
//                           <Button
//                             variant="ghost"
//                             className="w-full justify-start h-16 px-4 hover:bg-accent"
//                             onClick={() => {
//                               setSelectedFont(font);
//                               dispatch(UpdateFont(font));
//                             }}
//                           >
//                             <span
//                               style={{ fontFamily: font }}
//                               className="text-lg"
//                             >
//                               {font}
//                             </span>
//                           </Button>
//                         </SheetClose>
//                       ))}
//                     </div>
//                   </ScrollArea>
//                 </div>
//               </SheetContent>
//             </Sheet>
//           </div>
//           <div>
//             <Label>Font Size</Label>
//             <div className="flex items-center space-x-2 mt-2">
//               <Slider
//                 max={16}
//                 min={10}
//                 step={1}
//                 className="mt-2"
//                 value={[fontSize]}
//                 onValueChange={handleFontSizeChange}
//               />
//               <Input
//                 type="number"
//                 max={16}
//                 min={10}
//                 value={fontSize}
//                 onChange={(e) =>
//                   dispatch(UpdateFontSize(Number(e.target.value)))
//                 }
//                 className="w-16"
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Line Height</Label>
//             <div className="flex items-center space-x-2 mt-2">
//               <Slider
//                 value={[lineHeight]}
//                 max={2}
//                 min={1}
//                 step={0.1}
//                 className="mt-2"
//                 onValueChange={handleLineHeightChange}
//               />
//               <Input
//                 type="number"
//                 value={lineHeight}
//                 step={0.1}
//                 max={2}
//                 min={1}
//                 onChange={(e) =>
//                   dispatch(UpdateLineHeight(Number(e.target.value)))
//                 }
//                 className="w-16"
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Margin (mm)</Label>
//             <div className="flex items-center space-x-2 mt-2">
//               <Slider
//                 value={[margin]}
//                 onValueChange={handleMarginChange}
//                 max={15}
//                 min={5}
//                 step={1}
//                 className="flex-grow"
//               />
//               <Input
//                 type="number"
//                 max={15}
//                 min={5}
//                 value={margin}
//                 onChange={(e) => dispatch(UpdateMargin(Number(e.target.value)))}
//                 className="w-16"
//               />
//             </div>
//           </div>
//           <div>
//             <Label>Paper Format</Label>
//             <Select value={paperFormat} onValueChange={handlePaperFormatChange}>
//               <SelectTrigger className="w-full mt-2">
//                 <SelectValue placeholder="Select format" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="a4">A4</SelectItem>
//                 <SelectItem value="letter">Letter</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <div>
//             <Label>Theme Color</Label>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {[
//                 "#475569",
//                 "#57534e",
//                 "#000000",
//                 "#dc2626",
//                 "#ea580c",
//                 "#ca8a04",
//                 "#65a30d",
//                 "#16a34a",
//                 "#059669",
//                 "#0d9488",
//                 "#0891b2",
//                 "#0284c7",
//                 "#2563eb",
//                 "#4f46e5",
//                 "#7c3aed",
//                 "#9333ea",
//                 "#c026d3",
//                 "#db2777",
//                 "#e11d48",
//               ].map((color) => (
//                 <button
//                   key={color}
//                   className={`w-6 h-6 rounded-full border-2 border-background focus:outline-none focus:ring-2 focus:ring-ring`}
//                   onClick={() => dispatch(UpdateBaseColor(color))}
//                   style={{ backgroundColor: color }}
//                 />
//               ))}
//             </div>
//           </div>
//           <div className="flex items-center space-x-2">
//             <Switch
//               id="dark-mode"
//               checked={dark}
//               onCheckedChange={handleDarkModeChange}
//             />
//             <Label htmlFor="dark-mode">Dark Mode</Label>
//           </div>
//           <div>
//             <button
//               onClick={() => dispatch(ResetStyle())}
//               className="
//     bg-[hsl(var(--background))] 
//     text-[hsl(var(--foreground))] 
//     border-2 
//     border-[hsl(var(--border))] 
//     rounded-[var(--radius)] 
//     px-4 
//     py-2 
//     font-ltwave 
//     cursor-pointer 
//     transition 
//     duration-300 
//     hover:bg-[hsl(var(--secondary))] 
//     hover:text-[hsl(var(--secondary-foreground))]
//   "
//             >
//               Reset
//             </button>
//           </div>
//         </div>
//       </ScrollArea>
//       <div className="p-4 border-t border-border">
//         <Popover>
//           <PopoverTrigger asChild>
//             <Button className="w-full">
//               Export
//               <ChevronDown className="ml-2 h-4 w-4" />
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-56 p-2">
//             <div className="grid gap-y-4">
//               <div
//                 className="w-full cursor-pointer hover:bg-secondary px-2"
//                 onClick={() => handleExport("JSON")}
//               >
//                 Export as JSON
//               </div>
//               <div
//                 className="w-full cursor-pointer hover:bg-secondary px-2"
//                 onClick={() =>
//                   dispatch(DownloadPDF({ printFrameRef: printFrameRef }))
//                 }
//               >
//                 Export as PDF
//               </div>
//             </div>
//           </PopoverContent>
//         </Popover>
//       </div>
//     </div>
//   );

//   return (
//     <>
//       {isPhoneView ? (
//         <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
//           <SheetTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="md:hidden fixed top-4 right-4 z-50 shadow-lg"
//             >
//               <Settings className="h-6 w-6" />
//             </Button>
//           </SheetTrigger>
//           <SheetContent side="right" className="w-[350px] sm:w-[400px]">
//             <SheetHeader>
//               <SheetTitle>Resume Settings</SheetTitle>
//               <SheetDescription>
//                 Customize your resume appearance here.
//               </SheetDescription>
//             </SheetHeader>
//             {renderContent()}
//           </SheetContent>
//         </Sheet>
//       ) : (
//         <div className="w-80 bg-card border-l border-border flex flex-col md:flex">
//           <div className="p-4 border-b border-border">
//             <h2 className="text-lg font-semibold">Styling Options</h2>
//           </div>
//           {renderContent()}
//         </div>
//       )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useMediaQuery } from "react-responsive";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronRight,
  Search,
  GripVertical,
  Settings,
  Download,
} from "lucide-react";
import {
  UpdateBaseColor,
  UpdateFont,
  UpdateFontSize,
  UpdateLineHeight,
  UpdateMargin,
  UpdateId,
  UpdatePaperFormat,
  updateSectionOrder,
  UpdateSeparator,
  UpdateIcons,
  DownloadPDF,
  DownloadJSON,
  ResetStyle,
} from "@/slices/rightsidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { SectionName } from "@/types/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

const fonts = [
  "Arial",
  "Calibri",
  "Cambria",
  "Comfortaa",
  "Courier New",
  "EB Garamond",
  "Fira Sans",
  "Georgia",
  "Helvetica",
  "Lato",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Nunito",
  "Open Sans",
  "Oswald",
  "Playfair Display",
  "Poppins",
  "Roboto",
  "Roboto Serif",
  "Source Sans Pro",
  "Times New Roman",
  "Ubuntu",
  "Verdana",
];

interface RightSideBarProps {
  printFrameRef: React.RefObject<HTMLIFrameElement>;
}

const templates = [
  { id: 1, name: "Classic Charm", image: "/templates/template1.png" },
  { id: 2, name: "Artistic Flair", image: "/templates/template2.jpg" },
  { id: 3, name: "Executive Edge", image: "/templates/template3.jpg" },
  { id: 4, name: "Fresh Start", image: "/templates/template4.png" },
  { id: 5, name: "Eco Essence", image: "/templates/template5.png" },
];

const abbrv = {
  summary: "summary",
  experience: "exp.",
  education: "edu.",
  skills: "skills",
  projects: "projects",
  certifications: "certs.",
  languages: "langs.",
  profiles: "profiles",
  basics: "basics",
  references: "refs.",
  volunteerings: "vols.",
  publications: "publs.",
  awards: "awards",
};

interface DraggableSectionProps {
  section: SectionName;
  index: number;
}

const DraggableSection: React.FC<DraggableSectionProps> = ({
  section,
  index,
}) => (
  <Draggable draggableId={section} index={index}>
    {(provided) => (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className="p-1 md:p-2 mb-2 bg-primary flex items-center text-primary-foreground rounded-md shadow-sm text-xs"
      >
        <div className="flex-shrink-0 md:mr-2 mr-[2px]">
          <GripVertical className="h-3 w-3 md:w-4 md:h-4 text-primary-foreground/85" />
        </div>
        <p className="truncate text-xs md:text-sm text-black">
          {abbrv[section].charAt(0).toUpperCase() + abbrv[section].slice(1)}
        </p>
      </div>
    )}
  </Draggable>
);

export default function RightSideBar({ printFrameRef }: RightSideBarProps) {
  const { theme, setTheme } = useTheme();
  const [dark, setDark] = useState<boolean>(theme === "dark");
  const [paperFormat, setPaperFormat] = useState<string>("a4");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [searchFont, setSearchFont] = useState<string>("");
  const dispatch = useAppDispatch();
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  );
  const fontSize = useAppSelector((state) => state.rightsidebar.fontSize);
  const templateID = useAppSelector((state) => state.rightsidebar.id);
  const lineHeight = useAppSelector((state) => state.rightsidebar.lineHeight);
  const margin = useAppSelector((state) => state.rightsidebar.margin);
  const font = useAppSelector((state) => state.rightsidebar.font);
  const id = useAppSelector((state) => state.rightsidebar.id);
  const separator = useAppSelector((state) => state.rightsidebar.separator);
  const icons = useAppSelector((state) => state.rightsidebar.icons);

  const isPhoneView = useMediaQuery({ maxWidth: 767 });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSelectedFont(font);
  }, [id]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceColumn = result.source.droppableId as
      | "column1"
      | "column2"
      | "column3";
    const destColumn = result.destination.droppableId as
      | "column1"
      | "column2"
      | "column3";

    const newSectionOrder = {
      ...sectionOrder,
      [sourceColumn]: [...sectionOrder[sourceColumn]],
      [destColumn]: [...sectionOrder[destColumn]],
    };

    const [movedItem] = newSectionOrder[sourceColumn].splice(
      result.source.index,
      1
    );
    newSectionOrder[destColumn].splice(result.destination.index, 0, movedItem);

    dispatch(
      updateSectionOrder({
        column: sourceColumn,
        order: newSectionOrder[sourceColumn],
      })
    );
    if (sourceColumn !== destColumn) {
      dispatch(
        updateSectionOrder({
          column: destColumn,
          order: newSectionOrder[destColumn],
        })
      );
    }
  };

  const handleDarkModeChange = (checked: boolean) => {
    setDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  const handleMarginChange = (value: number[]) => {
    dispatch(UpdateMargin(value[0]));
  };

  const handleLineHeightChange = (value: number[]) => {
    dispatch(UpdateLineHeight(value[0]));
  };

  const handleFontSizeChange = (value: number[]) => {
    dispatch(UpdateFontSize(value[0]));
  };

  const handlePaperFormatChange = (value: string) => {
    setPaperFormat(value);
    dispatch(UpdatePaperFormat(value));
  };

  const filteredFonts = fonts.filter((font) =>
    font.toLowerCase().includes(searchFont.toLowerCase())
  );

  const renderContent = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-6">
          <div>
            <Label htmlFor="template-select">Template</Label>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  id="template-select"
                  variant="outline"
                  className="w-full justify-between mt-2"
                >
                  {selectedTemplate || "Select a template"}
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-2xl flex flex-col h-full">
                <SheetHeader>
                  <SheetTitle>Choose a Template</SheetTitle>
                  <SheetDescription>
                    Select a template for your resume.
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="flex-grow mt-4">
                  <div className="grid grid-cols-2 gap-4 pr-4">
                    {templates.map((template) => (
                      <SheetClose asChild key={template.id}>
                        <Button
                          variant="outline"
                          className="h-auto p-0 flex flex-col items-stretch hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          onClick={() => {
                            setSelectedTemplate(template.name);
                            dispatch(UpdateId(template.id));
                          }}
                        >
                          <div className="relative w-full pt-[133%] overflow-hidden rounded-t-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                            <img
                              src={template.image}
                              alt={`${template.name} template`}
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2 text-center font-medium">
                            {template.name}
                          </div>
                        </Button>
                      </SheetClose>
                    ))}
                  </div>
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>
          <div>
            <Label>Section Order</Label>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="grid grid-cols-3 gap-1 mt-2">
                {(["column1", "column2", "column3"] as const).map(
                  (columnId) => (
                    <Droppable key={columnId} droppableId={columnId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="bg-muted p-2 rounded-md"
                        >
                          <h3 className="text-sm font-semibold mb-2">
                            {columnId === "column1"
                              ? "Sidebar"
                              : columnId === "column2"
                              ? "Main"
                              : "Unused"}
                          </h3>
                          {sectionOrder[columnId].map((section, index) => {
                            switch (templateID) {
                              case 4:
                                if (
                                  section === "basics" ||
                                  section === "profiles"
                                ) {
                                  return null;
                                }
                                return (
                                  <DraggableSection
                                    key={section}
                                    section={section}
                                    index={index}
                                  />
                                );
                              default:
                                return (
                                  <DraggableSection
                                    key={section}
                                    section={section}
                                    index={index}
                                  />
                                );
                            }
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )
                )}
              </div>
            </DragDropContext>
          </div>
          <div>
            <Label>Font Family</Label>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                >
                  <span style={{ fontFamily: selectedFont }}>
                    {selectedFont}
                  </span>
                  <ChevronRight className="h-4 w-4 opacity-50" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md flex flex-col h-full">
                <SheetHeader>
                  <SheetTitle>Choose a Font</SheetTitle>
                  <SheetDescription>
                    Select a font family for your resume.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex-grow flex flex-col overflow-hidden">
                  <div className="relative my-4">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search fonts"
                      value={searchFont}
                      onChange={(e) => setSearchFont(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <ScrollArea className="flex-grow">
                    <div className="grid grid-cols-1 gap-2 pr-4">
                      {filteredFonts.map((font, index) => (
                        <SheetClose key={index} asChild>
                          <Button
                            variant="ghost"
                            className="w-full justify-start h-16 px-4 hover:bg-accent"
                            onClick={() => {
                              setSelectedFont(font);
                              dispatch(UpdateFont(font));
                            }}
                          >
                            <span
                              style={{ fontFamily: font }}
                              className="text-lg"
                            >
                              {font}
                            </span>
                          </Button>
                        </SheetClose>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          <div>
            <Label>Font Size</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Slider
                max={16}
                min={10}
                step={1}
                className="mt-2"
                value={[fontSize]}
                onValueChange={handleFontSizeChange}
              />
              <Input
                type="number"
                max={16}
                min={10}
                value={fontSize}
                onChange={(e) =>
                  dispatch(UpdateFontSize(Number(e.target.value)))
                }
                className="w-16"
              />
            </div>
          </div>
          <div>
            <Label>Line Height</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Slider
                value={[lineHeight]}
                max={2}
                min={1}
                step={0.1}
                className="mt-2"
                onValueChange={handleLineHeightChange}
              />
              <Input
                type="number"
                value={lineHeight}
                step={0.1}
                max={2}
                min={1}
                onChange={(e) =>
                  dispatch(UpdateLineHeight(Number(e.target.value)))
                }
                className="w-16"
              />
            </div>
          </div>
          <div>
            <Label>Margin (mm)</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Slider
                value={[margin]}
                onValueChange={handleMarginChange}
                max={15}
                min={5}
                step={1}
                className="flex-grow"
              />
              <Input
                type="number"
                max={15}
                min={5}
                value={margin}
                onChange={(e) => dispatch(UpdateMargin(Number(e.target.value)))}
                className="w-16"
              />
            </div>
          </div>
          <div>
            <Label>Paper Format</Label>
            <Select value={paperFormat} onValueChange={handlePaperFormatChange}>
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a4">A4</SelectItem>
                <SelectItem value="letter">Letter</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Theme Color</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                "#475569",
                "#57534e",
                "#000000",
                "#dc2626",
                "#ea580c",
                "#ca8a04",
                "#65a30d",
                "#16a34a",
                "#059669",
                "#0d9488",
                "#0891b2",
                "#0284c7",
                "#2563eb",
                "#4f46e5",
                "#7c3aed",
                "#9333ea",
                "#c026d3",
                "#db2777",
                "#e11d48",
              ].map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 border-background focus:outline-none focus:ring-2 focus:ring-ring`}
                  onClick={() => dispatch(UpdateBaseColor(color))}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col items-start justify-between space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="separator"
                checked={separator}
                onCheckedChange={(checked) =>
                  dispatch(UpdateSeparator(checked))
                }
              />
              <Label htmlFor="separator"> Separators</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="icons"
                checked={icons}
                onCheckedChange={(checked) => dispatch(UpdateIcons(checked))}
              />
              <Label htmlFor="icons">Icons</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="dark-mode"
                checked={dark}
                onCheckedChange={handleDarkModeChange}
              />
              <Label htmlFor="dark-mode">Dark Mode</Label>
            </div>
          </div>

          <div>
            <Button
              onClick={() => dispatch(ResetStyle())}
              className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-2 border-[hsl(var(--border))] rounded-[var(--radius)] px-4 py-2 font-ltwave cursor-pointer transition duration-300 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]"
            >
              Reset
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );

  const renderDownloadButton = () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Button
          className="w-full rounded-none py-2 px-4 justify-start hover:bg-accent hover:text-accent-foreground"
          onClick={() =>
            dispatch(DownloadPDF({ printFrameRef: printFrameRef }))
          }
        >
          Download PDF
        </Button>
        <Button
          className="w-full rounded-none py-2 px-4 justify-start hover:bg-accent hover:text-accent-foreground"
          onClick={() => dispatch(DownloadJSON())}
        >
          Download JSON
        </Button>
      </PopoverContent>
    </Popover>
  );

  return (
    <>
      {isPhoneView ? (
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 right-4 z-50 shadow-lg"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[350px] sm:w-[400px] flex flex-col"
          >
            <SheetHeader>
              <SheetTitle>Resume Settings</SheetTitle>
              <SheetDescription>
                Customize your resume appearance here.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow overflow-auto">{renderContent()}</div>
            <div className="p-4 border-t border-border mt-auto">
              {renderDownloadButton()}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="w-80 bg-card border-l border-border flex flex-col h-screen">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg font-semibold">Styling Options</h2>
          </div>
          <div className="flex-grow overflow-auto">{renderContent()}</div>
          <div className="p-4 border-t border-border">
            {renderDownloadButton()}
          </div>
        </div>
      )}
    </>
  );
}