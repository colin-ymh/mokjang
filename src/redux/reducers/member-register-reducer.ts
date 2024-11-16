import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLANK, DEFAULT_VALUE } from "@/common/default/default-value";
import { MemberRegisterType } from "@/models/register/member-register";

type MemberRegisterState = {
  member: MemberRegisterType;
};

const DEFAULT_MEMBER: MemberRegisterType = {
  name: BLANK,
  personalPhone: BLANK,
  homePhone: BLANK,
  marriage: BLANK,
  school: BLANK,
  job: BLANK,
};

const initialState: MemberRegisterState = {
  member: DEFAULT_MEMBER,
};

const MemberRegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setMember(state, action: PayloadAction<MemberRegisterType>) {
      state.member = action.payload;
    },
  },
});

export const { setMember } = MemberRegisterSlice.actions;
export default MemberRegisterSlice.reducer;
