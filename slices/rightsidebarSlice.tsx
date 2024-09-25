// redux/rightsidebarSlice.ts
// @ts-ignore
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeStyles } from "@/types/types";

// Define the initial state using that type
const initialState: ResumeStyles = {
  id: 0,
  name: "",
  font: "Roboto",
  fontSize: 12,
  lineHeight: 1,
  margin: 10,
  paperFormat: "a4",
  baseColor: "#000",
};

const MM_TO_PX = 3.78;

const PAGE_FORMATS: {
  a4: { width: number; height: number };
  letter: { width: number; height: number };
} = {
  a4: { width: 210, height: 297 },
  letter: { width: 216, height: 279 },
};

const rightsidebarSlice = createSlice({
  name: "rightsidebar",
  initialState,
  reducers: {
    UpdateId(state, action) {
      state.id = action.payload;
    },
    UpdateFont(state, action) {
      state.font = action.payload;
    },
    UpdateFontSize(state, action) {
      state.fontSize = action.payload;
    },
    UpdateLineHeight(state, action) {
      state.lineHeight = action.payload;
    },
    UpdateMargin(state, action) {
      state.margin = action.payload;
    },
    UpdatePaperFormat(state, action) {
      state.paperFormat = action.payload;
    },
    UpdateBaseColor(state, action) {
      state.baseColor = action.payload;
    },
    DownloadPDF(state, action) {

      const { printFrameRef } = action.payload;

      const pageElements = document.querySelectorAll("[data-page]");
      const pagesHTML = Array.from(pageElements)
        .map((el) => el.outerHTML)
        .join("");

      // Get all styles from the document
      const styles = Array.from(document.styleSheets)
        .map((sheet) => {
          try {
            return Array.from(sheet.cssRules)
              .map((rule) => rule.cssText)
              .join("\n");
          } catch (e) {
            console.warn("Error accessing stylesheet rules", e);
            return "";
          }
        })
        .join("\n");

      // Add print-specific styles
      const printStyles = `
      @page {
        size: ${state.paperFormat};
        margin: 0;
      }
      @media print {
        html, body {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
        }
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
        #resume-pages {
          width: ${PAGE_FORMATS[state.paperFormat].width * MM_TO_PX}px;
          margin: 0 auto;
        }
        /* Hide all other elements */
        body > *:not(#resume-pages) {
          display: none !important;
        }
      }
    `;

      // Wrap all pages in a container with styles
      const wrappedHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>${styles}</style>
          <style>${printStyles}</style>
        </head>
        <body>
          <div id="resume-pages">
            ${pagesHTML}
          </div>
        </body>
      </html>
    `;

      if (!printFrameRef.current) {
        printFrameRef.current = document.createElement("iframe");
        printFrameRef.current.style.display = "none";
        document.body.appendChild(printFrameRef.current);
      }

      const frameDoc = printFrameRef.current.contentDocument;
      frameDoc?.open();
      frameDoc?.write(wrappedHTML);
      frameDoc?.close();

      // Wait for images and other resources to load before printing
      setTimeout(() => {
        if (printFrameRef.current?.contentWindow) {
          printFrameRef.current.contentWindow.print();
        }
      }, 1000);
    }
  },
});

// Export the actions
export const {
  UpdateBaseColor,
  UpdateFont,
  UpdateFontSize,
  UpdateLineHeight,
  UpdateMargin,
  UpdateId,
  UpdatePaperFormat,
  DownloadPDF
} = rightsidebarSlice.actions;

// Export the reducer
export default rightsidebarSlice.reducer;
