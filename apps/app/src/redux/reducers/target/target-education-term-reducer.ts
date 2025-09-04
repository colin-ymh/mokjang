import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_EDUCATION_TERM, EducationTerm } from '@mokjang/models';

type TargetEducationTermState = {
  targetEducationTerm: EducationTerm;
};

const initialState: TargetEducationTermState = {
  targetEducationTerm: DEFAULT_EDUCATION_TERM,
};

const TargetEducationTermSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetEducationTerm(state, action: PayloadAction<EducationTerm>) {
      state.targetEducationTerm = action.payload;
    },
  },
});

export const { setTargetEducationTerm } = TargetEducationTermSlice.actions;
export default TargetEducationTermSlice.reducer;
