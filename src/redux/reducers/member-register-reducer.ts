import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLANK } from "@/common/default/default-value";
import { TemporalMember } from "@/models/register/member-register";
import {
  GENDER,
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
  NONE,
} from "@/constant/constant";
import { getIsWellFormedMobilePhone, getIsWellFormedName } from "@/utils/check";

type MemberRegisterState = {
  member: TemporalMember;
  stage: MEMBER_REGISTER_STAGE;
  isStageClear: boolean;
};

const DEFAULT_MEMBER: TemporalMember = {
  type: MEMBER_REGISTER_TYPE.NEW,
  profileImage: BLANK,
  name: BLANK,
  mobilePhone: BLANK,
  homePhone: BLANK,
  marriage: NONE,
  detailMarriage: BLANK,
  address: BLANK,
  detailAddress: BLANK,
  school: BLANK,
  occupation: BLANK,
  birth: BLANK,
  isLunar: false,
  officer: NONE,
  officerStartDate: BLANK,
  officerStartChurch: BLANK,
  baptism: NONE,
  guidedById: BLANK,
  previousChurchName: BLANK,
  vehicleNumber: [BLANK, BLANK, BLANK],
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
    return (
      getIsWellFormedName(member.name) &&
      getIsWellFormedMobilePhone(member.mobilePhone)
    );
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
