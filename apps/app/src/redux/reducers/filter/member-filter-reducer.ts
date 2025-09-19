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
  groupId?: string | null;
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

  nextCursor?: string | null;
  hasMore: boolean;

  loading: boolean;
  error: string | null;
};

export const INITIAL_MEMBER_FILTER: MEMBER_FILTER = {
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

/* -------------------- LocalStorage Persist -------------------- */
const STORAGE_KEY = 'memberFilterState';

// 저장된 상태 불러오기
function loadPersistedState(): Partial<MemberFilterState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Partial<MemberFilterState>;
  } catch {
    return {};
  }
}

// 필요한 상태만 저장
function savePersistedState(state: MemberFilterState) {
  if (typeof window === 'undefined') return;
  const toSave = {
    memberFilter: state.memberFilter,
    memberSortBy: state.memberSortBy,
    memberSortDirection: state.memberSortDirection,
    memberTableHeaderItemList: state.memberTableHeaderItemList,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

const persisted = loadPersistedState();

const initialState: MemberFilterState = {
  members: [],
  memberFilter: persisted.memberFilter ?? INITIAL_MEMBER_FILTER,
  memberSortBy: persisted.memberSortBy,
  memberSortDirection: persisted.memberSortDirection ?? ORDER_DIRECTION.ASC,
  memberTableHeaderItemList:
    persisted.memberTableHeaderItemList ?? INITIAL_TABLE_HEADER_LIST,
  filteredItems: [],
  memberCursor: BLANK,
  nextCursor: null,
  hasMore: false,
  loading: false,
  error: null,
};

// thunk 반환 타입 정의
type FetchMembersResult = {
  members: Member[];
  nextCursor: string | null;
  hasMore: boolean;
};

// 교인 불러오기
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
    groupId,
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
    let sort = memberSortBy;
    if (sort === MEMBER.AGE) sort = MEMBER.BIRTH;

    const sanitizedDisplayColumns = Array.from(
      new Set(
        displayColumns
          .filter((col) => col !== 'profileImage' && col !== 'name')
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
      groupId: groupId === ALL ? undefined : groupId,
      officerIds,
      marriageStatuses,
      baptismStatuses,
      birthFrom,
      birthTo,
      registeredFrom,
      registeredTo,
      displayColumns: sanitizedDisplayColumns,
      search,
    });

    const newMembers: Member[] = response.data.data;
    const existingIds = new Set(members.map((m) => m.id));
    const filteredNew = newMembers.filter((m) => !existingIds.has(m.id));

    const updatedMembers =
      memberCursor === BLANK ? newMembers : [...members, ...filteredNew];

    return {
      members: updatedMembers,
      nextCursor: response.data.nextCursor ?? null,
      hasMore: Boolean(response.data.hasMore),
    };
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
      savePersistedState(state);
    },
    setMemberSortBy: (state, action: PayloadAction<MEMBER>) => {
      state.memberSortBy = action.payload;
      savePersistedState(state);
    },
    setMemberSortDirection: (state, action: PayloadAction<ORDER_DIRECTION>) => {
      state.memberSortDirection = action.payload;
      savePersistedState(state);
    },
    setMemberTableHeaderItemList: (
      state,
      action: PayloadAction<MEMBER_TABLE_HEADER_ITEM[]>
    ) => {
      state.memberTableHeaderItemList = action.payload;
      savePersistedState(state);
    },
    setFilteredItems: (state, action: PayloadAction<FilteredItemType[]>) => {
      state.filteredItems = action.payload;
    },
    setMemberCursor: (state, action: PayloadAction<string>) => {
      state.memberCursor = action.payload;
    },
    advanceToNextCursor: (state) => {
      if (state.nextCursor) state.memberCursor = state.nextCursor;
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
