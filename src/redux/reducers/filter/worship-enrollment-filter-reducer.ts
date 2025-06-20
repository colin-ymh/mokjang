import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { RootState } from '@/redux/store';
import { WORSHIP_ENROLLMENT } from '@/constants/worship/worship-column';
import { WorshipEnrollment } from '@/models/worship/worship';
import { WorshipEnrollmentsApi } from '@/api/worship/worship-enrollments.api';

type WORSHIP_ENROLLMENT_FILTER = {
  [WORSHIP_ENROLLMENT.GROUP]: string;
  [WORSHIP_ENROLLMENT.FROM_DATE]: string;
  [WORSHIP_ENROLLMENT.TO_DATE]: string;
};

type WorshipEnrollmentFilterState = {
  worshipEnrollments: WorshipEnrollment[];
  worshipEnrollmentFilter: WORSHIP_ENROLLMENT_FILTER;
  worshipEnrollmentOrderBy: WORSHIP_ENROLLMENT | typeof NULL;
  worshipEnrollmentOrderDirection: ORDER_DIRECTION;
  worshipEnrollmentTableHeaderItemList: EDUCATION_TABLE_HEADER_ITEM[];
};

export const INITIAL_WORSHIP_ENROLLMENT_FILTER: WORSHIP_ENROLLMENT_FILTER = {
  [WORSHIP_ENROLLMENT.GROUP]: BLANK,
  [WORSHIP_ENROLLMENT.FROM_DATE]: BLANK,
  [WORSHIP_ENROLLMENT.TO_DATE]: BLANK,
};

export type EDUCATION_TABLE_HEADER_ITEM = {
  id: WORSHIP_ENROLLMENT;
  isSortable: boolean;
  isFilterable: boolean;
  isSession: boolean;
  isDate?: boolean;
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
      id: WORSHIP_ENROLLMENT.GROUP,
      isSortable: true,
      isFilterable: false,
      isSession: false,
      isDate: false,
    },
    {
      id: WORSHIP_ENROLLMENT.ATTENDANCE_RATE,
      isSortable: false,
      isFilterable: true,
      isSession: false,
      isDate: false,
    },
  ];

const initialState: WorshipEnrollmentFilterState = {
  worshipEnrollments: [],
  worshipEnrollmentFilter: INITIAL_WORSHIP_ENROLLMENT_FILTER,
  worshipEnrollmentOrderBy: NULL,
  worshipEnrollmentOrderDirection: ORDER_DIRECTION.ASC,
  worshipEnrollmentTableHeaderItemList:
    INITIAL_WORSHIP_ENROLLMENT_TABLE_HEADER_LIST,
};

export const fetchWorshipEnrollments = createAsyncThunk<
  WorshipEnrollment[],
  {
    churchId: string;
    currentPage: number;
    worshipId: string;
  },
  { state: RootState }
>(
  'educations/fetchWorshipEnrollments',
  async (
    { churchId, worshipId, currentPage },
    { getState, rejectWithValue }
  ) => {
    const state = getState().worshipEnrollmentFilter;
    const {
      worshipEnrollmentOrderBy,
      worshipEnrollmentOrderDirection,
      worshipEnrollmentFilter,
    } = state;
    const worshipEnrollmentsApi = new WorshipEnrollmentsApi(false);

    try {
      const response = await worshipEnrollmentsApi.getWorshipEnrollments({
        churchId,
        worshipId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: undefined,
        orderDirection: worshipEnrollmentOrderDirection,
        groupId: worshipEnrollmentFilter.group,
      });

      return response.data.data;
    } catch (error) {
      console.error('출석 목록 불러오기 실패', error);
      return rejectWithValue('출석 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const WorshipEnrollmentFilterSlice = createSlice({
  name: 'register',
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
      action: PayloadAction<WORSHIP_ENROLLMENT | typeof NULL>
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
  },
});

export const {
  setWorshipEnrollments,
  setWorshipEnrollmentFilter,
  setWorshipEnrollmentOrderBy,
  setWorshipEnrollmentOrderDirection,
  setWorshipEnrollmentTableHeaderItemList,
} = WorshipEnrollmentFilterSlice.actions;
export default WorshipEnrollmentFilterSlice.reducer;
