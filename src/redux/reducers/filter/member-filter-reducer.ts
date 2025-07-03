import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { MEMBER } from '@/constants/member/member-column';
import { Member } from '@/models/member/member';
import { RootState } from '@/redux/store';
import { MembersApi } from '@/api/members/members.api';

type MEMBER_FILTER = {
  [MEMBER.NAME]: string;
  [MEMBER.SCHOOL]: string;
  [MEMBER.OCCUPATION]: string;
  [MEMBER.VEHICLE_NUMBER]: string;
  [MEMBER.GENDER]: string[];
  [MEMBER.GROUP]: string[];
  [MEMBER.OFFICER]: string[];
  [MEMBER.MINISTRIES]: string[];
  [MEMBER.EDUCATIONS]: string[];
  [MEMBER.BAPTISM]: string[];
  [MEMBER.GENDER]: string[];
  [MEMBER.BAPTISM]: string[];
  [MEMBER.MARRIAGE]: string[];
  [MEMBER.MOBILE_PHONE]: string;
  [MEMBER.HOME_PHONE]: string;
  [MEMBER.ADDRESS]: string;
  birthAfter: string;
  birthBefore: string;
  registerAfter: string;
  registerBefore: string;
  updateAfter: string;
  updateBefore: string;
  selectedColumns: MEMBER[];
};

type MemberFilterState = {
  members: Member[];
  memberFilter: MEMBER_FILTER;
  memberOrderBy: MEMBER | typeof NULL;
  memberOrderDirection: ORDER_DIRECTION;
  memberTableHeaderItemList: TABLE_HEADER_ITEM[];
  filterValue: MEMBER | typeof NULL;
  filterItems: string[];
  filterAfter: string;
  filterBefore: string;
};

export const INITIAL_MEMBER_FILTER: MEMBER_FILTER = {
  name: BLANK,
  school: BLANK,
  occupation: BLANK,
  vehicleNumber: BLANK,
  mobilePhone: BLANK,
  homePhone: BLANK,
  address: BLANK,
  gender: [],
  baptism: [],
  officer: [],
  ministries: [],
  educations: [],
  marriage: [],
  group: [],
  birthAfter: BLANK,
  birthBefore: BLANK,
  registerAfter: BLANK,
  registerBefore: BLANK,
  updateAfter: BLANK,
  updateBefore: BLANK,
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
  isDate?: boolean;
};

export const BLANK_HEADER = {
  id: BLANK,
  isShown: true,
  isSortable: false,
  isFilterable: false,
};

export const INITIAL_TABLE_HEADER_LIST: TABLE_HEADER_ITEM[] = [
  {
    id: MEMBER.CHECK,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.GROUP,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.NAME,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.GENDER,
    isShown: true,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.OFFICER,
    isShown: true,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.AGE,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.MOBILE_PHONE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.HOME_PHONE,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.ADDRESS,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.OCCUPATION,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.SCHOOL,
    isShown: false,
    isSortable: false,
    isFilterable: false,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.MARRIAGE,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.BAPTISM,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.EDUCATIONS,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.MINISTRIES,
    isShown: false,
    isSortable: false,
    isFilterable: true,
    isFixed: false,
    isDate: false,
  },
  {
    id: MEMBER.BIRTH,
    isShown: false,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
    isDate: true,
  },
  {
    id: MEMBER.REGISTERED_AT,
    isShown: false,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
    isDate: true,
  },
  {
    id: MEMBER.UPDATED_AT,
    isShown: false,
    isSortable: true,
    isFilterable: true,
    isFixed: false,
    isDate: true,
  },
];

const initialState: MemberFilterState = {
  members: [],
  memberFilter: INITIAL_MEMBER_FILTER,
  memberOrderBy: NULL,
  memberOrderDirection: ORDER_DIRECTION.ASC,
  memberTableHeaderItemList: INITIAL_TABLE_HEADER_LIST,
  filterValue: NULL,
  filterItems: [],
  filterAfter: BLANK,
  filterBefore: BLANK,
};

export const fetchMembers = createAsyncThunk<
  Member[],
  { currentPage: number },
  { state: RootState }
>(
  'members/fetchMembers',
  async ({ currentPage }, { getState, rejectWithValue }) => {
    const state = getState().memberFilter;
    const churchId = getState().church.churchId;
    const { memberOrderBy, memberOrderDirection, memberFilter } = state;
    const membersApi = new MembersApi(false);

    try {
      let order = memberOrderBy;
      if (order === MEMBER.AGE) order = MEMBER.BIRTH;

      const response = await membersApi.getMembers({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: order !== NULL ? order : undefined,
        orderDirection: memberOrderDirection,
        selectedColumns: memberFilter.selectedColumns,
        // 필터
        group: memberFilter.group,
        officer: memberFilter.officer,
        gender: memberFilter.gender as string[],
        educations: memberFilter.educations,
        ministries: memberFilter.ministries,
        baptism: memberFilter.baptism,
        marriage: memberFilter.marriage,
        birthAfter: memberFilter.birthAfter,
        birthBefore: memberFilter.birthBefore,
        registerAfter: memberFilter.registerAfter,
        registerBefore: memberFilter.registerBefore,
        updateAfter: memberFilter.updateAfter,
        updateBefore: memberFilter.updateBefore,
        // 검색
        name: memberFilter.name,
        school: memberFilter.school,
        vehicleNumber: memberFilter.vehicleNumber,
        address: memberFilter.address,
        mobilePhone: memberFilter.mobilePhone,
        homePhone: memberFilter.homePhone,
        occupation: memberFilter.occupation,
      });

      return response.data.data;
    } catch (error) {
      console.error('교인 목록 불러오기 실패', error);
      return rejectWithValue('교인 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const MemberFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<Member[]>) => {
      state.members = action.payload;
    },
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
      action: PayloadAction<TABLE_HEADER_ITEM[]>
    ) {
      state.memberTableHeaderItemList = action.payload;
    },
    setFilterValue(state, action: PayloadAction<MEMBER | typeof NULL>) {
      state.filterValue = action.payload;
    },
    setFilterItems(state, action: PayloadAction<string[]>) {
      state.filterItems = action.payload;
    },
    setFilterAfter(state, action: PayloadAction<string>) {
      state.filterAfter = action.payload;
    },
    setFilterBefore(state, action: PayloadAction<string>) {
      state.filterBefore = action.payload;
    },
  },
});

export const {
  setMembers,
  setMemberFilter,
  setMemberOrderBy,
  setMemberOrderDirection,
  setMemberTableHeaderItemList,
  setFilterValue,
  setFilterItems,
  setFilterAfter,
  setFilterBefore,
} = MemberFilterSlice.actions;
export default MemberFilterSlice.reducer;
