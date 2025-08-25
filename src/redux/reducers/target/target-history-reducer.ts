import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_GROUP_DETAIL_HISTORY,
  DEFAULT_GROUP_HISTORY,
  DEFAULT_MINISTRY_DETAIL_HISTORY,
  DEFAULT_MINISTRY_HISTORY,
  DEFAULT_OFFICER_HISTORY,
  GroupDetailHistory,
  GroupHistory,
  MinistryDetailHistory,
  MinistryHistory,
  OfficerHistory,
} from '@/models/member/history';

type TargetHistoryState = {
  targetGroupHistory: GroupHistory;
  targetGroupDetailHistory: GroupDetailHistory;
  targetMinistryHistory: MinistryHistory;
  targetMinistryDetailHistory: MinistryDetailHistory;
  targetOfficerHistory: OfficerHistory;
};

const initialState: TargetHistoryState = {
  targetGroupHistory: DEFAULT_GROUP_HISTORY,
  targetGroupDetailHistory: DEFAULT_GROUP_DETAIL_HISTORY,
  targetMinistryHistory: DEFAULT_MINISTRY_HISTORY,
  targetMinistryDetailHistory: DEFAULT_MINISTRY_DETAIL_HISTORY,
  targetOfficerHistory: DEFAULT_OFFICER_HISTORY,
};

const TargetHistorySlice = createSlice({
  name: 'targetHistory',
  initialState,
  reducers: {
    setTargetGroupHistory(state, action: PayloadAction<GroupHistory>) {
      state.targetGroupHistory = action.payload;
    },
    setTargetGroupDetailHistory(
      state,
      action: PayloadAction<GroupDetailHistory>
    ) {
      state.targetGroupDetailHistory = action.payload;
    },
    setTargetMinistryHistory(state, action: PayloadAction<MinistryHistory>) {
      state.targetMinistryHistory = action.payload;
    },
    setTargetMinistryDetailHistory(
      state,
      action: PayloadAction<MinistryDetailHistory>
    ) {
      state.targetMinistryDetailHistory = action.payload;
    },
    setTargetOfficerHistory(state, action: PayloadAction<OfficerHistory>) {
      state.targetOfficerHistory = action.payload;
    },
  },
});

export const {
  setTargetGroupHistory,
  setTargetGroupDetailHistory,
  setTargetOfficerHistory,
  setTargetMinistryHistory,
  setTargetMinistryDetailHistory,
} = TargetHistorySlice.actions;
export default TargetHistorySlice.reducer;
