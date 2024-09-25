import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter
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
import { ChevronRight, ChevronDown, Search } from "lucide-react";

import {
  UpdateBaseColor,
  UpdateFont,
  UpdateFontSize,
  UpdateLineHeight,
  UpdateMargin,
  UpdateId,
  UpdatePaperFormat,
} from "@/slices/rightsidebarSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { DownloadPDF } from "@/slices/rightsidebarSlice";

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
  {id : 1 , name: "Professional", image: "/placeholder.svg?height=200&width=150" },
  {id :  2, name: "Creative", image: "/placeholder.svg?height=200&width=150" },
  {id :  3, name: "Executive", image: "/placeholder.svg?height=200&width=150" },
  {id :  4, name: "Technical", image: "/placeholder.svg?height=200&width=150" },
  {id :  5, name: "Academic", image: "/placeholder.svg?height=200&width=150" },
  {id :  6, name: "Student", image: "/placeholder.svg?height=200&width=150" },
];

export default function RightSideBar({ printFrameRef }: RightSideBarProps) {
  const { theme, setTheme } = useTheme();
  const [dark, setDark] = useState<boolean>(theme === "dark");
  const [margin, setMargin] = useState<number>(20);
  const [paperFormat, setPaperFormat] = useState<string>("a4");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [selectedFont, setSelectedFont] = useState<string>("Arial");
  const [searchFont, setSearchFont] = useState<string>("");

  const dispatch = useAppDispatch();

  const handleDarkModeChange = (checked: boolean) => {
    setDark(checked);
    setTheme(checked ? "dark" : "light");
  };

  const handleMarginChange = (value: number[]) => {
    setMargin(value[0]);
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

  const handleExport = (format: "JSON" | "PDF") => {
    console.log(`Exporting as ${format}`);
  };

  const filteredFonts = fonts.filter((font) =>
    font.toLowerCase().includes(searchFont.toLowerCase())
  );

  return (
    <div className="w-80 bg-card border-l border-border flex flex-col  md:flex">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold">Styling Options</h2>
      </div>
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
                      <SheetClose asChild>
                        <Button
                          key={template.name}
                          variant="outline"
                          className="h-auto p-0 flex flex-col items-stretch hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          onClick={() => dispatch(UpdateId(template.id))}
                        >
                          <div className="relative w-full pt-[133%] overflow-hidden rounded-t-md">
                            <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-800" />
                            <img
                              src={template.image}
                              alt={`${template.name} template`}
                              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
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
                      {filteredFonts.map((font) => (
                        <SheetClose asChild>
                          <Button
                            key={font}
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
            <Slider
              defaultValue={[14]}
              max={24}
              min={10}
              step={1}
              className="mt-2"
              onValueChange={handleFontSizeChange}
            />
          </div>
          <div>
            <Label>Line Height</Label>
            <Slider
              defaultValue={[1.5]}
              max={2}
              min={1}
              step={0.1}
              className="mt-2"
              onValueChange={handleLineHeightChange}
            />
          </div>
          <div>
            <Label>Margin (mm)</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Slider
                value={[margin]}
                onValueChange={handleMarginChange}
                max={30}
                min={5}
                step={1}
                className="flex-grow"
              />
              <Input
                type="number"
                value={margin}
                onChange={(e) => setMargin(Number(e.target.value))}
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
                "#3b82f6",
                "#22c55e",
                "#ef4444",
                "#a855f7",
                "#eab308",
                "#ec4899 ",
                "#6366f1",
                "#14b8a6",
              ].map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-full border-2 border-background focus:outline-none focus:ring-2 focus:ring-ring`}
                  onClick={() => dispatch(UpdateBaseColor(color))}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
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
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <Popover>
          <PopoverTrigger asChild>
            <Button className="w-full">
              Export
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="grid gap-y-4">
              <div
                className="w-full cursor-pointer hover:bg-secondary px-2"
                onClick={() => handleExport("JSON")}
              >
                Export as JSON
              </div>
              <div
                className="w-full cursor-pointer hover:bg-secondary px-2"
                onClick={() =>
                  dispatch(DownloadPDF({ printFrameRef: printFrameRef }))
                }
              >
                Export as PDF
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
