import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLANK } from "@/common/default/default-value";
import { TemporalMember } from "@/models/register/member-register";
import {
  BAPTISM,
  CONFIRMATION,
  GENDER,
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
} from "@/constant/constant";

type MemberRegisterState = {
  member: TemporalMember;
  stage: MEMBER_REGISTER_STAGE;
  isStageClear: boolean;
};

const DEFAULT_MEMBER: TemporalMember = {
  type: MEMBER_REGISTER_TYPE.NEW,
  name: BLANK,
  mobilePhone: BLANK,
  homePhone: BLANK,
  marriage: BLANK,
  address: BLANK,
  detailAddress: BLANK,
  school: BLANK,
  occupation: BLANK,
  birth: BLANK,
  confirmation: CONFIRMATION.NONE,
  confirmationStartDate: BLANK,
  confirmationStartChurch: BLANK,
  baptism: BAPTISM.NONE,
  guide: BLANK,
  previousChurchName: BLANK,
  vehiclePlateNumber: BLANK,
  gender: GENDER.MALE,
  family: BLANK,
};

const initialState: MemberRegisterState = {
  member: DEFAULT_MEMBER,
  stage: MEMBER_REGISTER_STAGE.REQUIRED,
  isStageClear: false,
};

const getIsStageClear = (
  member: TemporalMember,
  stage: MEMBER_REGISTER_STAGE,
): boolean => {
  if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
    return member.name !== BLANK && member.mobilePhone.length > 12;
  } else {
    return true;
  }
};

const MemberRegisterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setMember(state, action: PayloadAction<TemporalMember>) {
      state.member = action.payload;
      state.isStageClear = getIsStageClear(state.member, state.stage);
    },
    setStage(state, action: PayloadAction<MEMBER_REGISTER_STAGE>) {
      state.stage = action.payload;
      state.isStageClear = getIsStageClear(state.member, state.stage);
    },
  },
});

export const { setMember, setStage } = MemberRegisterSlice.actions;
export default MemberRegisterSlice.reducer;
