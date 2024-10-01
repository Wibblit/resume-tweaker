import React from "react";

interface HTMLViewerProps {
  content: string;
  lineHeight: number; // Pass lineHeight as a prop to the HTMLViewer
}

const HTMLViewer: React.FC<HTMLViewerProps> = ({ content, lineHeight }) => {
  return (
    <>
      <style>
        {`
          .wysiwyg h1, .wysiwyg h2, .wysiwyg h3, 
          .wysiwyg p, .wysiwyg ul, .wysiwyg ol, 
          .wysiwyg div, .wysiwyg span {
            line-height: ${lineHeight}; /* Apply the line-height dynamically */
          }
        `}
      </style>
      <div
        className="wysiwyg"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </>
  );
};

export default HTMLViewer;
