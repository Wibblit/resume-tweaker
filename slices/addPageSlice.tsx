import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResumeData, SectionName } from "@/types/types";
import { UpdateId } from "./rightsidebarSlice";

interface Page {
  id: number;
  template: number;
  content: ResumeData;
}

interface PageState {
  pages: Page[];
  history: Page[][];
  historyIndex: number;
}

const initialState: PageState = {
  pages: [
    {
      id: 1,
      template: 0,
      content: {} as ResumeData,
    },
  ],
  history: [
    [
      {
        id: 1,
        template: 0,
        content: {} as ResumeData,
      },
    ],
  ],
  historyIndex: 0,
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    addPage: (
      state,
      action: PayloadAction<{ template: number; content: ResumeData }>
    ) => {
      const newPageId = state.pages.length + 1;
      const newPage = {
        id: newPageId,
        template: action.payload.template,
        content: action.payload.content,
      };
      state.pages.push(newPage);
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        [...state.pages],
      ];
      state.historyIndex = state.history.length - 1;
    },
    deletePage: (state, action: PayloadAction<number>) => {
      console.log(action.payload, "index came \n", state.pages.length, "length")
      if (state.pages.length > 1) {
        state.pages = state.pages.filter((page) => page.id !== action.payload)
        state.history = [
          ...state.history.slice(0, state.historyIndex + 1),
          [...state.pages],
        ];
        state.historyIndex = state.history.length - 1;
      }
    },
    updatePages: (
      state,
      action: PayloadAction<{ template: number; content: ResumeData }>
    ) => {
      state.pages = state.pages.map((page) => ({
        ...page,
        template: action.payload.template,
        content: action.payload.content,
      }));
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        [...state.pages],
      ];
      state.historyIndex = state.history.length - 1;
    },
    undo: (state) => {
      if (state.historyIndex > 0) {
        state.historyIndex -= 1;
        state.pages = state.history[state.historyIndex];
      }
    },
    redo: (state) => {
      if (state.historyIndex < state.history.length - 1) {
        state.historyIndex += 1;
        state.pages = state.history[state.historyIndex];
      }
    },
    // updatePageVales: (state, action: PayloadAction<{ pageSectionOrders: [{
    //   column1: SectionName[];
    //   column2: SectionName[];
    // }], resumeData: ResumeData
    // }>) => {
    //   console.log(action.payload.pageSectionOrders, "ye toh deklete na moork")
    //   state.pages.map((page, idx) => {
    //     const cols = { ...action.payload.pageSectionOrders[idx].column1, ...action.payload.pageSectionOrders[idx].column2 }
    //     console.log(cols, "yoji cols h bhai!")
    //     page.content = "";
    //   })
    //   // state.pages[action.payload.indx].content = action.payload.content;
    //   // state.pages[action.payload.indx].template = action.payload.templateNumber;
    // }
    updatePageVales: (
      state,
      action: PayloadAction<{
        pageSectionOrders: { column1: SectionName[]; column2: SectionName[] }[];
        resumeData: ResumeData;
        templateNumber: number;
      }>
    ) => {
      const { resumeData, pageSectionOrders, templateNumber } = action.payload;
      if (pageSectionOrders?.length !== state.pages.length) {
        for (let i = 0; i < pageSectionOrders?.length - state.pages.length; i++) {
          const newPage = {
            id: state.pages.length + 1,
            template: templateNumber,
            content: {} as ResumeData, // Ensure it's initialized correctly
          };
          state.pages.push(newPage);
        }
      }
      state.pages.forEach((page, idx) => {
        if (idx < action.payload.pageSectionOrders?.length) {
          const { column1 = [], column2 = [] } = action.payload.pageSectionOrders[idx];
          const cols = [...column1, ...column2];
          cols.forEach((sec) => {
            const content = resumeData[sec] || {}; // Fallback to empty object if undefined
            page.content = { ...page.content, [sec]: content };
          });
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(UpdateId, (state, action: PayloadAction<number>) => {
      state.pages = state.pages.map((page) => ({
        ...page,
        template: action.payload, 
      }));
      state.history = [
        ...state.history.slice(0, state.historyIndex + 1),
        [...state.pages],
      ];
      state.historyIndex = state.history.length - 1;
    });
  }
});

export const { addPage, deletePage, updatePages, undo, redo, updatePageVales } =
  pageSlice.actions;

export default pageSlice.reducer;
