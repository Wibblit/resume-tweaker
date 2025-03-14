"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { ResumeStyles} from "@/types/types";
import {
  UpdateSectionOrderLayout,
  UpdateFontSize,
  UpdateIcons,
  UpdateBaseColor,
  updateDateType,
  UpdateSeparator,
} from "@/slices/rightsidebarSlice";
import { useAppDispatch } from "@/hooks/hooks";

// Template imports
import Template1 from "@/templates/Template1";
import Template2 from "@/templates/Template2";
import Template3 from "@/templates/Template3";
import Template4 from "@/templates/Template4";
import Template5 from "@/templates/Template5";
import Template6 from "@/templates/Template6";
import Template7 from "@/templates/Template7";
import Template8 from "@/templates/Template8";
import Template9 from "@/templates/Template9";

interface ResumeData {
  [key: string]: any; // This allows string indexing
  // ...other specific properties
}

interface ResumeDisplayProps {
  resumeStyle: ResumeStyles;
  resumeData: ResumeData;
  templateNumber?: number;
}

const PAGE_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

const MM_TO_PX = 3.7795275591;

export default function ResumeDisplay({
  resumeStyle,
  resumeData,
  templateNumber = 1,
}: ResumeDisplayProps) {
  // Use the template number from props or fall back to resumeStyle.id
  const activeTemplate = templateNumber || resumeStyle.id || 1;
  const dispatch = useAppDispatch();

  dispatch(updateDateType(resumeStyle.datetype));
  dispatch(UpdateSectionOrderLayout(resumeStyle.sectionOrder));
  dispatch(UpdateFontSize(resumeStyle.fontSize));
  dispatch(UpdateBaseColor(resumeStyle.baseColor));
  dispatch(UpdateIcons(resumeStyle.icons));
  dispatch(UpdateSeparator(resumeStyle.separator));
  // Generate one page for each section in the sectionOrder
  const pages =
    resumeStyle.sectionOrder?.sections?.map((section, index) => {
      // Create a new object to hold the content for this page
      const pageContent: ResumeData = {};

      // Process column1 sections
      if (section.column1 && Array.isArray(section.column1)) {
        section.column1.forEach((sectionKey: string) => {
          if (resumeData && sectionKey in resumeData) {
            // Use type assertion to tell TypeScript this access is valid
            pageContent[sectionKey as keyof typeof resumeData] =
              resumeData[sectionKey as keyof typeof resumeData];
          }
        });
      }

      // Process column2 sections
      if (section.column2 && Array.isArray(section.column2)) {
        section.column2.forEach((sectionKey: string) => {
          if (resumeData && sectionKey in resumeData) {
            // Use type assertion to tell TypeScript this access is valid
            pageContent[sectionKey as keyof typeof resumeData] =
              resumeData[sectionKey as keyof typeof resumeData];
          }
        });
      }

      return {
        id: index + 1,
        template: activeTemplate,
        content: pageContent,
      };
    }) || [];

  // Ensure we have at least one page
  if (pages.length === 0) {
    pages.push({
      id: 1,
      template: activeTemplate,
      content: resumeData,
    });
  }

  return (
    <div className="flex flex-col h-full w-full bg-gray-100 dark:bg-gray-900">
      <ScrollArea className="flex-grow">
        <div className="flex flex-col items-center justify-start p-4 pb-20">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="mb-8"
            >
              <div
                id={`page-${page.id}`}
                className="relative bg-white text-foreground shadow-2xl overflow-hidden mx-auto"
                style={{
                  fontFamily: resumeStyle.font,
                  width: `${
                    PAGE_FORMATS[resumeStyle.paperFormat]?.width * MM_TO_PX
                  }px`,
                  height: `${
                    PAGE_FORMATS[resumeStyle.paperFormat]?.height * MM_TO_PX
                  }px`,
                }}
              >
                {renderTemplate(page, index, resumeStyle)}
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

// Helper function to render the appropriate template
function renderTemplate(
  page: { id: number; template: number; content: ResumeData },
  pageIndex: number,
  resumeStyle: ResumeStyles
) {
  const templateProps = {
    content: page.content,
    baseColor: resumeStyle.baseColor,
    fontSize: resumeStyle.fontSize,
    fontFamily: resumeStyle.font,
    lineHeight: resumeStyle.lineHeight,
    margin: resumeStyle.margin,
    pageIndex,
  };

  switch (page.template) {
    case 1:
      return <Template1 {...templateProps} />;
    case 2:
      return <Template2 {...templateProps} />;
    case 3:
      return <Template3 {...templateProps} />;
    case 4:
      return <Template4 {...templateProps} />;
    case 5:
      return <Template5 {...templateProps} />;
    case 6:
      return <Template6 {...templateProps} />;
    case 7:
      return <Template7 {...templateProps} />;
    case 8:
      return <Template8 {...templateProps} />;
    case 9:
      return <Template9 {...templateProps} />;
    default:
      return <Template1 {...templateProps} />;
  }
}
