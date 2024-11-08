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

// const HTMLViewer: React.FC<HTMLViewerProps> = ({
//   content,
//   lineHeight,
//   className,
// }) => {
//   return (
//     <>
//       <style>
//         {`
//           .wysiwyg, .wysiwyg * {
//             line-height: ${lineHeight}; /* Apply the line-height dynamically */
//             color: inherit !important; /* Force inherit color for all nested elements */
//             background-color: transparent !important; /* Ensure no background color is set */
//           }

//           .wysiwyg h1, .wysiwyg h2, .wysiwyg h3, 
//           .wysiwyg p, .wysiwyg ul, .wysiwyg ol, 
//           .wysiwyg div, .wysiwyg span {
//             color: inherit !important; /* Ensure specific tags inherit the color */
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

// export default HTMLViewer;

const HTMLViewer: React.FC<HTMLViewerProps> = ({
  content,
  lineHeight,
  className,
}) => {
  return (
    <>
      <style>
        {`
          .wysiwyg > * {
            line-height: ${lineHeight};
            color: inherit;
            background-color: transparent;
          }

          /* Target specific common HTML tags directly */
          .wysiwyg h1, 
          .wysiwyg h2, 
          .wysiwyg h3, 
          .wysiwyg p, 
          .wysiwyg ul, 
          .wysiwyg ol, 
          .wysiwyg div, 
          .wysiwyg span,
          .wysiwyg li {
            line-height: ${lineHeight};
            color: inherit !important;
            background-color: transparent !important;
          }

          /* Avoid affecting nested components by scoping the color */
          .wysiwyg [style] {
            color: inherit !important;
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
