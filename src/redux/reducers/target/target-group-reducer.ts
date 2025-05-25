import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_GROUP, Group } from '@/models/management/management';

type TargetGroupState = {
  targetGroup: Group;
};

const initialState: TargetGroupState = {
  targetGroup: DEFAULT_GROUP,
};

const TargetGroupSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetGroup(state, action: PayloadAction<Group>) {
      state.targetGroup = action.payload;
    },
  },
});

export const { setTargetGroup } = TargetGroupSlice.actions;
export default TargetGroupSlice.reducer;
