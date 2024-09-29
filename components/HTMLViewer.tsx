import React from "react";

const HTMLViewer = ({ content }: { content: string }) => {
  return (
    <>
      {/* Injecting styles specifically for bold and italic tags */}
      <style>
        {`
          .editor-content strong, .editor-content b {
            font-weight: 700;
            font-style: normal; /* Ensure it's not italic */
          }

          .editor-content em, .editor-content i {
            font-style: italic;
          }

          .editor-content {
            font-family: Arial, sans-serif; /* Or your preferred font */
            font-weight: 400; /* Normal font weight for regular text */
          }
        `}
      </style>

      {/* Rendering the HTML content */}
      <div
        className="editor-content"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </>
  );
};

export default HTMLViewer;
