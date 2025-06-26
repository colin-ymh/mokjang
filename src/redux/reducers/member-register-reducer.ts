import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BAPTISM,
  BLANK,
  FAMILY,
  GENDER,
  MEMBER_REGISTER_STAGE,
  MEMBER_REGISTER_TYPE,
  NONE,
  NULL,
} from '@/constants/constant';
import { getIsWellFormedMobilePhone, getIsWellFormedName } from '@/utils/check';
import { Member } from '@/models/member/member';

type MemberRegisterState = {
  member: Member;
  stage: MEMBER_REGISTER_STAGE;
  type: MEMBER_REGISTER_TYPE;
  isStageClear: boolean;
};

export const DEFAULT_MEMBER: Member = {
  id: BLANK,
  profileImageUrl: BLANK,
  name: BLANK,
  mobilePhone: BLANK,
  homePhone: BLANK,
  marriage: NULL,
  detailMarriage: BLANK,
  address: BLANK,
  detailAddress: BLANK,
  school: BLANK,
  occupation: BLANK,
  birth: BLANK,
  isLunar: false,
  baptism: BAPTISM.NONE,
  gender: GENDER.MALE,
  guidedById: BLANK,
  vehicleNumber: [BLANK, BLANK, BLANK],
  familyMemberId: BLANK,
  family: [],
  relation: FAMILY.FAMILY,
  // 교회 정보
  registeredAt: BLANK,
  updatedAt: BLANK,
  officerId: NONE,

  isConcealed: false,
};

const initialState: MemberRegisterState = {
  member: DEFAULT_MEMBER,
  stage: MEMBER_REGISTER_STAGE.REQUIRED,
  isStageClear: false,
  type: MEMBER_REGISTER_TYPE.NEW,
};

const getIsStageClear = (
  member: Member,
  stage: MEMBER_REGISTER_STAGE
): boolean => {
  if (stage === MEMBER_REGISTER_STAGE.REQUIRED) {
    // 이름과 휴대폰 번호가 정상적인 상태인 경우, 등록 가능
    return (
      getIsWellFormedName(member.name) &&
      getIsWellFormedMobilePhone(member.mobilePhone)
    );
  } else {
    return true;
  }
};

const MemberRegisterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setMember(state, action: PayloadAction<Member>) {
      state.member = action.payload;
      state.isStageClear = getIsStageClear(state.member, state.stage);
    },
    setStage(state, action: PayloadAction<MEMBER_REGISTER_STAGE>) {
      state.stage = action.payload;
      state.isStageClear = getIsStageClear(state.member, state.stage);
    },
    setType(state, action: PayloadAction<MEMBER_REGISTER_TYPE>) {
      state.type = action.payload;
    },
  },
});

export const { setMember, setStage, setType } = MemberRegisterSlice.actions;
export default MemberRegisterSlice.reducer;
