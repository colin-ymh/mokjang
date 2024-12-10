import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  BAPTISM,
  BLANK,
  GENDER,
  NULL,
  ORDER_DIRECTION,
} from "@/constants/constant";
import { MEMBER } from "@/constants/member/member-column";

type MEMBER_FILTER = {
  name: string;
  school: string;
  vehicleNumber: string;
  gender: GENDER | typeof NULL;
  baptism: BAPTISM | typeof NULL;
  officer: string;
  birthAfter: string;
  birthBefore: string;
};

type MemberFilterState = {
  memberFilter: MEMBER_FILTER;
  memberOrderBy: MEMBER | typeof NULL;
  memberOrderDirection: ORDER_DIRECTION;
};

export const INITIAL_MEMBER_FILTER: MEMBER_FILTER = {
  name: BLANK,
  school: BLANK,
  vehicleNumber: BLANK,
  gender: NULL,
  baptism: NULL,
  officer: BLANK,
  birthAfter: BLANK,
  birthBefore: BLANK,
};

const initialState: MemberFilterState = {
  memberFilter: INITIAL_MEMBER_FILTER,
  memberOrderBy: NULL,
  memberOrderDirection: ORDER_DIRECTION.ASC,
};

const MemberFilterSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setMemberFilter: (state, action: PayloadAction<MEMBER_FILTER>) => {
      state.memberFilter = action.payload;
    },
    setMemberOrderBy(state, action: PayloadAction<MEMBER | typeof NULL>) {
      state.memberOrderBy = action.payload;
    },
    setMemberOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.memberOrderDirection = action.payload;
    },
  },
});

export const { setMemberFilter, setMemberOrderBy, setMemberOrderDirection } =
  MemberFilterSlice.actions;
export default MemberFilterSlice.reducer;
