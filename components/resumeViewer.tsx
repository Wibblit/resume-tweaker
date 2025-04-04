// "use client";

// import { ResumeStyles } from "@/types/types";
// import {
//   UpdateSectionOrderLayout,
//   UpdateFontSize,
//   UpdateIcons,
//   UpdateBaseColor,
//   updateDateType,
//   UpdateSeparator,
// } from "@/slices/rightsidebarSlice";
// import { useAppDispatch } from "@/hooks/hooks";

// // Template imports
// import Template1 from "@/templates/Template1";
// import Template2 from "@/templates/Template2";
// import Template3 from "@/templates/Template3";
// import Template4 from "@/templates/Template4";
// import Template5 from "@/templates/Template5";
// import Template6 from "@/templates/Template6";
// import Template7 from "@/templates/Template7";
// import Template8 from "@/templates/Template8";
// import Template9 from "@/templates/Template9";
// import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
// import { Button } from "./ui/button";
// import {
//   TransformWrapper,
//   TransformComponent,
//   useControls,
// } from "react-zoom-pan-pinch";
// import { Maximize, ExternalLink } from "lucide-react";

// interface ResumeData {
//   [key: string]: any; // This allows string indexing
//   // ...other specific properties
// }

// interface ResumeDisplayProps {
//   resumeStyle: ResumeStyles;
//   resumeData: ResumeData;
//   templateNumber?: number;
//   className?: string;
//   handleCustomizeInEditorPreprocessor: () => void;
// }

// const PAGE_FORMATS = {
//   a4: { width: 210, height: 297 },
//   letter: { width: 216, height: 279 },
// };

// const MM_TO_PX = 3.7795275591;

// export default function ResumeDisplay({
//   resumeStyle,
//   resumeData,
//   templateNumber = 1,
//   className,
//   handleCustomizeInEditorPreprocessor,
// }: ResumeDisplayProps) {
//   // Use the template number from props or fall back to resumeStyle.id
//   const activeTemplate = templateNumber || resumeStyle.id || 1;
//   const dispatch = useAppDispatch();

//   dispatch(updateDateType(resumeStyle.datetype));
//   dispatch(UpdateSectionOrderLayout(resumeStyle.sectionOrder));
//   dispatch(UpdateFontSize(resumeStyle.fontSize));
//   dispatch(UpdateBaseColor(resumeStyle.baseColor));
//   dispatch(UpdateIcons(resumeStyle.icons));
//   dispatch(UpdateSeparator(resumeStyle.separator));
//   // Generate one page for each section in the sectionOrder
//   const pages =
//     resumeStyle.sectionOrder?.sections?.map((section, index) => {
//       // Create a new object to hold the content for this page
//       const pageContent: ResumeData = {};

//       // Process column1 sections
//       if (section.column1 && Array.isArray(section.column1)) {
//         section.column1.forEach((sectionKey: string) => {
//           if (resumeData && sectionKey in resumeData) {
//             // Use type assertion to tell TypeScript this access is valid
//             pageContent[sectionKey as keyof typeof resumeData] =
//               resumeData[sectionKey as keyof typeof resumeData];
//           }
//         });
//       }

//       // Process column2 sections
//       if (section.column2 && Array.isArray(section.column2)) {
//         section.column2.forEach((sectionKey: string) => {
//           if (resumeData && sectionKey in resumeData) {
//             // Use type assertion to tell TypeScript this access is valid
//             pageContent[sectionKey as keyof typeof resumeData] =
//               resumeData[sectionKey as keyof typeof resumeData];
//           }
//         });
//       }

//       return {
//         id: index + 1,
//         template: activeTemplate,
//         content: pageContent,
//       };
//     }) || [];

//   // Ensure we have at least one page
//   if (pages.length === 0) {
//     pages.push({
//       id: 1,
//       template: activeTemplate,
//       content: resumeData,
//     });
//   }
//   const Controls = () => {
//     const { zoomIn, zoomOut, resetTransform } = useControls();
//     return (
//       <div className="flex items-center justify-between w-full z-50">
//         <div className="flex gap-2 z-50">
//           <Button
//             variant="secondary"
//             size="icon"
//             onClick={() => zoomIn()}
//             className="bg-background/95 shadow-md"
//             aria-label="Zoom In"
//           >
//             <ZoomIn className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="secondary"
//             size="icon"
//             onClick={() => zoomOut()}
//             className="bg-background/95 shadow-md"
//           >
//             <ZoomOut className="h-4 w-4" />
//           </Button>
//           <Button
//             variant="secondary"
//             size="icon"
//             onClick={() => resetTransform()}
//             className="bg-background/95 shadow-md"
//           >
//             <RotateCcw className="h-4 w-4" />
//           </Button>
//         </div>
//         <div className="flex items-center justify-center gap-2">
//           <Button>
//             <Maximize />
//           </Button>
//           <Button onClick={handleCustomizeInEditorPreprocessor}>
//             <ExternalLink className="mr-2" /> Customize in Editor
//           </Button>
//         </div>
//       </div>
//     );
//   };

//   // ...existing dispatch and pages code...

//   return (
//     <div className=" w-full h-full">
//       <TransformWrapper
//         initialScale={0.8}
//         minScale={0.5}
//         maxScale={3}
//         centerOnInit={true}
//         limitToBounds={false}
//         smooth={true}
//       >
//         <>
//           <Controls />
//           <TransformComponent
//             wrapperClass="!w-full !h-full"
//             contentClass="!w-full !h-full flex flex-col items-center justify-start py-8"
//           >
//             <div className="p-8">
//               {pages.map((page, index) => (
//                 <div
//                   key={page.id}
//                   id={`page-${page.id}`}
//                   data-page={page.id}
//                   className="relative bg-white text-foreground shadow-2xl overflow-hidden mx-auto mb-8"
//                   style={{
//                     fontFamily: resumeStyle.font,
//                     width: `${
//                       PAGE_FORMATS[resumeStyle.paperFormat]?.width * MM_TO_PX
//                     }px`,
//                     height: `${
//                       PAGE_FORMATS[resumeStyle.paperFormat]?.height * MM_TO_PX
//                     }px`,
//                   }}
//                 >
//                   {renderTemplate(page, index, resumeStyle)}
//                 </div>
//               ))}
//             </div>
//           </TransformComponent>
//         </>
//       </TransformWrapper>
//     </div>
//   );
// }

// // Helper function to render the appropriate template
// function renderTemplate(
//   page: { id: number; template: number; content: ResumeData },
//   pageIndex: number,
//   resumeStyle: ResumeStyles
// ) {
//   const templateProps = {
//     content: page.content,
//     baseColor: resumeStyle.baseColor,
//     fontSize: resumeStyle.fontSize,
//     fontFamily: resumeStyle.font,
//     lineHeight: resumeStyle.lineHeight,
//     margin: resumeStyle.margin,
//     pageIndex,
//   };

//   switch (page.template) {
//     case 1:
//       return <Template1 {...templateProps} />;
//     case 2:
//       return <Template2 {...templateProps} />;
//     case 3:
//       return <Template3 {...templateProps} />;
//     case 4:
//       return <Template4 {...templateProps} />;
//     case 5:
//       return <Template5 {...templateProps} />;
//     case 6:
//       return <Template6 {...templateProps} />;
//     case 7:
//       return <Template7 {...templateProps} />;
//     case 8:
//       return <Template8 {...templateProps} />;
//     case 9:
//       return <Template9 {...templateProps} />;
//     default:
//       return <Template1 {...templateProps} />;
//   }
// }

"use client";

import type { ResumeStyles } from "@/types/types";
import {
  UpdateSectionOrderLayout,
  UpdateFontSize,
  UpdateIcons,
  UpdateBaseColor,
  updateDateType,
  UpdateSeparator,
} from "@/slices/rightsidebarSlice";
import { useAppDispatch } from "@/hooks/hooks";
import { useState } from "react";

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
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  ExternalLink,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

interface ResumeData {
  [key: string]: any; // This allows string indexing
  // ...other specific properties
}

interface ResumeDisplayProps {
  resumeStyle: ResumeStyles;
  resumeData: ResumeData;
  templateNumber?: number;
  className?: string;
  handleCustomizeInEditorPreprocessor: () => void;
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
  className,
  handleCustomizeInEditorPreprocessor,
}: ResumeDisplayProps) {
  // Use the template number from props or fall back to resumeStyle.id
  const activeTemplate = templateNumber || resumeStyle.id || 1;
  const dispatch = useAppDispatch();
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
      <div className="flex items-center justify-between w-full z-50">
        <div className="flex gap-2 z-50">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => zoomIn()}
            className="bg-background/95 shadow-md"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => zoomOut()}
            className="bg-background/95 shadow-md"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => resetTransform()}
            className="bg-background/95 shadow-md"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button onClick={toggleFullScreen}>
            <Maximize />
          </Button>
          <Button onClick={handleCustomizeInEditorPreprocessor}>
            <ExternalLink className="mr-2" /> Customize in Editor
          </Button>
        </div>
      </div>
    );
  };

  // Render resume pages
  const renderResumePages = () => {
    return pages.map((page, index) => (
      <div
        key={page.id}
        id={`page-${page.id}`}
        data-page={page.id}
        className="relative bg-white text-foreground shadow-2xl overflow-hidden mx-auto mb-8"
        style={{
          fontFamily: resumeStyle.font,
          width: `${PAGE_FORMATS[resumeStyle.paperFormat]?.width * MM_TO_PX}px`,
          height: `${
            PAGE_FORMATS[resumeStyle.paperFormat]?.height * MM_TO_PX
          }px`,
        }}
      >
        {renderTemplate(page, index, resumeStyle)}
      </div>
    ));
  };

  if (isFullScreen) {
    return (
      <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
        <div className="absolute top-4 right-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="bg-background/95 shadow-md"
            onClick={toggleFullScreen}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto w-full h-full flex justify-center items-start pt-16">
          <div className="w-[90%] max-w-[90%] overflow-y-auto">
            {renderResumePages()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <TransformWrapper
        initialScale={0.8}
        minScale={0.5}
        maxScale={3}
        centerOnInit={true}
        limitToBounds={false}
        smooth={true}
      >
        <>
          <Controls />
          <TransformComponent
            wrapperClass="!w-full !h-full"
            contentClass="!w-full !h-full flex flex-col items-center justify-start py-8"
          >
            <div className="p-8">{renderResumePages()}</div>
          </TransformComponent>
        </>
      </TransformWrapper>
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