import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface FormData {
  job: string
  position: string
  companyName: string
  resume: File | null
  jd: string
  duration: number
  interviewer: string
}

interface InterviewState {
  questions: string[]
  formData: FormData | null
}

const initialState: InterviewState = {
  questions: [],
  formData: null,
}

const interviewSlice = createSlice({
  name: 'interview',
  initialState,
  reducers: {
    setQuestions: (state, action: PayloadAction<string[]>) => {
      state.questions = action.payload
    },
    setFormData: (state, action: PayloadAction<FormData>) => {
      state.formData = action.payload
    },
  },
})

export const { setQuestions, setFormData } = interviewSlice.actions
export default interviewSlice.reducer