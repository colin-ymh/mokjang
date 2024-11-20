import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLANK } from "@/common/default/default-value";
import { TemporalMember } from "@/models/register/member-register";
import {
  BAPTISM,
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constant/constant";

type MemberRegisterState = {
  member: TemporalMember;
  stage: MEMBER_REGISTER_STAGE;
};

const DEFAULT_MEMBER: TemporalMember = {
  type: MEMBER_REGISTER_TYPE.NEW,
  name: BLANK,
  mobilePhone: BLANK,
  homePhone: BLANK,
  marriage: BLANK,
  address: BLANK,
  school: BLANK,
  occupation: BLANK,
  birth: BLANK,
  confirmation: BLANK,
  confirmationStartDate: BLANK,
  confirmationStartChurch: BLANK,
  baptism: BAPTISM.NONE,
  guide: BLANK,
  previousChurchName: BLANK,
  vehiclePlateNumber: BLANK,
  gender: "male",
};

const initialState: MemberRegisterState = {
  member: DEFAULT_MEMBER,
  stage: MEMBER_REGISTER_STAGE.REQUIRED,
};

const MemberRegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setMember(state, action: PayloadAction<TemporalMember>) {
      state.member = action.payload;
    },
    setStage(state, action: PayloadAction<MEMBER_REGISTER_STAGE>) {
      state.stage = action.payload;
    },
  },
});

export const { setMember, setStage } = MemberRegisterSlice.actions;
export default MemberRegisterSlice.reducer;
