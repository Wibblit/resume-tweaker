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
import { updatePages } from "@/slices/addPageSlice";
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
  Plus,
  Minus,
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
  addSection,
  removeSection,
} from "@/slices/rightsidebarSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { SectionName } from "@/types/types";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { updatePageVales } from "@/slices/addPageSlice";
import Image from "next/image";

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
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentRoute: string;
}

const templates = [
  { id: 1, name: "Classic Charm", image: "/templates/template1.avif" },
  { id: 2, name: "Artistic Flair", image: "/templates/template2.avif" },
  { id: 3, name: "Executive Edge", image: "/templates/template3.avif" },
  { id: 4, name: "Fresh Start", image: "/templates/template4.avif" },
  { id: 5, name: "Eco Essence", image: "/templates/template5.avif" },
  { id: 6, name: "Naval Professional", image: "/templates/template6.avif" },
  { id: 7, name: "Classic Centered", image: "/templates/template7.avif" },
  { id: 8, name: "Split Modern", image: "/templates/template8.avif" },
  { id: 9, name: "Stanford Minimalist", image: "/templates/template9.avif" },
];

const covertemplate = [
  { id: 1, name: "Classic Professional", image: "/templates/ctemplate1.avif" },
  { id: 2, name: "Modern Header", image: "/templates/ctemplate2.avif" },
  { id: 3, name: "Blue Framed", image: "/templates/ctemplate3.avif" },
  { id: 4, name: "Bold Sidebar", image: "/templates/ctemplate4.avif" },
  { id: 5, name: "Minimalist Centered", image: "/templates/ctemplate5.avif" },
];

const abbrv: Record<SectionName, string> = {
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
  volunteer: "vols.",
  publications: "publs.",
  awards: "awards",
};

export default function EditorRightSideBar({
  printFrameRef,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  currentRoute,
}: RightSideBarProps) {
  const show = currentRoute === "/editor";
  const { theme, setTheme } = useTheme();
  const [dark, setDark] = useState<boolean>(theme === "dark");
  const [paperFormat, setPaperFormat] = useState<string>("a4");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [searchFont, setSearchFont] = useState<string>("");
  const dispatch = useAppDispatch();
  const sectionOrder = useAppSelector(
    (state) => state.rightsidebar.sectionOrder
  )!;
  const fontSize = useAppSelector((state) => state.rightsidebar.fontSize);
  const resumeData = useAppSelector((state) => state.leftsidebar);
  const pages = useAppSelector((state) => state.page.pages);
  const templateID = useAppSelector((state) => state.rightsidebar.id);
  const lineHeight = useAppSelector((state) => state.rightsidebar.lineHeight);
  const margin = useAppSelector((state) => state.rightsidebar.margin);
  const font = useAppSelector((state) => state.rightsidebar.font);
  const id = useAppSelector((state) => state.rightsidebar.id);
  const separator = useAppSelector((state) => state.rightsidebar.separator);
  const icons = useAppSelector((state) => state.rightsidebar.icons);
  const isPhoneView = useMediaQuery({ maxWidth: 767 });

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceDroppableId = result.source.droppableId;
    const sourceIndex = result.source.index;
    const destDroppableId = result.destination.droppableId;
    const destIndex = result.destination.index;
    const pageIdx = result.destination.droppableId.split(".")[0];

    const sourceColumnParts = sourceDroppableId.split(".");
    const destColumnParts = destDroppableId.split(".");

    const sourceColumn = sourceColumnParts[1] as
      | "column1"
      | "column2"
      | "column3"
      | undefined;
    const destColumn = destColumnParts[1] as
      | "column1"
      | "column2"
      | "column3"
      | undefined;

    console.log(sourceColumn, "- source col, ", sourceIndex, "- source indx");

    if (!sourceColumn || !destColumn) {
      console.error("Invalid source or destination column");
      return;
    }

    const newSectionOrder = JSON.parse(JSON.stringify(sectionOrder));

    let sourceSections: SectionName[], destSections: SectionName[];
    let sourceColumnIndex: number, destColumnIndex: number;

    if (sourceColumn === "column3") {
      sourceSections = newSectionOrder.column3;
      sourceColumnIndex = 0;
    } else {
      sourceColumnIndex = Number(sourceColumnParts[0]);
      if (
        isNaN(sourceColumnIndex) ||
        !newSectionOrder.sections[sourceColumnIndex]
      ) {
        console.error("Invalid source section index");
        return;
      }
      sourceSections =
        newSectionOrder.sections[sourceColumnIndex][sourceColumn];
    }

    if (destColumn === "column3") {
      destSections = newSectionOrder.column3;
      destColumnIndex = 0;
    } else {
      destColumnIndex = Number(destColumnParts[0]);
      if (
        isNaN(destColumnIndex) ||
        !newSectionOrder.sections[destColumnIndex]
      ) {
        console.error("Invalid destination section index");
        return;
      }
      destSections = newSectionOrder.sections[destColumnIndex][destColumn];
    }

    if (!Array.isArray(sourceSections) || !Array.isArray(destSections)) {
      console.error("Source or destination sections are not arrays");
      return;
    }

    const [movedItem] = sourceSections.splice(sourceIndex, 1);
    destSections.splice(destIndex, 0, movedItem);

    // Update the source column
    if (sourceColumn === "column3") {
      dispatch(
        updateSectionOrder({
          sectionIndex: sourceColumnIndex,
          column: sourceColumn,
          order: sourceSections,
        })
      );
    } else {
      dispatch(
        updateSectionOrder({
          sectionIndex: sourceColumnIndex,
          column: sourceColumn,
          order: newSectionOrder.sections[sourceColumnIndex][sourceColumn],
        })
      );
    }

    // Update the destination column if it's different from the source
    if (destColumn !== sourceColumn || sourceColumnIndex !== destColumnIndex) {
      if (destColumn === "column3") {
        dispatch(
          updateSectionOrder({
            sectionIndex: destColumnIndex,
            column: destColumn,
            order: destSections,
          })
        );
      } else {
        dispatch(
          updateSectionOrder({
            sectionIndex: destColumnIndex,
            column: destColumn,
            order: newSectionOrder.sections[destColumnIndex][destColumn],
          })
        );
      }
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
              <div className="flex-grow mt-4 overflow-auto">
                <div className="grid grid-cols-2 gap-4 pr-4">
                  {!show
                    ? covertemplate.map((template) => (
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
                              <Image
                                src={template.image}
                                alt={`${template.name} template`}
                                fill
                                className="absolute inset-0 w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                            <div className="p-2 text-center font-medium">
                              {template.name}
                            </div>
                          </Button>
                        </SheetClose>
                      ))
                    : templates.map((template) => (
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
              </div>
            </SheetContent>
          </Sheet>
        </div>
        {show && (
          <div>
            <Label>Section Order</Label>
            <DragDropContext onDragEnd={onDragEnd}>
              {sectionOrder?.sections?.map((section, sectionIndex) => (
                <div key={sectionIndex} className="mb-4">
                  <h3 className="text-sm font-semibold mb-2">
                    Page {sectionIndex + 1}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(["column1", "column2"] as const).map((columnId) => (
                      <Droppable
                        key={`${sectionIndex}.${columnId}`}
                        droppableId={`${sectionIndex}.${columnId}`}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className="bg-muted p-2 rounded-md min-h-[100px]"
                          >
                            <h4 className="text-xs font-medium mb-1">
                              {columnId === "column1" ? "Sidebar" : "Main"}
                            </h4>
                            {section[columnId] &&
                              section[columnId].map((sectionName, index) => (
                                <Draggable
                                  key={sectionName}
                                  draggableId={sectionName}
                                  index={index}
                                >
                                  {(provided) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className="p-1 md:p-2 mb-2 bg-primary flex items-center text-primary-foreground rounded-md shadow-sm text-xs"
                                    >
                                      <GripVertical className="h-3 w-3 md:w-4 md:h-4 text-primary-foreground/85 mr-2" />
                                      <span className="truncate text-xs md:text-sm">
                                        {abbrv[sectionName]
                                          .charAt(0)
                                          .toUpperCase() +
                                          abbrv[sectionName].slice(1)}
                                      </span>
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    ))}
                  </div>
                </div>
              ))}
              <Droppable droppableId="unused.column3">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="bg-muted p-2 rounded-md  mt-4"
                  >
                    <h3 className="text-sm font-semibold mb-2">
                      Unused Sections
                    </h3>

                    {sectionOrder?.column3?.map((section, index) => (
                      <Draggable
                        key={section}
                        draggableId={section}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-1 md:p-2 mb-2 bg-primary flex items-center text-primary-foreground rounded-md shadow-sm text-xs"
                          >
                            <GripVertical className="h-3 w-3 md:w-4 md:h-4 text-primary-foreground/85 mr-2" />
                            <span className="truncate text-xs md:text-sm">
                              {abbrv[section]}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        )}

        <div>
          <Label>Font Family</Label>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-between mt-2">
                <span style={{ fontFamily: selectedFont }}>{selectedFont}</span>
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
                <div className="flex-grow overflow-auto">
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
                </div>
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
              onChange={(e) => dispatch(UpdateFontSize(Number(e.target.value)))}
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
              "#8B1F41",
              "#db2777",
              "#e11d48",
            ].map((color) => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-[0.1px] border-spacing-0.5 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-ring`}
                onClick={() => dispatch(UpdateBaseColor(color))}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between space-y-6">
          {show && (
            <>
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
            </>
          )}
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
            onClick={() =>
              dispatch(ResetStyle(show ? "Resume" : "Cover Letter"))
            }
            className="w-full bg-[hsl(var(--background))] text-[hsl(var(--foreground))] border-2 border-[hsl(var(--border))] rounded-[var(--radius)] px-4 py-2 font-ltwave cursor-pointer transition duration-300 hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]"
          >
            Reset
          </Button>
        </div>
      </div>
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
            <ScrollArea className="flex-grow">{renderContent()}</ScrollArea>
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
          <ScrollArea className="flex-grow">{renderContent()}</ScrollArea>
          <div className="p-4 border-t border-border">
            {renderDownloadButton()}
          </div>
        </div>
      )}
    </>
  );
}
