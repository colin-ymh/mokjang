import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ORDER_DIRECTION } from '@/constants/constant';
import { RootState } from '@/redux/store';
import { WORSHIP_ATTENDANCE } from '@/constants/worship/worship-column';
import { WorshipAttendance } from '@/models/worship/worship';
import { WorshipAttendancesApi } from '@/api/worship/worship-attendances.api';

type WORSHIP_ATTENDANCE_FILTER = {};

type WorshipAttendanceFilterState = {
  worshipAttendances: WorshipAttendance[];
  worshipAttendanceFilter: WORSHIP_ATTENDANCE_FILTER;
  worshipAttendanceOrderBy?: WORSHIP_ATTENDANCE;
  worshipAttendanceOrderDirection: ORDER_DIRECTION;
  worshipAttendanceTableHeaderItemList: ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM[];
};

export const INITIAL_WORSHIP_ATTENDANCE_FILTER: WORSHIP_ATTENDANCE_FILTER = {};

export type ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM = {
  id: WORSHIP_ATTENDANCE;
  isSortable: boolean;
  isFilterable: boolean;
  isCheck?: boolean;
};

export const INITIAL_WORSHIP_INFORMATION_HEADER_LIST: ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM[] =
  [
    {
      id: WORSHIP_ATTENDANCE.NAME,
      isSortable: false,
      isFilterable: false,
    },
    {
      id: WORSHIP_ATTENDANCE.PRESENT,
      isSortable: false,
      isFilterable: false,
      isCheck: true,
    },
    {
      id: WORSHIP_ATTENDANCE.ABSENT,
      isSortable: false,
      isFilterable: false,
      isCheck: true,
    },
    {
      id: WORSHIP_ATTENDANCE.NOTE,
      isSortable: false,
      isFilterable: false,
    },
  ];

const initialState: WorshipAttendanceFilterState = {
  worshipAttendances: [],
  worshipAttendanceFilter: INITIAL_WORSHIP_ATTENDANCE_FILTER,
  worshipAttendanceOrderDirection: ORDER_DIRECTION.ASC,
  worshipAttendanceTableHeaderItemList: INITIAL_WORSHIP_INFORMATION_HEADER_LIST,
};

export const fetchWorshipAttendances = createAsyncThunk<
  WorshipAttendance[],
  {
    churchId: string;
    currentPage: number;
    worshipId: string;
    sessionId: string;
    groupId?: string;
  },
  { state: RootState }
>(
  'educations/fetchWorshipAttendances',
  async (
    { churchId, worshipId, sessionId, currentPage, groupId },
    { getState, rejectWithValue }
  ) => {
    const state = getState().worshipAttendanceFilter;
    const {
      worshipAttendanceOrderBy,
      worshipAttendanceOrderDirection,
      worshipAttendanceFilter,
    } = state;
    const worshipAttendancesApi = new WorshipAttendancesApi(false);

    try {
      const response = await worshipAttendancesApi.getWorshipAttendances({
        churchId,
        worshipId,
        sessionId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: worshipAttendanceOrderBy,
        orderDirection: worshipAttendanceOrderDirection,
        groupId: groupId,
      });

      return response.data.data;
    } catch (error) {
      console.error('출석 목록 불러오기 실패', error);
      return rejectWithValue('출석 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const WorshipAttendanceFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setWorshipAttendances: (
      state,
      action: PayloadAction<WorshipAttendance[]>
    ) => {
      state.worshipAttendances = action.payload;
    },
    setWorshipAttendanceFilter: (
      state,
      action: PayloadAction<WORSHIP_ATTENDANCE_FILTER>
    ) => {
      state.worshipAttendanceFilter = action.payload;
    },
    setWorshipAttendanceOrderBy(
      state,
      action: PayloadAction<WORSHIP_ATTENDANCE>
    ) {
      state.worshipAttendanceOrderBy = action.payload;
    },
    setWorshipAttendanceOrderDirection(
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) {
      state.worshipAttendanceOrderDirection = action.payload;
    },
    setWorshipAttendanceTableHeaderItemList(
      state,
      action: PayloadAction<ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM[]>
    ) {
      state.worshipAttendanceTableHeaderItemList = action.payload;
    },
  },
});

export const {
  setWorshipAttendances,
  setWorshipAttendanceFilter,
  setWorshipAttendanceOrderBy,
  setWorshipAttendanceOrderDirection,
  setWorshipAttendanceTableHeaderItemList,
} = WorshipAttendanceFilterSlice.actions;
export default WorshipAttendanceFilterSlice.reducer;
