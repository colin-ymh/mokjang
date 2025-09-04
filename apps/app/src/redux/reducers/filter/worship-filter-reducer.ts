import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ORDER_DIRECTION } from '@mokjang/constants';
import { Worship } from '@mokjang/models';
import { RootState } from '../../store';
import { WorshipsApi } from '../../../api/worship/worships.api';

import { WORSHIP } from '@mokjang/constants';

type WORSHIP_FILTER = {};

type WorshipFilterState = {
  worships: Worship[];
  worshipFilter: WORSHIP_FILTER;
  worshipOrderBy?: WORSHIP;
  worshipOrderDirection: ORDER_DIRECTION;
  worshipTableHeaderItemList: WORSHIP_TABLE_HEADER_ITEM[];
  worshipPage: number;
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
    isSortable: true,
    isFilterable: true,
    isFixed: true,
    isDate: false,
  },
  {
    id: WORSHIP.WORSHIP_DAY,
    isShown: true,
    isSortable: true,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: WORSHIP.GROUP,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
  {
    id: WORSHIP.ATTENDANCE,
    isShown: true,
    isSortable: false,
    isFilterable: false,
    isFixed: true,
    isDate: false,
  },
];

const initialState: WorshipFilterState = {
  worships: [],
  worshipFilter: INITIAL_WORSHIP_FILTER,
  worshipOrderDirection: ORDER_DIRECTION.ASC,
  worshipTableHeaderItemList: INITIAL_WORSHIP_TABLE_HEADER_LIST,
  worshipPage: 1,
};

export const fetchWorships = createAsyncThunk<
  Worship[],
  void,
  { state: RootState }
>('worships/fetchWorships', async (_, { getState, rejectWithValue }) => {
  const state = getState().worshipFilter;
  const { worshipPage, worshipOrderBy, worshipOrderDirection, worships } =
    state;
  const churchId = getState().church.churchId;
  const worshipsApi = new WorshipsApi(false);

  try {
    const response = await worshipsApi.getWorships({
      churchId,
      page: worshipPage,
      take: 30, // 무한 스크롤 최적화
      order: worshipOrderBy || undefined,
      orderDirection: worshipOrderDirection,
    });

    const newWorships: Worship[] = response.data.data;
    const existingIds = new Set(worships.map((worship) => worship.id));
    const filteredNewWorships = newWorships.filter(
      (worship) => !existingIds.has(worship.id)
    );

    const updatedWorships =
      worshipPage === 1 ? newWorships : [...worships, ...filteredNewWorships];

    return updatedWorships;
  } catch (error) {
    console.error('교육 목록 불러오기 실패', error);
    return rejectWithValue('교육 목록을 불러오는 중 오류가 발생했습니다.');
  }
});

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
    setWorshipPage: (state, action: PayloadAction<number>) => {
      state.worshipPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWorships.fulfilled, (state, action) => {
      state.worships = action.payload;
    });
  },
});

export const {
  setWorships,
  setWorshipFilter,
  setWorshipOrderBy,
  setWorshipOrderDirection,
  setWorshipTableHeaderItemList,
  setWorshipPage,
} = WorshipFilterSlice.actions;
export default WorshipFilterSlice.reducer;
