"use client";

import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPage,
  deletePage,
  updatePages,
  undo,
  redo,
  updatePageVales,
} from "../slices/addPageSlice";
import ThemeAwareLogo from "./ThemeAwareLogo";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Plus,
  RotateCcw,
  Menu,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import Template1 from "@/templates/Template1";
import Template2 from "@/templates/Template2";
import Template3 from "@/templates/Template3";
import Template4 from "@/templates/Template4";
import Template5 from "@/templates/Template5";
import Template6 from "@/templates/Template6";
import { useAppSelector } from "@/hooks/hooks";
import { ResumeData } from "@/types/types";
import { Skeleton } from "./ui/skeleton";
import { RootState } from "@/store";

interface Page {
  id: number;
  template: number;
  content: ResumeData;
}

const PAGE_FORMATS: {
  a4: { width: number; height: number };
  letter: { width: number; height: number };
} = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

interface ResumePagesProps {
  pageFormat: "a4" | "letter";
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  printFrameRef: React.MutableRefObject<HTMLIFrameElement | null>;
  resumeData: ResumeData;
  isPhoneView: boolean;
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const MM_TO_PX = 3.78;

const ResumePage: React.FC<{
  page: Page;
  pageNumber: number;
  pageIndex: number;
  pageFormat: "a4" | "letter";
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}> = ({
  page,
  pageNumber,
  pageIndex,
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}) => {
  const renderTemplate = (page: Page, pageIndex: number) => {
    const props = {
      content: page.content,
      baseColor,
      fontSize,
      fontFamily,
      lineHeight,
      margin,
      pageIndex,
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
        return <Template5 {...props} />;
      case 6:
        return <Template6 {...props} />;
      default:
        return <Template1 {...props} />;
    }
  };

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
      <div className="absolute -top-7 left-0 font-sans font-semibold text-white">
        Page {pageNumber}
      </div>
      {renderTemplate(page, pageIndex)}
      <div
        className="absolute inset-x-0 border-b border-dashed"
        style={{
          top: `${PAGE_FORMATS[pageFormat].height * MM_TO_PX}px`,
        }}
      />
    </div>
  );
};

export default function ResumePages({
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  printFrameRef,
  resumeData,
  isPhoneView,
  isPanelOpen,
  setIsPanelOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isLoading,
}: ResumePagesProps) {
  const dispatch = useDispatch();
  const { pages, historyIndex, history } = useSelector(
    (state: RootState) => state.page
  );
  const pageSectionOrders = useAppSelector(
    (state) => state.rightsidebar.sectionOrder.sections
  );
  const templateNumber: number = useAppSelector(
    (state) => state.rightsidebar.id
  );
  const resumeName = useAppSelector(
    (state) => state.currentResume
  ).currResumeName;
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const addButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    dispatch(updatePageVales({ pageSectionOrders, resumeData, templateNumber }));
  }, [templateNumber, resumeData, dispatch, pageSectionOrders]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === "ZOOM_IN") transformRef.current?.zoomIn(0.2);
      if (event.data.type === "ZOOM_OUT") transformRef.current?.zoomOut(0.2);
      if (event.data.type === "CENTER_VIEW") transformRef.current?.centerView();
      if (event.data.type === "RESET_VIEW") {
        resetView();
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [transformRef]);

  function addNewPage() {
    dispatch(addPage({ template: templateNumber, content: {} }));
    setTimeout(() => {
      const newPageId = pages.length + 1;
      const newPageElement = document.getElementById(`page-${newPageId}`);
      if (newPageElement && scrollAreaRef.current) {
        const scrollViewport = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]"
        );
        if (scrollViewport) {
          const containerRect = scrollViewport.getBoundingClientRect();
          const newPageRect = newPageElement.getBoundingClientRect();
          const scrollTop =
            newPageRect.top - containerRect.top + scrollViewport.scrollTop;

          scrollViewport.scrollTo({
            top: scrollTop,
            behavior: "smooth",
          });
        }
      }
    }, 100);
  }

  const deletePageById = (id: number) => {
    console.log("delete page id yo", id)
    dispatch(deletePage(id));
  };

  const undoAction = () => {
    dispatch(undo());
  };

  const redoAction = () => {
    dispatch(redo());
  };

  const resetView = () => {
    if (transformRef.current) {
      transformRef.current.resetTransform();
      setTimeout(() => {
        transformRef.current?.centerView(isPhoneView ? 0.6 : 1);
      }, 50);
    }
  };

  const renderControls = (zoomIn: () => void, zoomOut: () => void) => (
    <>
      <div className="flex space-x-2">
        <Button onClick={undoAction} disabled={historyIndex === 0}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          onClick={redoAction}
          disabled={historyIndex === history.length - 1}
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button ref={addButtonRef} onClick={addNewPage}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => zoomOut()}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={resetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button onClick={() => zoomIn()}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </>
  );

  const renderSkeleton = () => (
    <div className="flex flex-col items-center justify-start p-4">
      <Skeleton
        className="mb-8"
        style={{
          width: `${PAGE_FORMATS[pageFormat].width * MM_TO_PX}px`,
          height: `${PAGE_FORMATS[pageFormat].height * MM_TO_PX}px`,
        }}
      />
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <div className="p-4 border-b border-border flex justify-between md:justify-center items-center bg-background">
        {isPhoneView && (
          <AnimatePresence>
            {
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="z-50 md:hidden"
              >
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setIsPanelOpen(!isPanelOpen)}
                  className="rounded-md shadow-md bg-background border border-border"
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </motion.div>
            }
          </AnimatePresence>
        )}
        <div className="flex items-center space-x-3">
          <ThemeAwareLogo />
          <Separator orientation="vertical" className="h-6" />
          <span className="font-semibold text-lg">{resumeName}</span>
        </div>
        {isPhoneView && (
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden fixed top-4 right-4 z-50 shadow-lg"
            >
              <Settings className="h-6 w-6" />
            </Button>
          </div>
        )}
      </div>
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div
          className={`p-4 pb-20 ${isPhoneView ? "flex justify-center" : ""}`}
        >
          <TransformWrapper
            ref={transformRef}
            centerOnInit
            maxScale={2}
            minScale={0.4}
            initialScale={isPhoneView ? 0.6 : 0.8}
            limitToBounds={false}
            wheel={{ step: 0.2 }}
            panning={{ disabled: !isHovering }}
          >
            {({ zoomIn, zoomOut, resetTransform }) => (
              <>
                <TransformComponent
                  wrapperClass="!w-full !h-full"
                  contentClass="flex flex-col items-center justify-start"
                >
                  {isLoading ? (
                    renderSkeleton()
                  ) : (
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
                            pageIndex={index}
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
                              onClick={() => deletePageById(page.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  )}
                </TransformComponent>
                {isPhoneView && (
                  <motion.div
                    initial={{ y: 0 }}
                    animate={{ y: 0 }}
                    className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg rounded-t-lg"
                  >
                    <div className="p-4">
                      <div className="flex justify-around">
                        {renderControls(zoomIn, zoomOut)}
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </TransformWrapper>
        </div>
      </ScrollArea>
      {!isPhoneView && (
        <div className="bottom-0 left-0 right-0 p-4 border-t border-border flex flex-col gap-2 bg-background">
          <div className="flex justify-between items-center">
            {renderControls(
              () => transformRef.current?.zoomIn(0.2),
              () => transformRef.current?.zoomOut(0.2)
            )}
          </div>
        </div>
      )}
    </div>
  );
}
