import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_VALUE } from "@/common/default/default-value";
import { MemberRegisterType } from "@/models/register/member-register";

type MemberRegisterState = {
  member: MemberRegisterType;
};

const DEFAULT_MEMBER: MemberRegisterType = {
  name: DEFAULT_VALUE.STRING,
  personalPhone: DEFAULT_VALUE.STRING,
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
