import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BAPTISM,
  GENDER,
  MEMBER_ORDER_BY,
  NONE,
  OFFICER,
  ORDER_DIRECTION,
} from "@/constants/constant";

type MemberFilterState = {
  memberOrderBy: MEMBER_ORDER_BY | typeof NONE;
  memberOrderDirection: ORDER_DIRECTION;
  genderFilter: GENDER | typeof NONE;
  baptismFilter: BAPTISM;
  officerFilter: OFFICER;
};

const initialState: MemberFilterState = {
  memberOrderBy: NONE,
  memberOrderDirection: ORDER_DIRECTION.ASC,
  genderFilter: NONE,
  baptismFilter: BAPTISM.NONE,
  officerFilter: OFFICER.NONE,
};

const MemberFilterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setMemberOrderBy(
      state,
      action: PayloadAction<MEMBER_ORDER_BY | typeof NONE>,
    ) {
      state.memberOrderBy = action.payload;
    },
    setMemberOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.memberOrderDirection = action.payload;
    },
    setGenderFilter(state, action: PayloadAction<GENDER | typeof NONE>) {
      state.genderFilter = action.payload;
    },
    setBaptismFilter(state, action: PayloadAction<BAPTISM>) {
      state.baptismFilter = action.payload;
    },
    setOfficerFilter(state, action: PayloadAction<OFFICER>) {
      state.officerFilter = action.payload;
    },
  },
});

export const {
  setMemberOrderBy,
  setMemberOrderDirection,
  setGenderFilter,
  setBaptismFilter,
  setOfficerFilter,
} = MemberFilterSlice.actions;
export default MemberFilterSlice.reducer;
