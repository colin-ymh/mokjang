import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_WORSHIP,
  DEFAULT_WORSHIP_STATISTIC,
  Worship,
  WorshipStatistic,
} from '../../../models/worship/worship';
import { DEFAULT_GROUP, Group } from '../../../models/management/management';

type TargetWorshipState = {
  targetWorship: Worship;
  targetWorshipGroup: Group;
  targetWorshipStatistic: WorshipStatistic;
};

const initialState: TargetWorshipState = {
  targetWorship: DEFAULT_WORSHIP,
  targetWorshipGroup: DEFAULT_GROUP,
  targetWorshipStatistic: DEFAULT_WORSHIP_STATISTIC,
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
    setTargetWorshipStatistic(state, action: PayloadAction<WorshipStatistic>) {
      state.targetWorshipStatistic = action.payload;
    },
  },
});

export const {
  setTargetWorship,
  setTargetWorshipGroup,
  setTargetWorshipStatistic,
} = TargetWorshipSlice.actions;
export default TargetWorshipSlice.reducer;
