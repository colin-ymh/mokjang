import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ALL,
  BLANK,
  DESTRUCTIVE,
  ORDER_DIRECTION,
  WORSHIP_ENROLLMENT,
} from '@mokjang/constants';
import { RootState } from '../../store';
import { WorshipEnrollment, WorshipSessionCheckStatus } from '@mokjang/models';
import { WorshipEnrollmentsApi } from '@/api/worship/worship-enrollments.api';
import { WorshipSessionsApi } from '@/api/worship/worship-sessions.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';

type WORSHIP_ENROLLMENT_FILTER = {
  [WORSHIP_ENROLLMENT.GROUP_NAME]: string;
  [WORSHIP_ENROLLMENT.GROUP]: string | undefined | null;
  [WORSHIP_ENROLLMENT.FROM_DATE]: string;
  [WORSHIP_ENROLLMENT.TO_DATE]: string;
};

export type EDUCATION_TABLE_HEADER_ITEM = {
  id: WORSHIP_ENROLLMENT | string;
  isSortable: boolean;
  isFilterable: boolean;
  isSession: boolean;
  isDate?: boolean;
  title?: string;
  date?: Date;
};

type WorshipEnrollmentFilterState = {
  worshipEnrollments: WorshipEnrollment[];
  worshipEnrollmentFilter: WORSHIP_ENROLLMENT_FILTER;
  worshipEnrollmentOrderBy?: WORSHIP_ENROLLMENT;
  worshipEnrollmentOrderDirection: ORDER_DIRECTION;
  worshipEnrollmentTableHeaderItemList: EDUCATION_TABLE_HEADER_ITEM[];
  worshipEnrollmentTotalCount: number;

  // ✅ 새로 추가
  checkStatuses: WorshipSessionCheckStatus[];
  isCheckStatusesLoading: boolean;
  checkStatusesError?: string | null;
};

export const INITIAL_WORSHIP_ENROLLMENT_FILTER: WORSHIP_ENROLLMENT_FILTER = {
  [WORSHIP_ENROLLMENT.GROUP_NAME]: BLANK,
  [WORSHIP_ENROLLMENT.GROUP]: BLANK,
  [WORSHIP_ENROLLMENT.FROM_DATE]: BLANK,
  [WORSHIP_ENROLLMENT.TO_DATE]: BLANK,
};

export const INITIAL_WORSHIP_ENROLLMENT_TABLE_HEADER_LIST: EDUCATION_TABLE_HEADER_ITEM[] =
  [
    {
      id: WORSHIP_ENROLLMENT.NAME,
      isSortable: true,
      isFilterable: false,
      isSession: false,
      isDate: false,
    },
    {
      id: WORSHIP_ENROLLMENT.GROUP_NAME,
      isSortable: true,
      isFilterable: false,
      isSession: false,
      isDate: false,
    },
    {
      id: WORSHIP_ENROLLMENT.ATTENDANCE_RATE,
      isSortable: true,
      isFilterable: true,
      isSession: false,
      isDate: false,
    },
  ];

const initialState: WorshipEnrollmentFilterState = {
  worshipEnrollments: [],
  worshipEnrollmentFilter: INITIAL_WORSHIP_ENROLLMENT_FILTER,
  worshipEnrollmentOrderBy: WORSHIP_ENROLLMENT.GROUP_NAME,
  worshipEnrollmentOrderDirection: ORDER_DIRECTION.ASC,
  worshipEnrollmentTableHeaderItemList:
    INITIAL_WORSHIP_ENROLLMENT_TABLE_HEADER_LIST,
  worshipEnrollmentTotalCount: 0,

  // ✅ 초기값
  checkStatuses: [],
  isCheckStatusesLoading: false,
  checkStatusesError: null,
};

// ===== 예배 출석 목록 =====
export const fetchWorshipEnrollments = createAsyncThunk<
  { data: WorshipEnrollment[]; totalCount: number },
  { churchId: string; currentPage: number; worshipId: string; take: number },
  { state: RootState }
>(
  'educations/fetchWorshipEnrollments',
  async (
    { churchId, worshipId, currentPage, take },
    { getState, rejectWithValue, dispatch }
  ) => {
    const state = getState().worshipEnrollmentFilter;
    const {
      worshipEnrollmentOrderBy,
      worshipEnrollmentOrderDirection,
      worshipEnrollmentFilter,
    } = state;
    const api = new WorshipEnrollmentsApi(false);

    try {
      const response = await api.getWorshipEnrollments({
        churchId,
        worshipId,
        page: currentPage,
        take,
        order: worshipEnrollmentOrderBy,
        orderDirection: worshipEnrollmentOrderDirection,
        groupId:
          worshipEnrollmentFilter.group === null
            ? 'null'
            : worshipEnrollmentFilter.group,
        fromSessionDate: worshipEnrollmentFilter.fromSessionDate,
        toSessionDate: worshipEnrollmentFilter.toSessionDate,
      });

      return response.data;
    } catch (error) {
      // console.error('출석 목록 불러오기 실패', error);
      // return rejectWithValue('출석 목록을 불러오는 중 오류가 발생했습니다.');
      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
      }

      return { data: [] };
    }
  }
);

// ===== 예배 체크 현황 =====
export const fetchWorshipSessionCheckStatus = createAsyncThunk<
  WorshipSessionCheckStatus[],
  void,
  { state: RootState }
>(
  'educations/fetchWorshipSessionCheckStatus',
  async (_: void, { getState, rejectWithValue, fulfillWithValue }) => {
    const api = new WorshipSessionsApi(false);
    const { churchId } = getState().church;
    const { targetWorship, targetWorshipGroup } = getState().targetWorship;
    const { worshipEnrollmentFilter } = getState().worshipEnrollmentFilter;

    if (
      !churchId ||
      !targetWorship?.id ||
      worshipEnrollmentFilter.fromSessionDate === BLANK ||
      worshipEnrollmentFilter.toSessionDate === BLANK
    ) {
      return fulfillWithValue([]); // 값 없으면 빈 배열 반환
    }

    try {
      const response = await api.getWorshipSessionCheckStatus({
        churchId,
        worshipId: targetWorship.id,
        groupId:
          targetWorshipGroup.id === ALL
            ? undefined
            : (targetWorshipGroup.id as string),
        from: worshipEnrollmentFilter.fromSessionDate,
        to: worshipEnrollmentFilter.toSessionDate,
      });

      return response.data.data as WorshipSessionCheckStatus[];
    } catch (error) {
      console.error('checkStatus 불러오기 실패', error);
      return rejectWithValue('출석 현황을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const WorshipEnrollmentFilterSlice = createSlice({
  name: 'worshipEnrollmentFilter',
  initialState,
  reducers: {
    setWorshipEnrollments: (
      state,
      action: PayloadAction<WorshipEnrollment[]>
    ) => {
      state.worshipEnrollments = action.payload;
    },
    setWorshipEnrollmentFilter: (
      state,
      action: PayloadAction<WORSHIP_ENROLLMENT_FILTER>
    ) => {
      state.worshipEnrollmentFilter = action.payload;
    },
    setWorshipEnrollmentOrderBy(
      state,
      action: PayloadAction<WORSHIP_ENROLLMENT>
    ) {
      state.worshipEnrollmentOrderBy = action.payload;
    },
    setWorshipEnrollmentOrderDirection(
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) {
      state.worshipEnrollmentOrderDirection = action.payload;
    },
    setWorshipEnrollmentTableHeaderItemList(
      state,
      action: PayloadAction<EDUCATION_TABLE_HEADER_ITEM[]>
    ) {
      state.worshipEnrollmentTableHeaderItemList = action.payload;
    },
    setWorshipEnrollmentTotalCount(state, action: PayloadAction<number>) {
      state.worshipEnrollmentTotalCount = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // worshipEnrollments
      .addCase(fetchWorshipEnrollments.fulfilled, (state, action) => {
        state.worshipEnrollments = action.payload.data;
        state.worshipEnrollmentTotalCount = action.payload.totalCount;
      })

      // checkStatuses
      .addCase(fetchWorshipSessionCheckStatus.pending, (state) => {
        state.isCheckStatusesLoading = true;
        state.checkStatusesError = null;
      })
      .addCase(fetchWorshipSessionCheckStatus.fulfilled, (state, action) => {
        state.isCheckStatusesLoading = false;
        state.checkStatuses = action.payload;
      })
      .addCase(fetchWorshipSessionCheckStatus.rejected, (state, action) => {
        state.isCheckStatusesLoading = false;
        state.checkStatusesError =
          (action.payload as string) || '알 수 없는 오류';
        state.checkStatuses = [];
      });
  },
});

export const {
  setWorshipEnrollments,
  setWorshipEnrollmentFilter,
  setWorshipEnrollmentOrderBy,
  setWorshipEnrollmentOrderDirection,
  setWorshipEnrollmentTableHeaderItemList,
  setWorshipEnrollmentTotalCount,
} = WorshipEnrollmentFilterSlice.actions;

export default WorshipEnrollmentFilterSlice.reducer;
