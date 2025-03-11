// import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// interface FormData {
//   job: string
//   position: string
//   companyName: string
//   resume: File | null
//   jd: string
//   duration: number
//   interviewer: string
// }

// interface InterviewState {
//   questions: string[]
//   formData: FormData | null
// }

// const initialState: InterviewState = {
//   questions: [],
//   formData: null,
// }

// const interviewSlice = createSlice({
//   name: 'interview',
//   initialState,
//   reducers: {
//     setQuestions: (state, action: PayloadAction<string[]>) => {
//       state.questions = action.payload
//     },
//     setFormData: (state, action: PayloadAction<FormData>) => {
//       state.formData = action.payload
//     },
//   },
// })

// export const { setQuestions, setFormData } = interviewSlice.actions
// export default interviewSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FormData {
  job: string;
  position: string;
  companyName: string;
  resume: File | null;
  jd: string;
  duration: number;
  interviewType: "comprehensive" | "adaptive";
  interviewerPosition: string,
  answers?: string[]; // Add the answers field as an optional array of strings
}

interface InterviewState {
  questions: string[];
  formData: FormData | null;
}

const initialState: InterviewState = {
  questions: [],
  formData: null,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<string[]>) => {
      state.questions = action.payload;
    },
    setFormData: (state, action: PayloadAction<FormData>) => {
      state.formData = action.payload;
    },
    addAnswer: (
      state,
      action: PayloadAction<{ questionIndex: number; answer: string }>
    ) => {
      if (state.formData && state.formData.interviewType === "comprehensive") {
        if (!state.formData.answers) {
          state.formData.answers = [];
        }
        state.formData.answers[action.payload.questionIndex] =
          action.payload.answer;
      }
    },
  },
});

export const { setQuestions, setFormData, addAnswer } = interviewSlice.actions;
export default interviewSlice.reducer;