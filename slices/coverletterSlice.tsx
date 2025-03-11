import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoverLetterState } from "@/types/types";

const initialState: CoverLetterState = {
  salutation: "", // Initialize salutation as empty
  date: "", // Initialize date as empty
  senderInfo : "",
  recipientInfo: "", // Initialize recipient information as empty
  subject: "", // Initialize subject as empty
  opening: "", // Initialize opening section as empty
  interestInPosition: "", // Initialize interest in position as empty
  professionalSummary: "", // Initialize professional summary as empty
  keyAchievements: "", // Initialize key achievements as empty
  culturalFit: "", // Initialize cultural fit as empty
  closing: "", // Initialize closing section as empty
  signOff: "", // Initialize sign-off as empty
};


const coverletterSlice = createSlice({
  name: "coverletter",
  initialState,
  reducers: {
    updateCoverLetter(state, action: PayloadAction<Partial<CoverLetterState>>) {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateCoverLetter } = coverletterSlice.actions;
export default coverletterSlice.reducer;
