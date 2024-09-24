"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Trash2, Undo, Redo, ZoomIn, ZoomOut, Plus, FileDown } from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import Template1 from "@/templates/Template1"
import Template2 from "@/templates/Template2" 
import Template3 from "@/templates/Template3"
import Template4 from "@/templates/Template4"
import Template5 from "@/templates/Template5"
import Template6 from "@/templates/Template6"
import Template7 from "@/templates/Template7"
import Template8 from "@/templates/Template8"
import { generateResume } from "@/lib/downloadPDF"

interface Page {
  id: number
  template: number
  content: ResumeContent
}

interface ResumeContent {
  name: string
  email: string
  phone: string
  summary: string
  experience: { title: string; company: string; duration: string; description: string }[]
  education: { degree: string; institution: string; year: string }[]
  skills: string[]
  metadata: {
    typography: {
      font: {
        family: string
        variants: string[]
      }
    }
  }
}

const PAGE_FORMATS: {
  A4: { width: number; height: number }
  LETTER: { width: number; height: number }
} = {
  A4: { width: 210, height: 297 },
  LETTER: { width: 216, height: 279 },
}

interface ResumePagesProps {
  pageFormat: "A4" | "LETTER"
  baseColor: string
  fontSize: number
  fontFamily: string
  lineHeight: number
  margin: number
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
      description: "Developed and maintained web applications.",
    },
  ],
  education: [
    {
      degree: "B.S. in Computer Science",
      institution: "University of Technology",
      year: "2018",
    },
  ],
  skills: ["JavaScript", "React", "Node.js", "Python"],
  metadata: {
    typography: {
      font: {
        family: "Roboto",
        variants: ["regular", "bold"]
      }
    }
  }
}

const MM_TO_PX = 3.78

const ResumePage: React.FC<{
  page: Page
  pageNumber: number
  pageFormat: "A4" | "LETTER"
  baseColor: string
  fontSize: number
  fontFamily: string
  lineHeight: number
  margin: number
}> = ({ page, pageNumber, pageFormat, baseColor, fontSize, fontFamily, lineHeight, margin }) => {
  const renderTemplate = (page: Page) => {
    const props = {
      content: page.content,
      baseColor,
      fontSize,
      fontFamily,
      lineHeight,
      margin,
    }

    switch (page.template) {
      case 1:
        return <Template1 {...props} />
      case 2:
        return <Template2 {...props} />
      case 3:
        return <Template3 {...props} />
      case 4:
        return <Template4 {...props} />
      case 5:
        return <Template5 {...props} photoUrl="/blogImages/wbb.jpg" />
      case 6:
        return <Template6 {...props} photoUrl="/blogImages/wbb.jpg" />
      case 7:
        return <Template7 {...props} photoUrl="/blogImages/wbb.jpg" />
      case 8:
        return <Template8 {...props} photoUrl="/blogImages/wbb.jpg" />
      default:
        return <Template1 {...props} />
    }
  }

  return (
    <div
      id={`page-${page.id}`}
      data-page={pageNumber}
      className="relative bg-white text-foreground shadow-2xl mb-8"
      style={{
        fontFamily,
        width: `${PAGE_FORMATS[pageFormat].width * MM_TO_PX}px`,
        minHeight: `${PAGE_FORMATS[pageFormat].height * MM_TO_PX}px`,
      }}
    >
      <div className="absolute -top-7 left-0 font-bold text-white">Page {pageNumber}</div>
      {renderTemplate(page)}
      <div
        className="absolute inset-x-0 border-b border-dashed"
        style={{
          top: `${PAGE_FORMATS[pageFormat].height * MM_TO_PX}px`,
        }}
      />
    </div>
  )
}

export default function ResumePages({
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}: ResumePagesProps) {
  const [pages, setPages] = useState<Page[]>([{ id: 1, template: 1, content: defaultResumeContent }])
  const [history, setHistory] = useState<Page[][]>([[{ id: 1, template: 1, content: defaultResumeContent }]])
  const [historyIndex, setHistoryIndex] = useState<number>(0)
  const [isHovering, setIsHovering] = useState(false)
  const transformRef = useRef<ReactZoomPanPinchRef>(null)

  useEffect(() => {
    if (historyIndex === history.length - 1) {
      setHistory([...history, pages])
      setHistoryIndex(historyIndex + 1)
    }
  }, [pages])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return

      if (event.data.type === "ZOOM_IN") transformRef.current?.zoomIn(0.2)
      if (event.data.type === "ZOOM_OUT") transformRef.current?.zoomOut(0.2)
      if (event.data.type === "CENTER_VIEW") transformRef.current?.centerView()
      if (event.data.type === "RESET_VIEW") {
        transformRef.current?.resetTransform(0)
        setTimeout(() => transformRef.current?.centerView(0.8, 0), 10)
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [transformRef])

  const addPage = () => {
    const newPageId = pages.length + 1
    const lastPage = pages[pages.length - 1]
    const newPages = [...pages, { id: newPageId, template: lastPage.template, content: defaultResumeContent }]
    setPages(newPages)
  }

  const deletePage = (id: number) => {
    if (pages.length > 1) {
      const newPages = pages.filter((page) => page.id !== id)
      setPages(newPages)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      // Capture HTML content of all pages
      const pageElements = document.querySelectorAll('[data-page]');
      const pagesHTML = Array.from(pageElements).map(el => el.outerHTML).join('');

      // Get all styles from the document
      const styles = Array.from(document.styleSheets)
        .map(sheet => {
          try {
            return Array.from(sheet.cssRules)
              .map(rule => rule.cssText)
              .join('\n');
          } catch (e) {
            console.warn('Error accessing stylesheet rules', e);
            return '';
          }
        })
        .join('\n');

      // Wrap all pages in a container with styles
      const wrappedHTML = `
        <html>
          <head>
            <style>${styles}</style>
          </head>
          <body>
            <div id="resume-pages" style="width: ${PAGE_FORMATS[pageFormat].width * MM_TO_PX}px;">
              ${pagesHTML}
            </div>
          </body>
        </html>
      `;

      const result = await generateResume(wrappedHTML, pages.length, pageFormat);
      
      if (!result.success || !result.pdf) {
        throw new Error(result.error || "Failed to generate PDF");
      }

      // Convert Base64 to Blob
      const byteCharacters = atob(result.pdf);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "resume.pdf";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };
  
  


  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setPages(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setPages(history[historyIndex + 1])
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <ScrollArea className="flex-grow">
        <div className="p-4 pb-20">
          <TransformWrapper
            ref={transformRef}
            centerOnInit
            maxScale={2}
            minScale={0.4}
            initialScale={0.8}
            limitToBounds={false}
            wheel={{ step: 0.2 }}
            panning={{ disabled: !isHovering }}
          >
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="flex flex-col items-center justify-start"
            >
              <AnimatePresence>
                {pages.map((page, index) => (
                  <motion.div
                    key={page.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                  >
                    <ResumePage
                      page={page}
                      pageNumber={index + 1}
                      pageFormat={pageFormat}
                      baseColor={baseColor}
                      fontSize={fontSize}
                      fontFamily={fontFamily}
                      lineHeight={lineHeight}
                      margin={margin}
                    />
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
                  </motion.div>
                ))}
              </AnimatePresence>
            </TransformComponent>
          </TransformWrapper>
        </div>
      </ScrollArea>
      <div className="fixed bottom-0 left-0 right-0 p-4 border-t border-border flex flex-col gap-2 bg-background">
        <div className="flex justify-between items-center">
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
          <div className="flex space-x-2">
            <Button onClick={() => transformRef.current?.zoomOut(0.2)}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button onClick={() => transformRef.current?.resetTransform(0)}>Reset View</Button>
            <Button onClick={() => transformRef.current?.zoomIn(0.2)}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button onClick={handleDownloadPDF}>
              <FileDown className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}