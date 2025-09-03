import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DEFAULT_JOIN_REQUEST,
  JoinRequest,
} from '../../../models/join-request/join-request';

type JoinRequestState = {
  targetJoinRequest: JoinRequest;
};

const initialState: JoinRequestState = {
  targetJoinRequest: DEFAULT_JOIN_REQUEST,
};

const JoinRequestSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetJoinRequest(state, action: PayloadAction<JoinRequest>) {
      state.targetJoinRequest = action.payload;
    },
  },
});

export const { setTargetJoinRequest } = JoinRequestSlice.actions;
export default JoinRequestSlice.reducer;
