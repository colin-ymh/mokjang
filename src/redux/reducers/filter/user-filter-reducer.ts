import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { RootState } from '@/redux/store';
import { USER } from '@/constants/user/user-column';
import { User } from '@/models/user/user';
import { UserMembersApi } from '@/api/user-members/user-members.api';
import { MEMBER } from '@/constants/member/member-column';

type USER_FILTER = {
  [USER.NAME]: string;
};

type UserFilterState = {
  users: User[];
  userFilter: USER_FILTER;
  userOrderBy: USER | MEMBER | typeof NULL;
  userOrderDirection: ORDER_DIRECTION;
  userTableHeaderItemList: USER_TABLE_HEADER_ITEM[];
};

export const INITIAL_USER_FILTER: USER_FILTER = {
  [USER.NAME]: BLANK,
};

export type USER_TABLE_HEADER_ITEM = {
  id: USER | MEMBER;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_USER_TABLE_HEADER_LIST: USER_TABLE_HEADER_ITEM[] = [
  {
    id: USER.NAME,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
  {
    id: USER.MOBILE_PHONE,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
  {
    id: MEMBER.NAME,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
];

const initialState: UserFilterState = {
  users: [],
  userFilter: INITIAL_USER_FILTER,
  userOrderBy: NULL,
  userOrderDirection: ORDER_DIRECTION.ASC,
  userTableHeaderItemList: INITIAL_USER_TABLE_HEADER_LIST,
};

export const fetchUsers = createAsyncThunk<
  User[],
  { churchId: string; currentPage: number },
  { state: RootState }
>(
  'users/fetchUsers',
  async ({ churchId, currentPage }, { getState, rejectWithValue }) => {
    const state = getState().userFilter;
    const { userOrderBy, userOrderDirection, userFilter } = state;
    const usersApi = new UserMembersApi(false);

    try {
      const response = await usersApi.getUserMembers({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: userOrderBy !== NULL ? userOrderBy : undefined,
        orderDirection: userOrderDirection,
        name: userFilter.name,
        selectedColumns: [USER.MOBILE_PHONE],
      });

      return response.data.data;
    } catch (error) {
      console.error('회원 목록 불러오기 실패', error);
      return rejectWithValue('회원 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const UserFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    setUserFilter: (state, action: PayloadAction<USER_FILTER>) => {
      state.userFilter = action.payload;
    },
    setUserOrderBy(state, action: PayloadAction<USER | MEMBER | typeof NULL>) {
      state.userOrderBy = action.payload;
    },
    setUserOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.userOrderDirection = action.payload;
    },
    setUserTableHeaderItemList(
      state,
      action: PayloadAction<USER_TABLE_HEADER_ITEM[]>
    ) {
      state.userTableHeaderItemList = action.payload;
    },
  },
});

export const {
  setUsers,
  setUserFilter,
  setUserOrderBy,
  setUserOrderDirection,
  setUserTableHeaderItemList,
} = UserFilterSlice.actions;
export default UserFilterSlice.reducer;
