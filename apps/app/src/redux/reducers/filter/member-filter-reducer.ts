import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ALL,
  BAPTISM,
  BLANK,
  MARRIAGE,
  MEMBER,
  ORDER_DIRECTION,
} from '@mokjang/constants';
import { Member } from '@mokjang/models';
import { RootState } from '../../store';
import { MembersApi } from '../../../api/members/members.api';
import { FilteredItemType } from '../../../components/atoms/member/setting/filtered-item.view';

type MEMBER_FILTER = {
  groupIds: (string | null)[];
  officerIds: (string | null)[];
  marriageStatuses: (MARRIAGE | null)[];
  baptismStatuses: BAPTISM[];
  birthFrom: string;
  birthTo: string;
  registeredFrom: string;
  registeredTo: string;
  displayColumns: (MEMBER | '')[];
  search: string;
};

export type MEMBER_TABLE_HEADER_ITEM = {
  id: MEMBER | typeof BLANK;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

type MemberFilterState = {
  members: Member[];
  memberFilter: MEMBER_FILTER;
  memberSortBy?: MEMBER;
  memberSortDirection: ORDER_DIRECTION;
  memberTableHeaderItemList: MEMBER_TABLE_HEADER_ITEM[];
  filteredItems: FilteredItemType[];
  memberCursor: string;

  // 페이지네이션 메타
  nextCursor?: string | null;
  hasMore: boolean;

  // UI 상태
  loading: boolean;
  error: string | null;
};

export const INITIAL_MEMBER_FILTER: MEMBER_FILTER = {
  groupIds: [],
  officerIds: [],
  baptismStatuses: [],
  marriageStatuses: [],
  birthFrom: BLANK,
  birthTo: BLANK,
  registeredFrom: BLANK,
  registeredTo: BLANK,
  search: BLANK,
  displayColumns: [
    MEMBER.GROUP,
    MEMBER.GENDER,
    MEMBER.OFFICER,
    MEMBER.BIRTH,
    MEMBER.MOBILE_PHONE,
  ],
};

export const BLANK_HEADER: MEMBER_TABLE_HEADER_ITEM = {
  id: BLANK,
  isShown: true,
  isSortable: false,
  isFilterable: false,
};

export const INITIAL_TABLE_HEADER_LIST: MEMBER_TABLE_HEADER_ITEM[] = [
  {
    id: MEMBER.PROFILE_IMAGE,
    isShown: true,
    isSortable: false,
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
    id: MEMBER.GROUP,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: false,
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
  // {
  //   id: MEMBER.HOME_PHONE,
  //   isShown: false,
  //   isSortable: false,
  //   isFilterable: false,
  //   isFixed: false,
  //   isDate: false,
  // },
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
  // {
  //   id: MEMBER.EDUCATIONS,
  //   isShown: false,
  //   isSortable: false,
  //   isFilterable: true,
  //   isFixed: false,
  //   isDate: false,
  // },
  // {
  //   id: MEMBER.MINISTRIES,
  //   isShown: false,
  //   isSortable: false,
  //   isFilterable: true,
  //   isFixed: false,
  //   isDate: false,
  // },
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
  memberSortDirection: ORDER_DIRECTION.ASC,
  memberTableHeaderItemList: INITIAL_TABLE_HEADER_LIST,
  filteredItems: [],
  memberCursor: BLANK,
  nextCursor: null,
  hasMore: false,
  loading: false,
  error: null,
};

// thunk 반환 타입 정의: members + nextCursor + hasMore
type FetchMembersResult = {
  members: Member[];
  nextCursor: string | null;
  hasMore: boolean;
};

// rejectValue를 string으로 명시
export const fetchMembers = createAsyncThunk<
  FetchMembersResult,
  void,
  { state: RootState; rejectValue: string }
>('members/fetchMembers', async (_, { getState, rejectWithValue }) => {
  const state = getState().memberFilter;
  const { churchId } = getState().church;
  const {
    memberCursor,
    memberSortBy,
    memberSortDirection,
    memberFilter,
    members,
  } = state;
  const membersApi = new MembersApi(false);

  const {
    groupIds,
    officerIds,
    marriageStatuses,
    baptismStatuses,
    birthFrom,
    birthTo,
    registeredFrom,
    registeredTo,
    displayColumns,
    search,
  } = memberFilter;

  try {
    // AGE로 정렬 요청 시 실데이터는 BIRTH 기준으로 정렬
    let sort = memberSortBy;
    if (sort === MEMBER.AGE) sort = MEMBER.BIRTH;

    // ---- displayColumns sanitize ----
    const sanitizedDisplayColumns = Array.from(
      new Set(
        displayColumns
          // 1) 서버가 허용하지 않는 컬럼 제거
          .filter((col) => col !== 'profileImage' && col !== 'name')
          // 2) age -> birth 치환
          .map((col) =>
            // @ts-ignore
            col === 'age' || col === MEMBER.AGE ? MEMBER.BIRTH : col
          )
      )
    );

    const response = await membersApi.getMembersV2({
      churchId,
      cursor: memberCursor,
      sortBy: sort,
      sortDirection: memberSortDirection,
      groupIds: groupIds.filter((id) => id !== ALL),
      officerIds,
      marriageStatuses,
      baptismStatuses,
      birthFrom,
      birthTo,
      registeredFrom,
      registeredTo,
      // 정리된 컬럼만 전송
      displayColumns: sanitizedDisplayColumns,
      search,
    });

    const newMembers: Member[] = response.data.data;
    const existingIds = new Set(members.map((member) => member.id));
    const filteredNewMembers = newMembers.filter(
      (member) => !existingIds.has(member.id)
    );

    const updatedMembers =
      memberCursor === BLANK ? newMembers : [...members, ...filteredNewMembers];

    const nextCursor: string | null = response.data.nextCursor ?? null;
    const hasMore: boolean = Boolean(response.data.hasMore);

    return { members: updatedMembers, nextCursor, hasMore };
  } catch (error) {
    console.error('교인 목록 불러오기 실패', error);
    return rejectWithValue('교인 목록을 불러오는 중 오류가 발생했습니다.');
  }
});

const MemberFilterSlice = createSlice({
  name: 'memberFilter',
  initialState,
  reducers: {
    setMembers: (state, action: PayloadAction<Member[]>) => {
      state.members = action.payload;
    },
    setMemberFilter: (state, action: PayloadAction<MEMBER_FILTER>) => {
      state.memberFilter = action.payload;
    },
    setMemberSortBy(state, action: PayloadAction<MEMBER>) {
      state.memberSortBy = action.payload;
    },
    setMemberSortDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.memberSortDirection = action.payload;
    },
    setMemberTableHeaderItemList(
      state,
      action: PayloadAction<MEMBER_TABLE_HEADER_ITEM[]>
    ) {
      state.memberTableHeaderItemList = action.payload;
    },
    setFilteredItems: (state, action: PayloadAction<FilteredItemType[]>) => {
      state.filteredItems = action.payload;
    },
    setMemberCursor: (state, action: PayloadAction<string>) => {
      state.memberCursor = action.payload;
    },
    // 선택: nextCursor로 커서 전진 (무한스크롤에서 바로 쓰기 편함)
    advanceToNextCursor: (state) => {
      if (state.nextCursor) {
        state.memberCursor = state.nextCursor;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload.members;
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? '알 수 없는 오류가 발생했습니다.';
      });
  },
});

export const {
  setMembers,
  setMemberFilter,
  setMemberSortBy,
  setMemberSortDirection,
  setMemberTableHeaderItemList,
  setFilteredItems,
  setMemberCursor,
  advanceToNextCursor,
} = MemberFilterSlice.actions;

export default MemberFilterSlice.reducer;
