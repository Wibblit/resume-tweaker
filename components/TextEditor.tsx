"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

export function Editor({
  content,
  setContent,
  className,
}: {
  content: string;
  setContent: (content: string) => void;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState<React.ReactNode | null>(
    null
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (content: string) => {
    setContent(content);
  };

  const editorStyle = `
    .sun-editor {
      --tw-border-opacity: 1;
      border-color: hsl(var(--border) / var(--tw-border-opacity));
      --tw-bg-opacity: 1;
      background-color: hsl(var(--background) / var(--tw-bg-opacity));
      --tw-text-opacity: 1;
      color: hsl(var(--foreground) / var(--tw-text-opacity));
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    .sun-editor .se-toolbar {
      background-color: hsl(var(--background) / var(--tw-bg-opacity));
      border-bottom: 1px solid hsl(var(--border) / var(--tw-border-opacity));
      padding: 0.5rem;
      outline: none;
    }

    .sun-editor .se-btn:enabled.active {
      color: hsl(var(--primary));
      background: hsl(var(--secondary));
    }

    .sun-editor .se-btn:enabled:focus,
    .sun-editor .se-btn:enabled:hover {
      background-color: hsl(var(--secondary));
    }

    .sun-editor .se-btn-module-border {
      border: solid 1px hsl(var(--border) / var(--tw-border-opacity));
    }

    .sun-editor .se-btn-tray {
      border: none;
      background: none;
    }

    .sun-editor .se-btn {
      color: hsl(var(--foreground) / 0.7);
      background: none;
      margin: 0 0.125rem;
      padding: 0.25rem;
      border-radius: var(--radius);
      transition: all 0.2s ease;
    }

    .sun-editor .se-btn:hover,
    .sun-editor .se-btn:focus {
      color: hsl(var(--foreground) / var(--tw-text-opacity));
      background-color: hsl(var(--accent) / 0.1);
      box-shadow: none;
    }

    .sun-editor .se-btn-select.active {
      color: hsl(var(--primary) / var(--tw-text-opacity));
      background-color: hsl(var(--accent) / 0.2);
    }

    .sun-editor .se-wrapper {
      background-color: hsl(var(--background) / var(--tw-bg-opacity));
    }

    .sun-editor .se-wrapper-inner {
      background-color: hsl(var(--background) / var(--tw-bg-opacity));
    }

    .sun-editor .se-placeholder {
      color: hsl(var(--muted-foreground) / 0.8);
    }

    .sun-editor .se-wrapper-wysiwyg {
      color: hsl(var(--foreground) / var(--tw-text-opacity));
    }

    .sun-editor .se-wrapper-wysiwyg strong,
    .sun-editor .se-wrapper-wysiwyg b {
      font-weight: 700;
      color: hsl(var(--foreground) / var(--tw-text-opacity));
    }

    .sun-editor .se-wrapper-wysiwyg h1,
    .sun-editor .se-wrapper-wysiwyg h2,
    .sun-editor .se-wrapper-wysiwyg h3 {
      color: hsl(var(--foreground) / var(--tw-text-opacity));
      font-weight: 600;
    }

    .sun-editor .se-wrapper-wysiwyg a {
      color: hsl(var(--primary) / var(--tw-text-opacity));
    }

    .sun-editor .se-wrapper-wysiwyg code {
      background-color: hsl(var(--muted) / 0.3);
      color: hsl(var(--foreground) / var(--tw-text-opacity));
      padding: 0.2em 0.4em;
    }

    .sun-editor .se-resizing-bar {
      background-color: hsl(var(--muted) / 0.3);
    }

    .sun-editor .se-dialog {
      display: none;
    }

    .sun-editor .se-dialog-back {
      display: none;
    }

    .sun-editor .se-btn:hover,
    .sun-editor .se-btn:focus {
      background-color: hsl(var(--accent) / 0.8);
      color: hsl(var(--accent-foreground));
    }
  `;

  const openDialog = (content: React.ReactNode) => {
    setDialogContent(content);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setDialogContent(null);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-0">
        <style>{editorStyle}</style>
        <SunEditor
          setContents={content}
          onChange={handleChange}
          setOptions={{
            buttonList: [
              ["undo", "redo"],
              ["bold", "italic", "underline", "strike"],
              ["removeFormat"],
              ["fontColor", "hiliteColor"],
              ["link", "image", "video"],
              ["align", "list", "lineHeight"],
              ["outdent", "indent"],
              ["table", "horizontalRule"],
              ["fullScreen", "showBlocks", "codeView"],
            ],
            formats: ["p", "h1", "h2", "h3"],
            defaultTag: "p",
            minHeight: "300px",
            height: "auto",
            width: "100%",
            resizingBar: false,
            imageFileInput: true,
            font: ["Arial", "Courier New", "Georgia", "Tahoma", "Verdana"],
            fontSize: [10, 12, 14, 16, 18, 20, 24, 28, 36],
            // dialogBox: {
            //   image: (xhr: any, json: any, core: any) => {
            //     openDialog(
            //       <div>
            //         <h2>Insert Image</h2>
            //         <input
            //           type="file"
            //           accept="image/*"
            //           onChange={(e) => {
            //             if (e.target.files && e.target.files[0]) {
            //               const file = e.target.files[0];
            //               const reader = new FileReader();
            //               reader.onload = (e) => {
            //                 if (e.target) {
            //                   core.insertImage(e.target.result as string);
            //                   closeDialog();
            //                 }
            //               };
            //               reader.readAsDataURL(file);
            //             }
            //           }}
            //         />
            //       </div>
            //     );
            //     return false;
            //   },
            //   // Add other dialog overrides here (link, video, etc.)
            // },
          }}
          defaultValue={content}
          lang="en"
          name="custom-editor"
          placeholder="Start typing..."
        />
      </CardContent>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editor Dialog</DialogTitle>
          </DialogHeader>
          {dialogContent}
        </DialogContent>
      </Dialog>
    </Card>
  );
}