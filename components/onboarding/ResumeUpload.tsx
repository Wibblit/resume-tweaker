"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { createWorker } from "tesseract.js";
import pdfToImages from "@/lib/pdfToImages";
import { ResumeData } from "@/types/types";
import { useToast } from "@/hooks/use-toast";

interface ResumeUploadProps {
  onResumeData: (data: Partial<ResumeData>) => void;
}

export default function ResumeUpload({ onResumeData }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isOcrInProgress, setIsOcrInProgress] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const workerRef = useRef<Tesseract.Worker | null>(null);
  const { toast } = useToast();

  const initializeWorker = async () => {
    if (!workerRef.current) {
      workerRef.current = await createWorker({
        logger: (message) => {
          if ("progress" in message) {
            setOcrProgress(message.progress);
          }
        },
      });
      await workerRef.current.load();
      await workerRef.current.loadLanguage("eng");
      await workerRef.current.initialize("eng");
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsOcrInProgress(true);
    setOcrProgress(0);
    setIsDialogOpen(false);

    try {
      await initializeWorker();
      const worker = workerRef.current;
      if (!worker) throw new Error("OCR worker not initialized");

      let ocrText = "";

      if (uploadedFile.type === "application/pdf") {
        const pdfUrl = URL.createObjectURL(uploadedFile);
        const imageUrls = await pdfToImages(pdfUrl);

        for (const imageUrl of imageUrls) {
          const response = await worker.recognize(imageUrl);
          ocrText += " " + response.data.text;
        }
      }
        
        console.log(ocrText, 'ocr text')

      // Send OCR text to API for parsing
      const response = await fetch("/api/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: ocrText }),
      });

      if (!response.ok) {
        toast({
          title: "Error",
          description: "Failed to parse resume.",
        });
      }

      const parsedData = await response.json();
      console.log("parsed data: ", parsedData)
      onResumeData(parsedData.cleanedData);
    } catch (error) {
      console.error("Error processing resume:", error);
    } finally {
      setIsOcrInProgress(false);
      setOcrProgress(1);
    }
  };

  return (
    <Card className="p-6 mb-6 bg-card/50 backdrop-blur-sm border shadow-sm hover:shadow-md transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Quick Resume Upload</h3>
            <p className="text-sm text-muted-foreground">
              Upload your resume to auto-fill the form
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2"
                disabled={isOcrInProgress}
              >
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">Upload Resume</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <div className="space-y-4 p-2">
                <h2 className="text-xl font-semibold">Upload Your Resume</h2>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF file to automatically fill in your information
                </p>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  disabled={isOcrInProgress}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>File:</span>
              <span className="font-medium text-foreground">{file.name}</span>
            </div>
          </motion.div>
        )}

        {isOcrInProgress && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <Label>Processing resume...</Label>
            <Progress value={ocrProgress * 100} className="h-2" />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{(ocrProgress * 100).toFixed(0)}% complete</span>
            </div>
          </motion.div>
        )}
      </div>
    </Card>
  );
}
