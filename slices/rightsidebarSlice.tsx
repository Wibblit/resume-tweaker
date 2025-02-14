import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeStyles, SectionName } from "@/types/types";
import { addPage, deletePage } from "./addPageSlice";
import { Defaults } from "@/data/ResumeDefaults";
import { CDefaults } from "@/data/CoverDefaults";
import {
  AddCustomSection,
  RenameCustomSection,
  DeleteCustomSection,
} from "./leftsidebarSlice";

// Define the initial state using that type
const initialState: ResumeStyles = {
  id: 1,
  name: "",
  font: "Helvetica",
  fontSize: 10,
  lineHeight: 1,
  margin: 6,
  datetype: "MMM 'YY",
  paperFormat: "a4",
  baseColor: "#475569",
  icons: true,
  separator: true,
  sectionOrder: {
    sections: [
      {
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
      },
    ],
    column3: ["languages", "awards", "publications", "references", "volunteer"],
  },
  sections: [
    "basics",
    "profiles",
    "summary",
    "experience",
    "education",
    "projects",
    "skills",
    "certifications",
    "languages",
    "awards",
    "publications",
    "references",
    "volunteer",
  ],
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
    NewSection(state, action) {
      //console.log(state.sectionOrder);
      state.sectionOrder?.column3.push(action.payload.toLowerCase());
      state.sections.push(action.payload);
    },
    UpdateSections(state, action) {
      state.sections = action.payload;
    },
    CustomSectionRename(state, action) {
      const { oldName, newName } = action.payload;
      //console.log(oldName, newName);
      const replacer = (arr: string[]): string[] => {
        const newArray = arr.map((item) =>
          item === oldName ? newName.toLowerCase() : item
        );
        return newArray;
      };

      if (state.sections.includes(oldName))
        state.sections = replacer(state.sections);

      //console.log(state.sections);

      if (state.sectionOrder.column3.includes(oldName))
        state.sectionOrder.column3 = replacer(state.sectionOrder.column3);
      else {
        for (let i = 0; i < state.sectionOrder.sections.length; i++) {
          const { column1, column2 } = state.sectionOrder.sections[i];
          if (column1.includes(oldName)) {
            state.sectionOrder.sections[i].column1 = replacer(column1);
            break;
          } else if (column2.includes(oldName)) {
            state.sectionOrder.sections[i].column2 = replacer(column2);
            break;
          }
        }
      }
    },

    CustomSectionDelete(state, action) {
      const replacer = (arr: string[]): string[] => {
        const newarr = arr.filter((item) => item !== action.payload);
        return newarr;
      };

      if (state.sections.includes(action.payload))
        state.sections = replacer(state.sections);
      if (state.sectionOrder.column3.includes(action.payload))
        state.sectionOrder.column3 = replacer(state.sectionOrder.column3);
      else {
        for (let i = 0; i < state.sectionOrder.sections.length; i++) {
          const { column1, column2 } = state.sectionOrder.sections[i];
          if (column1.includes(action.payload)) {
            state.sectionOrder.sections[i].column1 = replacer(column1);
            break;
          } else if (column2.includes(action.payload)) {
            state.sectionOrder.sections[i].column2 = replacer(column2);
            break;
          }
        }
      }
    },

    ResetStyle(state, action) {
      //console.log(state.id);
      if (action.payload === "Resume") {
        state.baseColor = Defaults[state.id - 1].baseColor;
        state.font = Defaults[state.id - 1].font;
        state.fontSize = Defaults[state.id - 1].fontSize;
        state.lineHeight = Defaults[state.id - 1].lineHeight;
        state.margin = Defaults[state.id - 1].margin;
        state.paperFormat = Defaults[state.id - 1].paperFormat;
        state.sectionOrder = Defaults[state.id - 1]?.sectionOrder;
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
        sectionIndex: number;
        column: "column1" | "column2" | "column3";
        order: SectionName[];
      }>
    ) => {
      const { sectionIndex, column, order } = action.payload;
      if (column === "column3") {
        state.sectionOrder.column3 = order;
      } else {
        state.sectionOrder.sections[sectionIndex][column] = order;
      }
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
    addSection: (state) => {
      state.sectionOrder.sections.push({ column1: [], column2: [] });
    },
    removeSection: (state, action: PayloadAction<number>) => {
      state.sectionOrder.sections.splice(action.payload - 1, 1);
    },
    updateDateType(state, action) {
      state.datetype = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addPage, (state, action) => {
      state.sectionOrder.sections.push({ column1: [], column2: [] });
    }),
      builder.addCase(deletePage, (state, action) => {
        state.sectionOrder.column3.push(
          ...state.sectionOrder.sections[action.payload - 1].column1,
          ...state.sectionOrder.sections[action.payload - 1].column2
        );
        state.sectionOrder.sections.splice(action.payload - 1, 1);
      }),
      builder.addCase(AddCustomSection, (state, action) => {
        // Call the NewSection reducer logic with the payload from AddCustomSection
        rightsidebarSlice.caseReducers.NewSection(state, action);
      }),
      builder.addCase(RenameCustomSection, (state, action) => {
        rightsidebarSlice.caseReducers.CustomSectionRename(state, action);
      }),
      builder.addCase(DeleteCustomSection, (state, action) => {
        rightsidebarSlice.caseReducers.CustomSectionDelete(state, action);
      });
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
  addSection,
  removeSection,
  UpdateSections,
  updateDateType,
} = rightsidebarSlice.actions;

// Export the reducer
export default rightsidebarSlice.reducer;
