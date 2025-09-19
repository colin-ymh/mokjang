import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BLANK,
  CHURCH_USER,
  DESTRUCTIVE,
  ORDER_DIRECTION,
} from '@mokjang/constants';
import { RootState } from '../../store';
import { ChurchUser } from '@mokjang/models';
import { ChurchUsersApi } from '../../../api/church-users/church-users.api';
import { ManagersApi } from '../../../api/managers/managers.api';
import axios from 'axios';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

export type CHURCH_USER_FILTER = {
  [CHURCH_USER.NAME]: string;
  [CHURCH_USER.PERMISSION_ACTIVE]?: boolean;
};

export type CHURCH_USER_TABLE_HEADER_ITEM = {
  id: CHURCH_USER;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_CHURCH_USER_FILTER: CHURCH_USER_FILTER = {
  [CHURCH_USER.NAME]: BLANK,
};

export const INITIAL_CHURCH_USER_TABLE_HEADER_LIST: CHURCH_USER_TABLE_HEADER_ITEM[] =
  [
    {
      id: CHURCH_USER.MEMBER,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: CHURCH_USER.PERMISSION_TEMPLATE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: CHURCH_USER.PERMISSION_SCOPE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: CHURCH_USER.JOINED_AT,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: CHURCH_USER.PERMISSION_ACTIVE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

type ChurchUserFilterState = {
  churchUsers: ChurchUser[];
  churchUserFilter: CHURCH_USER_FILTER;
  churchUserOrderBy?: CHURCH_USER;
  churchUserOrderDirection: ORDER_DIRECTION;
  churchUserTableHeaderItemList: CHURCH_USER_TABLE_HEADER_ITEM[];
  page: number;
};

const initialState: ChurchUserFilterState = {
  churchUsers: [],
  churchUserFilter: INITIAL_CHURCH_USER_FILTER,
  churchUserOrderDirection: ORDER_DIRECTION.ASC,
  churchUserTableHeaderItemList: INITIAL_CHURCH_USER_TABLE_HEADER_LIST,
  page: 1,
};

const PAGE_SIZE = 30;

export const fetchChurchUsers = createAsyncThunk<
  ChurchUser[],
  { currentPage: number; isManager: boolean },
  { state: RootState }
>(
  'churchUsers/fetchChurchUsers',
  async (
    { currentPage, isManager },
    { getState, dispatch, rejectWithValue }
  ) => {
    const { churchUserOrderBy, churchUserOrderDirection, churchUserFilter } =
      getState().churchUserFilter;

    const churchId = getState().church.churchId;

    const churchUsersApi = new ChurchUsersApi(false);
    const managersApi = new ManagersApi(false);

    try {
      const commonParams = {
        churchId,
        page: currentPage,
        take: PAGE_SIZE,
        order: churchUserOrderBy,
        orderDirection: churchUserOrderDirection,
      };

      const response = isManager
        ? await managersApi.getManagers({
            ...commonParams,
            name: churchUserFilter.name,
            isPermissionActive: churchUserFilter.permissionActive,
          })
        : await churchUsersApi.getChurchUsers(commonParams);

      return response.data.data;
    } catch (error) {
      let message = '관리자 목록을 불러오는 중 오류가 발생했습니다.';

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      dispatch(setToastText(message));
      dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
      dispatch(setIsToastShown(true));

      return rejectWithValue(message);
    }
  }
);

const ChurchUserFilterSlice = createSlice({
  name: 'churchUser',
  initialState,
  reducers: {
    setChurchUsers: (state, action: PayloadAction<ChurchUser[]>) => {
      state.churchUsers = action.payload;
    },
    setChurchUserFilter: (state, action: PayloadAction<CHURCH_USER_FILTER>) => {
      state.churchUserFilter = action.payload;
    },
    setChurchUserOrderBy: (state, action: PayloadAction<CHURCH_USER>) => {
      state.churchUserOrderBy = action.payload;
    },
    setChurchUserOrderDirection: (
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) => {
      state.churchUserOrderDirection = action.payload;
    },
    setChurchUserTableHeaderItemList: (
      state,
      action: PayloadAction<CHURCH_USER_TABLE_HEADER_ITEM[]>
    ) => {
      state.churchUserTableHeaderItemList = action.payload;
    },
    setChurchUserPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },
});

export const {
  setChurchUsers,
  setChurchUserFilter,
  setChurchUserOrderBy,
  setChurchUserOrderDirection,
  setChurchUserTableHeaderItemList,
  setChurchUserPage,
} = ChurchUserFilterSlice.actions;

export default ChurchUserFilterSlice.reducer;
