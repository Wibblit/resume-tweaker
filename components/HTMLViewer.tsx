import React from "react";
import { cn } from "@/lib/utils";

const HTMLViewer = ({ content }: { content: string }) => {
  return (
    <>
      <div
        className="wysiwyg"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </>
  );
};

export default HTMLViewer;