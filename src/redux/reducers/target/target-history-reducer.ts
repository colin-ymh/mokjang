import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_GROUP_HISTORY,
  DEFAULT_MINISTRY_HISTORY,
  DEFAULT_OFFICER_HISTORY,
  GroupHistory,
  MinistryHistory,
  OfficerHistory,
} from '@/models/member/history';

type TargetHistoryState = {
  targetGroupHistory: GroupHistory;
  targetMinistryHistory: MinistryHistory;
  targetOfficerHistory: OfficerHistory;
};

const initialState: TargetHistoryState = {
  targetGroupHistory: DEFAULT_GROUP_HISTORY,
  targetMinistryHistory: DEFAULT_MINISTRY_HISTORY,
  targetOfficerHistory: DEFAULT_OFFICER_HISTORY,
};

const TargetHistorySlice = createSlice({
  name: 'targetHistory',
  initialState,
  reducers: {
    setTargetGroupHistory(state, action: PayloadAction<GroupHistory>) {
      state.targetGroupHistory = action.payload;
    },
    setTargetMinistryHistory(state, action: PayloadAction<MinistryHistory>) {
      state.targetMinistryHistory = action.payload;
    },
    setTargetOfficerHistory(state, action: PayloadAction<OfficerHistory>) {
      state.targetOfficerHistory = action.payload;
    },
  },
});

export const {
  setTargetGroupHistory,
  setTargetOfficerHistory,
  setTargetMinistryHistory,
} = TargetHistorySlice.actions;
export default TargetHistorySlice.reducer;
