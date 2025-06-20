import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_WORSHIP, Worship } from '@/models/worship/worship';
import { DEFAULT_GROUP, Group } from '@/models/management/management';

type TargetWorshipState = {
  targetWorship: Worship;
  targetWorshipGroup: Group;
};

const initialState: TargetWorshipState = {
  targetWorship: DEFAULT_WORSHIP,
  targetWorshipGroup: DEFAULT_GROUP,
};

const TargetWorshipSlice = createSlice({
  name: 'targetWorship',
  initialState,
  reducers: {
    setTargetWorship(state, action: PayloadAction<Worship>) {
      state.targetWorship = action.payload;
    },
    setTargetWorshipGroup(state, action: PayloadAction<Group>) {
      state.targetWorshipGroup = action.payload;
    },
  },
});

export const { setTargetWorship, setTargetWorshipGroup } =
  TargetWorshipSlice.actions;
export default TargetWorshipSlice.reducer;
