import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_EDUCATION,
  Education,
} from '../../../models/education/education';

type TargetEducationState = {
  targetEducation: Education;
};

const initialState: TargetEducationState = {
  targetEducation: DEFAULT_EDUCATION,
};

const TargetEducationSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetEducation(state, action: PayloadAction<Education>) {
      state.targetEducation = action.payload;
    },
  },
});

export const { setTargetEducation } = TargetEducationSlice.actions;
export default TargetEducationSlice.reducer;
