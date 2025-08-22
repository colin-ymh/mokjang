import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, ORDER_DIRECTION } from '@/constants/constant';
import { RootState } from '@/redux/store';
import { WORSHIP_ATTENDANCE } from '@/constants/column/worship-column';
import { WorshipAttendance } from '@/models/worship/worship';
import { WorshipAttendancesApi } from '@/api/worship/worship-attendances.api';

type WORSHIP_ATTENDANCE_FILTER = {};

type WorshipAttendanceFilterState = {
  prevWorshipAttendances: WorshipAttendance[];
  worshipAttendances: WorshipAttendance[];
  worshipAttendanceFilter: WORSHIP_ATTENDANCE_FILTER;
  worshipAttendanceSortBy?: WORSHIP_ATTENDANCE;
  worshipAttendanceSortDirection: ORDER_DIRECTION;
  worshipAttendanceTableHeaderItemList: ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM[];
  worshipAttendanceCursor: string;

  // 페이지네이션 메타
  nextCursor?: string | null;
  hasMore: boolean;

  // UI 상태
  loading: boolean;
  error: string | null;
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
      isSortable: true,
      isFilterable: false,
    },
    {
      id: WORSHIP_ATTENDANCE.GROUP_NAME,
      isSortable: true,
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
  prevWorshipAttendances: [],
  worshipAttendances: [],
  worshipAttendanceFilter: INITIAL_WORSHIP_ATTENDANCE_FILTER,
  worshipAttendanceSortBy: WORSHIP_ATTENDANCE.GROUP_NAME,
  worshipAttendanceSortDirection: ORDER_DIRECTION.ASC,
  worshipAttendanceTableHeaderItemList: INITIAL_WORSHIP_INFORMATION_HEADER_LIST,
  worshipAttendanceCursor: BLANK,

  nextCursor: null,
  hasMore: false,
  loading: false,
  error: null,
};

// thunk 반환 타입 정의
type FetchAttendancesResult = {
  data: WorshipAttendance[];
  nextCursor: string | null;
  hasMore: boolean;
};

export const fetchWorshipAttendances = createAsyncThunk<
  FetchAttendancesResult,
  void,
  { state: RootState }
>(
  'worship/fetchWorshipAttendances',
  async (_, { getState, rejectWithValue }) => {
    const { churchId } = getState().church;
    const {
      targetWorshipSessionWorship,
      targetWorshipSession,
      targetWorshipSessionGroup,
    } = getState().targetWorshipSession;
    const state = getState().worshipAttendanceFilter;
    const {
      worshipAttendanceSortBy,
      worshipAttendanceSortDirection,
      worshipAttendanceCursor,
    } = state;
    const worshipAttendancesApi = new WorshipAttendancesApi(false);

    try {
      const response = await worshipAttendancesApi.getWorshipAttendances({
        churchId,
        worshipId: targetWorshipSessionWorship.id,
        sessionId: targetWorshipSession.id,
        cursor: worshipAttendanceCursor,
        limit: 30, // 무한 스크롤 최적화
        sortBy: worshipAttendanceSortBy,
        sortDirection: worshipAttendanceSortDirection,
        groupId: targetWorshipSessionGroup.id || undefined,
      });

      return response.data;
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
    setPrevWorshipAttendances: (
      state,
      action: PayloadAction<WorshipAttendance[]>
    ) => {
      state.prevWorshipAttendances = action.payload;
    },
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
    setWorshipAttendanceSortBy(
      state,
      action: PayloadAction<WORSHIP_ATTENDANCE>
    ) {
      state.worshipAttendanceSortBy = action.payload;
    },
    setWorshipAttendanceSortDirection(
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) {
      state.worshipAttendanceSortDirection = action.payload;
    },
    setWorshipAttendanceTableHeaderItemList(
      state,
      action: PayloadAction<ATTENDANCE_INFORMATION_TABLE_HEADER_ITEM[]>
    ) {
      state.worshipAttendanceTableHeaderItemList = action.payload;
    },
    setWorshipAttendanceCursor: (state, action: PayloadAction<string>) => {
      state.worshipAttendanceCursor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorshipAttendances.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorshipAttendances.fulfilled, (state, action) => {
        const newAttendances = action.payload.data;
        // Merge with existing worshipAttendances, deduplicating by id
        const existingMap = new Map(
          state.worshipAttendances.map((a) => [a.id, a])
        );
        newAttendances.forEach((attendance) => {
          existingMap.set(attendance.id, attendance);
        });
        state.worshipAttendances = Array.from(existingMap.values());
        state.nextCursor = action.payload.nextCursor;
        state.hasMore = action.payload.hasMore;
        state.worshipAttendanceCursor = action.payload.nextCursor ?? BLANK;
        state.loading = false;
      })
      .addCase(fetchWorshipAttendances.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setPrevWorshipAttendances,
  setWorshipAttendances,
  setWorshipAttendanceFilter,
  setWorshipAttendanceSortBy,
  setWorshipAttendanceSortDirection,
  setWorshipAttendanceTableHeaderItemList,
  setWorshipAttendanceCursor,
} = WorshipAttendanceFilterSlice.actions;
export default WorshipAttendanceFilterSlice.reducer;
