import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ORDER_DIRECTION } from '@/constants/constant';
import { Worship } from '@/models/worship/worship';
import { RootState } from '@/redux/store';
import { WorshipsApi } from '@/api/worship/worships.api';

import { WORSHIP } from '@/constants/column/worship-column';

type WORSHIP_FILTER = {};

type WorshipFilterState = {
  worships: Worship[];
  worshipFilter: WORSHIP_FILTER;
  worshipOrderBy?: WORSHIP;
  worshipOrderDirection: ORDER_DIRECTION;
  worshipTableHeaderItemList: WORSHIP_TABLE_HEADER_ITEM[];
};

export const INITIAL_WORSHIP_FILTER: WORSHIP_FILTER = {};

export type WORSHIP_TABLE_HEADER_ITEM = {
  id: WORSHIP;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_WORSHIP_TABLE_HEADER_LIST: WORSHIP_TABLE_HEADER_ITEM[] = [
  {
    id: WORSHIP.TITLE,
    isShown: true,
    isSortable: false,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
];

const initialState: WorshipFilterState = {
  worships: [],
  worshipFilter: INITIAL_WORSHIP_FILTER,
  worshipOrderDirection: ORDER_DIRECTION.ASC,
  worshipTableHeaderItemList: INITIAL_WORSHIP_TABLE_HEADER_LIST,
};

export const fetchWorships = createAsyncThunk<
  Worship[],
  { currentPage: number },
  { state: RootState }
>(
  'worships/fetchWorships',
  async ({ currentPage }, { getState, rejectWithValue }) => {
    const state = getState().worshipFilter;
    const { worshipOrderBy, worshipOrderDirection, worshipFilter } = state;
    const churchId = getState().church.churchId;
    const worshipsApi = new WorshipsApi(false);

    try {
      const response = await worshipsApi.getWorships({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: worshipOrderBy || undefined,
        orderDirection: worshipOrderDirection,
      });

      return response.data.data;
    } catch (error) {
      console.error('교육 목록 불러오기 실패', error);
      return rejectWithValue('교육 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const WorshipFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setWorships: (state, action: PayloadAction<Worship[]>) => {
      state.worships = action.payload;
    },
    setWorshipFilter: (state, action: PayloadAction<WORSHIP_FILTER>) => {
      state.worshipFilter = action.payload;
    },
    setWorshipOrderBy(state, action: PayloadAction<WORSHIP>) {
      state.worshipOrderBy = action.payload;
    },
    setWorshipOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.worshipOrderDirection = action.payload;
    },
    setWorshipTableHeaderItemList(
      state,
      action: PayloadAction<WORSHIP_TABLE_HEADER_ITEM[]>
    ) {
      state.worshipTableHeaderItemList = action.payload;
    },
  },
});

export const {
  setWorships,
  setWorshipFilter,
  setWorshipOrderBy,
  setWorshipOrderDirection,
  setWorshipTableHeaderItemList,
} = WorshipFilterSlice.actions;
export default WorshipFilterSlice.reducer;
