import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_EDUCATION_SESSION, EducationSession } from '@mokjang/models';

type TargetEducationSessionState = {
  targetEducationSession: EducationSession;
};

const initialState: TargetEducationSessionState = {
  targetEducationSession: DEFAULT_EDUCATION_SESSION,
};

const TargetEducationSessionSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetEducationSession(state, action: PayloadAction<EducationSession>) {
      state.targetEducationSession = action.payload;
    },
  },
});

export const { setTargetEducationSession } =
  TargetEducationSessionSlice.actions;
export default TargetEducationSessionSlice.reducer;
