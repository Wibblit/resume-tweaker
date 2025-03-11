// import { cn } from "@/lib/utils";

// const HTMLViewer: React.FC<HTMLViewerProps> = ({
//   content,
//   lineHeight,
//   className,
// }) => {
//   return (
//     <>
//       <style>
//         {`
//           .wysiwyg > * {
//             line-height: ${lineHeight};
//             color: inherit;
//             background-color: transparent;
//           }

//           /* Target specific common HTML tags directly */
//           .wysiwyg h1, 
//           .wysiwyg h2, 
//           .wysiwyg h3, 
//           .wysiwyg p, 
//           .wysiwyg ul, 
//           .wysiwyg ol, 
//           .wysiwyg div, 
//           .wysiwyg span,
//           .wysiwyg li {
//             line-height: ${lineHeight};
//             color: inherit !important;
//             background-color: transparent !important;
//           }

//           /* Avoid affecting nested components by scoping the color */
//           .wysiwyg [style] {
//             color: inherit !important;
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

import { cn } from "@/lib/utils";

interface HTMLViewerProps {
  content: string
  lineHeight: number
  className ?: string
}

// const HTMLViewer: React.FC<HTMLViewerProps> = ({
//   content,
//   lineHeight,
//   className,
// }) => {
//   return (
//     <>
//       <style>
//         {`
//           .wysiwyg > * {
//             line-height: ${lineHeight};
//             color: inherit;
//             background-color: transparent;
//                         font-size: inherit !important;
//           }

//           /* Target specific common HTML tags directly */
//           .wysiwyg h1, 
//           .wysiwyg h2, 
//           .wysiwyg h3, 
//           .wysiwyg p, 
//           .wysiwyg ul, 
//           .wysiwyg ol, 
//           .wysiwyg div, 
//           .wysiwyg span,
//           .wysiwyg li,
//           .wysiwyg hr {
//             line-height: ${lineHeight};
//             color: inherit !important;
//             background-color: transparent !important;
//                         font-size: inherit !important;
//           }

//           /* Ensure the list itself inherits the color */
//           .wysiwyg ul, .wysiwyg ol {
//             color: inherit !important;
//                         font-size: inherit !important;
//           }

//           /* Target the list markers explicitly using ::marker */
//           .wysiwyg ul li::marker,
//           .wysiwyg ol li::marker {
//             color: inherit !important; /* Ensure list markers inherit color */
//                         font-size: inherit !important;
//           }

//           /* Style the list items and list markers explicitly */
//           .wysiwyg ul li {
//             list-style-type: disc !important;  /* Ensure the bullets are shown */
//             color: inherit !important;         /* Ensure the bullet color matches text */
//                         font-size: inherit !important;
//           }

//           .wysiwyg ol li {
//             list-style-type: decimal !important; /* Ensure numbers are shown */
//             color: inherit !important;          /* Ensure the number color matches text */
//                         font-size: inherit !important;
//           }

//             /* Ensure hr tag inherits the color */
//           .wysiwyg hr {
//             border: 0;
//             border-top: 1px solid; /* Adds the horizontal line */
//             border-top-color: inherit !important; /* Ensures the color is inherited */
//             background-color: transparent !important;
//             margin: 0;
//             padding: 0;
//                         font-size: inherit !important;
//           }

//           /* Avoid affecting nested components by scoping the color */
//           .wysiwyg [style] {
//             color: inherit !important;
//                         font-size: inherit !important;
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
          .wysiwyg {
            line-height: ${lineHeight};
            color: inherit;
            background-color: transparent;
            font-size: inherit; /* Inherit the font size from the parent */
          }

          /* Apply inheritance to all direct and nested elements */
          .wysiwyg * {
            color: inherit !important;
            background-color: transparent !important;
            font-size: inherit !important; /* Inherit font size */
            line-height: inherit !important; /* Inherit line height */
          }

          /* Fix for ordered and unordered list alignment */
          .wysiwyg ul,
          .wysiwyg ol {
            padding-left: 1.5em; /* Add space for list markers */
            margin: 0; /* Remove default margin */
          }

          .wysiwyg ul li,
          .wysiwyg ol li {
            margin-left: 0; /* Ensure no extra indentation */
            padding-left: 0; /* Remove padding */
            color: inherit !important;
            font-size: inherit !important;
            line-height: inherit !important;
            list-style-position: outside; /* Ensure markers appear correctly */
          }

          /* Style list markers to inherit color */
          .wysiwyg ul li::marker,
          .wysiwyg ol li::marker {
            color: inherit !important;
            font-size: inherit !important;
          }

          /* Horizontal line style */
          .wysiwyg hr {
            border: none;
            border-top: 1px solid currentColor; /* Use current text color */
            margin: 0;
            padding: 0;
          }

          /* Avoid inline style overrides */
          .wysiwyg [style] {
            font-size: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            background-color: transparent !important;
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
