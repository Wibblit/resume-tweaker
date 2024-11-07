import React from "react";
import { cn } from "@/lib/utils";

interface HTMLViewerProps {
  content: string;
  lineHeight: number; // Pass lineHeight as a prop to the HTMLViewer
  className?: string;
}

// const HTMLViewer: React.FC<HTMLViewerProps> = ({ content, lineHeight, className}) => {
//   return (
//     <>
//       <style>
//         {`
//           .wysiwyg h1, .wysiwyg h2, .wysiwyg h3, 
//           .wysiwyg p, .wysiwyg ul, .wysiwyg ol, 
//           .wysiwyg div, .wysiwyg span {
//             line-height: ${lineHeight}; /* Apply the line-height dynamically */
//           }
//         `}
//       </style>
//       <div
//         className={cn("wysiwyg", className)}
//         dangerouslySetInnerHTML={{ __html: content }}
//       ></div>
//     </>
//   );
// };

const HTMLViewer: React.FC<HTMLViewerProps> = ({
  content,
  lineHeight,
  className,
}) => {
  return (
    <>
      <style>
        {`
          .wysiwyg h1, .wysiwyg h2, .wysiwyg h3, 
          .wysiwyg p, .wysiwyg ul, .wysiwyg ol, 
          .wysiwyg div, .wysiwyg span {
            line-height: ${lineHeight}; /* Apply the line-height dynamically */
            color: inherit; /* Ensure all text inherits the parent's color */
          }

          /* Ensure all child elements inherit the color */
          .wysiwyg * {
            color: inherit !important; /* Override any inline styles */
          }
        `}
      </style>
      <div
        className={cn("wysiwyg", className)}
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>
    </>
  );
};


export default HTMLViewer;
