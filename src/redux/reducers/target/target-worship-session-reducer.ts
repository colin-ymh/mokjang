import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_WORSHIP_SESSION,
  WorshipSession,
} from '@/models/worship/worship';

type TargetWorshipSessionState = {
  targetWorshipSession: WorshipSession;
};

const initialState: TargetWorshipSessionState = {
  targetWorshipSession: DEFAULT_WORSHIP_SESSION,
};

const TargetWorshipSessionSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetWorshipSession(state, action: PayloadAction<WorshipSession>) {
      state.targetWorshipSession = action.payload;
    },
  },
});

export const { setTargetWorshipSession } = TargetWorshipSessionSlice.actions;
export default TargetWorshipSessionSlice.reducer;
