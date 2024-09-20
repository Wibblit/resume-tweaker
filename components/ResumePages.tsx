"use client";

import { useState, useRef, useEffect, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Plus,
  FileDown,
} from "lucide-react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import Template1 from "@/templates/Template1";
import Template2 from "@/templates/Template2";
import Template3 from "@/templates/Template3";
import Template4 from "@/templates/Template4";
import Template5 from "@/templates/Template5";
import Template6 from "@/templates/Template6";
import Template7 from "@/templates/Template7";
import Template8 from "@/templates/Template8";

interface Page {
  id: number;
  template: number;
  content: ResumeContent;
}

interface ResumeContent {
  name: string;
  email: string;
  phone: string;
  summary: string;
  experience: { title: string; company: string; duration: string; description: string }[];
  education: { degree: string; institution: string; year: string }[];
  skills: string[];
}

const PAGE_FORMATS: {
  A4: { width: number; height: number };
  LETTER: { width: number; height: number };
} = {
  A4: { width: 210, height: 297 },
  LETTER: { width: 216, height: 279 },
};

interface ResumePagesProps {
  pageFormat: "A4" | "LETTER";
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}

const defaultResumeContent: ResumeContent = {
  name: "John Doe",
  email: "john@example.com",
  phone: "(123) 456-7890",
  summary: "Experienced professional with a passion for innovation.",
  experience: [
    {
      title: "Software Engineer",
      company: "Tech Corp",
      duration: "2018 - Present",
      description: "Developed and maintained web applications."
    }
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of Technology",
      year: "2018"
    }
  ],
  skills: ["JavaScript", "React", "Node.js", "Python"]
};

export default function ResumePages({
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin
}: ResumePagesProps) {
  const [pages, setPages] = useState<Page[]>([{ id: 1, template: 1, content: defaultResumeContent }]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(100);
  const [history, setHistory] = useState<Page[][]>([[{ id: 1, template: 1, content: defaultResumeContent }]]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const resumeContainerRef = useRef<HTMLDivElement>(null);
  const resumePagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (historyIndex === history.length - 1) {
      setHistory([...history, pages]);
      setHistoryIndex(historyIndex + 1);
    }
  }, [pages]);

  const addPage = () => {
    const newPageId = pages.length + 1;
    const newPages = [...pages, { id: newPageId, template: 1, content: defaultResumeContent }];
    setPages(newPages);
  };

  const deletePage = (id: number) => {
    if (pages.length > 1) {
      const newPages = pages.filter((page) => page.id !== id);
      setPages(newPages);
    }
  };

  const updatePageContent = (id: number, content: Partial<ResumeContent>) => {
    const updatedPages = pages.map((page) =>
      page.id === id ? { ...page, content: { ...page.content, ...content } } : page
    );
    setPages(updatedPages);
  };

  const changeTemplate = (id: number, template: number) => {
    const updatedPages = pages.map((page) =>
      page.id === id ? { ...page, template } : page
    );
    setPages(updatedPages);
  };

  const downloadPDF = async () => {
    const pdf = new jsPDF({
      format: pageFormat.toLowerCase(),
      unit: "mm",
    });

    for (let i = 0; i < pages.length; i++) {
      const pageElement = document.getElementById(`page-${pages[i].id}`);
      if (pageElement) {
        const canvas = await html2canvas(pageElement, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pdf.internal.pageSize.getWidth(),
          pdf.internal.pageSize.getHeight()
        );
      }
    }

    pdf.save("resume.pdf");
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoom = (newZoom: number) => {
    setZoom(Math.max(10, Math.min(newZoom, 200)));
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setPages(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setPages(history[historyIndex + 1]);
    }
  };

  const renderTemplate = (page: Page) => {
    const props = {
      content: page.content,
      baseColor,
      fontSize,
      fontFamily,
      lineHeight,
      margin,
    };

    switch (page.template) {
      case 1:
        return <Template1 {...props} />;
      case 2:
        return <Template2 {...props} />;
      case 3:
        return <Template3 {...props} />;
      case 4:
        return <Template4 {...props} />;
      case 5:
        return <Template5 {...props} photoUrl="/blogImages/wbb.jpg" />;
      case 6:
        return <Template6 {...props} photoUrl="/blogImages/wbb.jpg" />;
      case 7:
        return <Template7 {...props} photoUrl="/blogImages/wbb.jpg" />;
      case 8:
        return <Template8 {...props} photoUrl="/blogImages/wbb.jpg" />;
      default:
        return <Template1 {...props} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-grow relative">
        <div
          className="relative"
          ref={resumeContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            ref={resumePagesRef}
            className="absolute min-w-full"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${zoom / 100})`,
              transformOrigin: "50vw 50vh",
              transition: "transform 0.1s ease-out",
            }}
          >
            {pages.map((page) => (
              <div
                key={page.id}
                className="relative mb-8"
              >
                <div
                  id={`page-${page.id}`}
                  className="bg-white shadow-xl dark:shadow-lg rounded-lg transition-all duration-300"
                  style={{
                    width: `${PAGE_FORMATS[pageFormat].width}mm`,
                    height: `${PAGE_FORMATS[pageFormat].height}mm`,
                    margin: "0 auto",
                  }}
                >
                  {renderTemplate(page)}
                </div>
                {pages.length > 1 && (
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-1 z-10"
                    onClick={() => deletePage(page.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border flex justify-between items-center">
        <div className="flex space-x-2">
          <Button onClick={undo} disabled={historyIndex === 0}>
            <Undo className="h-4 w-4 mr-2" />
            Undo
          </Button>
          <Button onClick={redo} disabled={historyIndex === history.length - 1}>
            <Redo className="h-4 w-4 mr-2" />
            Redo
          </Button>
          <Button onClick={addPage}>
            <Plus className="h-4 w-4 mr-2" />
            Add Page
          </Button>
        </div>
        <div className="flex space-x-2 items-center">
          <Button onClick={() => handleZoom(zoom - 10)}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Slider
            value={[zoom]}
            onValueChange={(value) => handleZoom(value[0])}
            min={10}
            max={200}
            step={10}
            className="w-24"
          />
          <Button onClick={() => handleZoom(zoom + 10)}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button onClick={downloadPDF}>
            <FileDown className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
}