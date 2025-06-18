import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_WORSHIP, Worship } from '@/models/worship/worship';

type TargetWorshipState = {
  targetWorship: Worship;
};

const initialState: TargetWorshipState = {
  targetWorship: DEFAULT_WORSHIP,
};

const TargetWorshipSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetWorship(state, action: PayloadAction<Worship>) {
      state.targetWorship = action.payload;
    },
  },
});

export const { setTargetWorship } = TargetWorshipSlice.actions;
export default TargetWorshipSlice.reducer;
