import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BLANK, NULL, ORDER_DIRECTION } from "@/constants/constant";
import { MEMBER } from "@/constants/member/member-column";

type MEMBER_FILTER = {
  [MEMBER.NAME]: string;
  [MEMBER.SCHOOL]: string;
  [MEMBER.VEHICLE_NUMBER]: string[];
  [MEMBER.GENDER]: string[];
  birthAfter: string;
  birthBefore: string;
  [MEMBER.GROUP]: string[];
  [MEMBER.OFFICER]: string[];
  [MEMBER.MINISTRY]: string[];
  [MEMBER.EDUCATION]: string[];
  [MEMBER.BAPTISM]: string[];
  selectedColumns: MEMBER[];
};

type MemberFilterState = {
  memberFilter: MEMBER_FILTER;
  memberOrderBy: MEMBER | typeof NULL;
  memberOrderDirection: ORDER_DIRECTION;
  memberTableHeaderItemList: TABLE_HEADER_ITEM[];
};

export const INITIAL_MEMBER_FILTER: MEMBER_FILTER = {
  name: BLANK,
  school: BLANK,
  vehicleNumber: [],
  gender: [],
  baptism: [],
  officer: [],
  ministry: [],
  education: [],
  birthAfter: BLANK,
  birthBefore: BLANK,
  group: [],
  selectedColumns: [
    MEMBER.GENDER,
    MEMBER.OFFICER,
    MEMBER.AGE,
    MEMBER.MOBILE_PHONE,
  ],
};

export type TABLE_HEADER_ITEM = {
  id: MEMBER;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
};

export const INITIAL_TABLE_HEADER_LIST: TABLE_HEADER_ITEM[] = [
  {
    id: MEMBER.GROUP,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
  },
  {
    id: MEMBER.PROFILE_IMAGE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
  },
  {
    id: MEMBER.NAME,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
  },
  {
    id: MEMBER.GENDER,
    isShown: true,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
  },
  {
    id: MEMBER.OFFICER,
    isShown: true,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
  },
  {
    id: MEMBER.AGE,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: false,
  },
  {
    id: MEMBER.MOBILE_PHONE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
  },
  {
    id: MEMBER.HOME_PHONE,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
  },
  {
    id: MEMBER.ADDRESS,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
  },
  {
    id: MEMBER.OCCUPATION,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
  },
  {
    id: MEMBER.SCHOOL,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
  },
  {
    id: MEMBER.MARRIAGE,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
  },
  {
    id: MEMBER.BAPTISM,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
  },
  {
    id: MEMBER.BIRTH,
    isShown: false,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
  },
  {
    id: MEMBER.REGISTERED_AT,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
  },
  {
    id: MEMBER.UPDATED_AT,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
  },
];

const initialState: MemberFilterState = {
  memberFilter: INITIAL_MEMBER_FILTER,
  memberOrderBy: NULL,
  memberOrderDirection: ORDER_DIRECTION.ASC,
  memberTableHeaderItemList: INITIAL_TABLE_HEADER_LIST,
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
    setMemberTableHeaderItemList(
      state,
      action: PayloadAction<TABLE_HEADER_ITEM[]>,
    ) {
      state.memberTableHeaderItemList = action.payload;
    },
  },
});

export const {
  setMemberFilter,
  setMemberOrderBy,
  setMemberOrderDirection,
  setMemberTableHeaderItemList,
} = MemberFilterSlice.actions;
export default MemberFilterSlice.reducer;
