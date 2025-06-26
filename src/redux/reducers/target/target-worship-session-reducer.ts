import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_WORSHIP,
  DEFAULT_WORSHIP_SESSION,
  Worship,
  WorshipSession,
} from '@/models/worship/worship';
import { DEFAULT_GROUP, Group } from '@/models/management/management';

type TargetWorshipSessionState = {
  targetWorshipSession: WorshipSession;
  targetWorshipSessionWorship: Worship;
  targetWorshipSessionGroup: Group;
};

const initialState: TargetWorshipSessionState = {
  targetWorshipSession: DEFAULT_WORSHIP_SESSION,
  targetWorshipSessionWorship: DEFAULT_WORSHIP,
  targetWorshipSessionGroup: DEFAULT_GROUP,
};

const TargetWorshipSessionSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetWorshipSession(state, action: PayloadAction<WorshipSession>) {
      state.targetWorshipSession = action.payload;
    },
    setTargetWorshipSessionWorship(state, action: PayloadAction<Worship>) {
      state.targetWorshipSessionWorship = action.payload;
    },
    setTargetWorshipSessionGroup(state, action: PayloadAction<Group>) {
      state.targetWorshipSessionGroup = action.payload;
    },
  },
});

export const {
  setTargetWorshipSession,
  setTargetWorshipSessionWorship,
  setTargetWorshipSessionGroup,
} = TargetWorshipSessionSlice.actions;
export default TargetWorshipSessionSlice.reducer;
