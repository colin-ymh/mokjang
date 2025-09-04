import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_VISITATION, Visitation } from '@mokjang/models';

type TargetVisitationState = {
  targetVisitation: Visitation;
};

const initialState: TargetVisitationState = {
  targetVisitation: DEFAULT_VISITATION,
};

const TargetVisitationSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetVisitation(state, action: PayloadAction<Visitation>) {
      state.targetVisitation = action.payload;
    },
  },
});

export const { setTargetVisitation } = TargetVisitationSlice.actions;
export default TargetVisitationSlice.reducer;
