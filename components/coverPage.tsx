"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Trash2,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Plus,
  FileDown,
  RotateCcw,
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import CoverTemplate1 from "@/templates/covertemplate1";
import { useAppSelector } from "@/hooks/hooks";
import { CoverLetterState } from "@/types/types";

interface Page {
  id: number;
  content: CoverLetterState;
}

const PAGE_FORMATS: {
  a4: { width: number; height: number };
  letter: { width: number; height: number };
} = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

interface CoverLetterPagesProps {
  pageFormat: "a4" | "letter";
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  printFrameRef: React.MutableRefObject<HTMLIFrameElement | null>;
  coverLetterData: CoverLetterState;
  isPhoneView: boolean;
}

const MM_TO_PX = 3.78;

const CoverLetterPage: React.FC<{
  page: Page;
  pageNumber: number;
  pageFormat: "a4" | "letter";
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
}> = ({
  page,
  pageNumber,
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
}) => {
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
      <CoverTemplate1
        content={page.content}
        baseColor={baseColor}
        fontSize={fontSize}
        fontFamily={fontFamily}
        lineHeight={lineHeight}
        margin={margin}
      />
      <div
        className="absolute inset-x-0 border-b border-dashed"
        style={{
          top: `${PAGE_FORMATS[pageFormat].height * MM_TO_PX}px`,
        }}
      />
    </div>
  );
};

export default function CoverLetterPages({
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  printFrameRef,
  coverLetterData,
  isPhoneView,
}: CoverLetterPagesProps) {
  const [pages, setPages] = useState<Page[]>([
    { id: 1, content: coverLetterData },
  ]);
  const [history, setHistory] = useState<Page[][]>([
    [{ id: 1, content: coverLetterData }],
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatedPages = pages.map((page) => ({
      ...page,
      content: coverLetterData,
    }));
    setPages(updatedPages);

    // Update history
    const newHistory = [...history.slice(0, historyIndex + 1), updatedPages];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [coverLetterData]);

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
        <Button onClick={resetView}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex space-x-2">
        <Button onClick={() => zoomOut()}>
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button onClick={() => zoomIn()}>
          <ZoomIn className="h-4 w-4" />
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
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
                        <CoverLetterPage
                          page={page}
                          pageNumber={index + 1}
                          pageFormat={pageFormat}
                          baseColor={baseColor}
                          fontSize={fontSize}
                          fontFamily={fontFamily}
                          lineHeight={lineHeight}
                          margin={margin}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
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
