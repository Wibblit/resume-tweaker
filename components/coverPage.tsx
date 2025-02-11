import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Menu,
  Settings,
  LogOut,
  Loader,
  Save,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ReactZoomPanPinchRef,
  TransformComponent,
  TransformWrapper,
} from "react-zoom-pan-pinch";
import { useAppSelector } from "@/hooks/hooks";
import { CoverLetterState } from "@/types/types";
import ThemeAwareLogo from "./ThemeAwareLogo";
import CoverTemplate1 from "@/templates/coverlettertemplates/covertemplate1";
import CoverTemplate2 from "@/templates/coverlettertemplates/covertemplate2";
import CoverTemplate3 from "@/templates/coverlettertemplates/covertemplate3";
import CoverTemplate4 from "@/templates/coverlettertemplates/covertemplate4";
import CoverTemplate5 from "@/templates/coverlettertemplates/covertemplate5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel
} from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import { savecoverData } from "@/actions/saveCoverLetterData";
import { useToast } from "@/hooks/use-toast";

interface Page {
  id: number;
  template: number;
  content: CoverLetterState;
}

export const PAGE_FORMATS = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

const MM_TO_PX = 3.78;

interface CoverLetterPageProps {
  page: Page;
  pageNumber: number;
  pageFormat: "a4" | "letter";
  baseColor: string;
  fontSize: number;
  fontFamily: string;
  lineHeight: number;
  margin: number;
  isLoading: boolean;
}

const CoverLetterPage: React.FC<CoverLetterPageProps> = ({
  page,
  pageNumber,
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  isLoading,
}) => {
  const renderTemplate = (page: Page) => {
    const props = {
      content: page.content,
      baseColor,
      fontSize,
      fontFamily,
      lineHeight,
      margin,
      pageFormat,
    };

    switch (page.template) {
      case 1:
        return <CoverTemplate1 {...props} />;
      case 2:
        return <CoverTemplate2 {...props} />;
      case 3:
        return <CoverTemplate3 {...props} />;
      case 4:
        return <CoverTemplate4 {...props} />;
      case 5:
        return <CoverTemplate5 {...props} />;
      default:
        return <CoverTemplate1 {...props} />;
    }
  };

  const renderSkeleton = () => (
    <div className="flex flex-col items-center justify-start p-4">
      <Skeleton
        className="mb-8"
        style={{
          width: `${PAGE_FORMATS[pageFormat]?.width * MM_TO_PX}px`,
          height: `${PAGE_FORMATS[pageFormat]?.height * MM_TO_PX}px`,
        }}
      />
    </div>
  );

  return (
    <div
      id={`page-${page.id}`}
      data-page={pageNumber}
      className="relative bg-white text-primary shadow-2xl mb-8"
      style={{
        fontFamily,
        width: `${PAGE_FORMATS[pageFormat]?.width * MM_TO_PX}px`,
        minHeight: `${PAGE_FORMATS[pageFormat]?.height * MM_TO_PX}px`,
      }}
    >
      {isLoading ? (
        renderSkeleton()
      ) : (
        renderTemplate(page)
      )}
      <div
        className="absolute inset-x-0 border-b border-dashed"
        style={{
          top: `${PAGE_FORMATS[pageFormat]?.height * MM_TO_PX}px`,
        }}
      />
    </div>
  );
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
  isPanelOpen: boolean;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

export default function Component({
  pageFormat,
  baseColor,
  fontSize,
  fontFamily,
  lineHeight,
  margin,
  printFrameRef,
  coverLetterData,
  isPhoneView,
  isPanelOpen,
  setIsPanelOpen,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  isLoading,
}: CoverLetterPagesProps) {
  const templateNumber: number = useAppSelector(
    (state) => state.rightsidebar.id
  );
  const [pages, setPages] = useState<Page[]>([
    { id: 1, template: templateNumber, content: coverLetterData },
  ]);
  const [history, setHistory] = useState<Page[][]>([
    [{ id: 1, template: templateNumber, content: coverLetterData }],
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const currCoverName = useAppSelector(
    (state) => state?.currentCoverLetter?.currCoverName
  );
  const { toast } = useToast();
  const CoverLetterData = useAppSelector((state) => state.coverletter);
  const ResumeAppearance = useAppSelector((state) => state.rightsidebar);
  const { currCoverId } = useAppSelector((state) => state.currentCoverLetter);
  const [saving, setSaving] = useState<boolean>(false);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await savecoverData(
        CoverLetterData,
        ResumeAppearance,
        currCoverId
      );
      if (response.status === 429) {
        toast({
          title: "Whoa there! You've hit the rate limit.",
          description: "Please slow down and try again in a few minutes.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: "Success",
        description: "The cover letter has been saved successfully.",
      });
      setSaving(false);
    } catch (error) {
      setSaving(false);
      toast({
        title: "Error",
        description: "Failed to save the cover letter.",
        variant: "destructive",
      });
    }
  };
  
  const handleSaveAndExit = async () => {
    await handleSave()
    router.push('/home')
  }

  useEffect(() => {
    const updatedPages = pages.map((page) => ({
      ...page,
      template: templateNumber,
      content: coverLetterData,
    }));
    setPages(updatedPages);

    const newHistory = [...history.slice(0, historyIndex + 1), updatedPages];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [templateNumber, coverLetterData]);

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
        <Button onClick={undo} disabled={historyIndex === 0}>
          <Undo className="h-4 w-4" />
        </Button>
        <Button onClick={redo} disabled={historyIndex === history.length - 1}>
          <Redo className="h-4 w-4" />
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

  return (
    <div className="flex flex-col h-[calc(100vh-0px)]">
      <div className="p-4 border-b border-border flex justify-between md:justify-center items-center bg-background">
        {isPhoneView && (
          <AnimatePresence>
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
          </AnimatePresence>
        )}
        <div className="flex items-center space-x-3 justify-center w-full md:justify-between">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="z-10">
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you sure you want to exit?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Would you like to save your changes before exiting? Any
                        unsaved changes will be lost.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSaveAndExit}>
                        Save and Exit
                      </AlertDialogAction>
                      
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent>
                <p>Exit editor</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center justify-center">
            <ThemeAwareLogo />
            <Separator orientation="vertical" className="h-6 mx-2" />
            <span className="font-semibold text-lg">{currCoverName}</span>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="z-10"
                  onClick={handleSave}
                >
                  {saving ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save resume</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        {isPhoneView && (
          <div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden fixed top-4 right-4 z-50"
            >
              <Settings className="h-6 w-4" />
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
                    <Skeleton
                      className="mb-8"
                      style={{
                        width: `${PAGE_FORMATS[pageFormat]?.width * MM_TO_PX}px`,
                        height: `${PAGE_FORMATS[pageFormat]?.height * MM_TO_PX}px`,
                      }}
                    />
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
                          <CoverLetterPage
                            page={page}
                            pageNumber={index + 1}
                            pageFormat={pageFormat}
                            baseColor={baseColor}
                            fontSize={fontSize}
                            fontFamily={fontFamily}
                            lineHeight={lineHeight}
                            margin={margin}
                            isLoading={isLoading}
                          />
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