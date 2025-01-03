import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Member } from "@/models/member/member";
import { DEFAULT_MEMBER } from "@/redux/reducers/member-register-reducer";

type TargetMemberState = {
  targetMember: Member;
};

const initialState: TargetMemberState = {
  targetMember: DEFAULT_MEMBER,
};

const TargetMemberSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setTargetMember(state, action: PayloadAction<Member>) {
      state.targetMember = action.payload;
    },
  },
});

export const { setTargetMember } = TargetMemberSlice.actions;
export default TargetMemberSlice.reducer;
