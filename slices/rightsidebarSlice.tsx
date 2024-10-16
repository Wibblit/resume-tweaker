// redux/rightsidebarSlice.ts
// @ts-ignore
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeStyles } from "@/types/types";
import { SectionName } from "@/types/types";
import { Section } from "lucide-react";

// Define the initial state using that type
const initialState: ResumeStyles = {
  id: 1,
  name: "",
  font: "Helvetica",
  fontSize: 10,
  lineHeight: 1,
  margin: 6,
  paperFormat: "a4",
  baseColor: "#475569",
  icons: true,
  separator: true,
  sectionOrder: {
    column1: [
      "basics",
      "profiles",
      "summary",
      "experience",
      "education",
      "projects",
      "skills",
      "certifications",
    ],
    column2: [],
    column3: [
      "languages",
      "awards",
      "publications",
      "references",
      "volunteerings",
    ],
  },
};

 const CDefaults = [
   {
     id: 1,
     name: "Traditional",
     font: "Arial, sans-serif",
     fontSize: 12,
     lineHeight: 1.5,
     margin: 15,
     baseColor: "#000000",
   },
   {
     id: 2,
     name: "Modern Teal",
     font: "Helvetica, Arial, sans-serif",
     fontSize: 11,
     lineHeight: 1.6,
     margin: 11,
     baseColor: "#008080",
   },
   {
     id: 3,
     name: "Framed Teal",
     font: "Calibri, sans-serif",
     fontSize: 11,
     lineHeight: 1.4,
     margin: 15,
     baseColor: "#008B8B",
   },
   {
     id: 4,
     name: "Green Sidebar",
     font: "Roboto, sans-serif",
     fontSize: 10,
     lineHeight: 1.5,
     margin: 7,
     baseColor: "#0d9488",
   },
   {
     id: 5,
     name: "Centered Title",
     font: "Georgia, serif",
     fontSize: 12,
     lineHeight: 1.6,
     margin: 15,
     baseColor: "#000000",
   },
 ] as const;
const Defaults: Array<ResumeStyles> = [
  {
    id: 1,
    name: "",
    font: "Helvetica",
    fontSize: 10,
    lineHeight: 1,
    margin: 6,
    paperFormat: "a4",
    baseColor: "#475569",
    icons: true,
    separator: true,
    sectionOrder: {
      column1: [
        "basics",
        "profiles",
        "summary",
        "experience",
        "education",
        "projects",
        "skills",
        "certifications",
      ],
      column2: [],
      column3: [
        "languages",
        "awards",
        "publications",
        "references",
        "volunteerings",
      ],
    },
  },
  {
    id: 2,
    name: "",
    font: "Helvetica",
    fontSize: 10,
    lineHeight: 1,
    margin: 6,
    paperFormat: "a4",
    baseColor: "#ca8a04",
    icons: true,
    separator: true,
    sectionOrder: {
      column1: ["basics", "profiles", "summary", "skills", "certifications"],
      column2: ["education", "experience", "projects", "awards"],
      column3: ["languages", "publications", "references", "volunteerings"],
    },
  },
  {
    id: 3,
    name: "",
    font: "Helvetica",
    fontSize: 10,
    lineHeight: 1,
    margin: 6,
    paperFormat: "a4",
    baseColor: "#059669",
    icons: true,
    separator: true,
    sectionOrder: {
      column1: [
        "basics",
        "profiles",
        "summary",
        "experience",
        "education",
        "skills",
      ],
      column2: [
        "projects",
        "languages",
        "awards",
        "publications",
        "certifications",
        "volunteerings",
        "references",
      ],
      column3: [],
    },
  },
  {
    id: 4,
    name: "",
    font: "Helvetica",
    fontSize: 10,
    lineHeight: 1,
    margin: 6,
    paperFormat: "a4",
    baseColor: "#000000",
    icons: true,
    separator: true,
    sectionOrder: {
      column1: [
        "basics",
        "profiles",
        "summary",
        "experience",
        "education",
        "projects",
        "awards",
        "certifications",
      ],
      column2: [
        "skills",
        "languages",
        "publications",
        "volunteerings",
        "references",
      ],
      column3: [],
    },
  },
  {
    id: 5,
    name: "",
    font: "Helvetica",
    fontSize: 10,
    lineHeight: 1,
    margin: 6,
    paperFormat: "a4",
    baseColor: "#57534e",
    icons: true,
    separator: true,
    sectionOrder: {
      column1: [
        "basics",
        "profiles",
        "summary",
        "experience",
        "education",
        "projects",
      ],
      column2: [
        "skills",
        "awards",
        "certifications",
        "languages",
        "publications",
      ],
      column3: ["volunteerings", "references"],
    },
  },
];

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
      // state.baseColor = Defaults[state.id - 1].baseColor;
      // state.font = Defaults[state.id - 1].font;
      // state.fontSize = Defaults[state.id - 1].fontSize;
      // state.lineHeight = Defaults[state.id - 1].lineHeight;
      // state.margin = Defaults[state.id - 1].margin;
      state.sectionOrder = Defaults[state.id - 1].sectionOrder;
    },
    ResetStyle(state, action) {
      if (action.payload === "Resume") {
         state.baseColor = Defaults[state.id - 1].baseColor;
         state.font = Defaults[state.id - 1].font;
         state.fontSize = Defaults[state.id - 1].fontSize;
         state.lineHeight = Defaults[state.id - 1].lineHeight;
         state.margin = Defaults[state.id - 1].margin;
         state.paperFormat = Defaults[state.id - 1].paperFormat;
         state.sectionOrder = Defaults[state.id - 1].sectionOrder;
      } else {
        state.baseColor = CDefaults[state.id - 1].baseColor;
        state.font = CDefaults[state.id - 1].font;
        state.fontSize = CDefaults[state.id - 1].fontSize;
        state.lineHeight = CDefaults[state.id - 1].lineHeight;
        state.margin = CDefaults[state.id - 1].margin;
      }
     
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
    UpdateSectionOrderLayout(state, action) {
      state.sectionOrder = action.payload;
    },
    updateSectionOrder: (
      state,
      action: PayloadAction<{
        column: "column1" | "column2" | "column3";
        order: SectionName[];
      }>
    ) => {
      const { column, order } = action.payload;
      state.sectionOrder[column] = order;
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
    },
    UpdateSeparator(state, action) {
      state.separator = action.payload;
    },
    UpdateIcons(state, action) {
      state.icons = action.payload;
    },
    DownloadJSON() {},
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
  DownloadPDF,
  updateSectionOrder,
  ResetStyle,
  UpdateSeparator,
  UpdateIcons,
  DownloadJSON,
  UpdateSectionOrderLayout,
} = rightsidebarSlice.actions;

// Export the reducer
export default rightsidebarSlice.reducer;
