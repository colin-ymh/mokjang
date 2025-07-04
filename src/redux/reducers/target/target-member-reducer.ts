import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_MEMBER, Member } from '@/models/member/member';

type TargetMemberState = {
  targetMember: Member;
};

const initialState: TargetMemberState = {
  targetMember: DEFAULT_MEMBER,
};

const TargetMemberSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setTargetMember(state, action: PayloadAction<Member>) {
      state.targetMember = action.payload;
    },
  },
});

export const { setTargetMember } = TargetMemberSlice.actions;
export default TargetMemberSlice.reducer;
