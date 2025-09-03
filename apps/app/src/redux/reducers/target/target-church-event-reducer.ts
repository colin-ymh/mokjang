import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_GROUP, Group } from '../../../models/management/management';
import {
  ChurchEvent,
  DEFAULT_CHURCH_EVENT,
} from '../../../models/church-event/church-event';

type TargetChurchEventState = {
  targetChurchEvent: ChurchEvent;
  targetChurchEventGroup: Group;
};

const initialState: TargetChurchEventState = {
  targetChurchEvent: DEFAULT_CHURCH_EVENT,
  targetChurchEventGroup: DEFAULT_GROUP,
};

const TargetChurchEventSlice = createSlice({
  name: 'targetChurchEvent',
  initialState,
  reducers: {
    setTargetChurchEvent(state, action: PayloadAction<ChurchEvent>) {
      state.targetChurchEvent = action.payload;
    },
    setTargetChurchEventGroup(state, action: PayloadAction<Group>) {
      state.targetChurchEventGroup = action.payload;
    },
  },
});

export const { setTargetChurchEvent, setTargetChurchEventGroup } =
  TargetChurchEventSlice.actions;
export default TargetChurchEventSlice.reducer;
