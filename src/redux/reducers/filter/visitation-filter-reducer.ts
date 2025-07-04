import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import {
  Visitation,
  VISITATION_METHOD,
  VISITATION_TYPE,
} from '@/models/visitation/visitation';
import { RootState } from '@/redux/store';
import { VisitationsApi } from '@/api/visitations/visitations.api';
import { VISITATION } from '@/constants/visitation/visitation-column';
import { VISITATION_STATUS } from '@/constants/status/status';
import { VisitationReportsApi } from '@/api/reports/visitation-reports.api';
import { VisitationReport } from '@/models/report/report';

type VISITATION_FILTER = {
  [VISITATION.FROM_DATE]: string;
  [VISITATION.TO_DATE]: string;
  [VISITATION.STATUS]: VISITATION_STATUS[];
  [VISITATION.METHOD]: VISITATION_METHOD[];
  [VISITATION.TYPE]: VISITATION_TYPE[];
  [VISITATION.TITLE]: string;
  [VISITATION.IN_CHARGE]: string;
};

type VisitationFilterState = {
  visitations: Visitation[];
  visitationFilter: VISITATION_FILTER;
  visitationOrderBy: VISITATION | typeof NULL;
  visitationOrderDirection: ORDER_DIRECTION;
  visitationTableHeaderItemList: VISITATION_TABLE_HEADER_ITEM[];
};

export const INITIAL_VISITATION_FILTER: VISITATION_FILTER = {
  [VISITATION.FROM_DATE]: BLANK,
  [VISITATION.TO_DATE]: BLANK,
  [VISITATION.STATUS]: [],
  [VISITATION.METHOD]: [],
  [VISITATION.TYPE]: [],
  [VISITATION.TITLE]: BLANK,
  [VISITATION.IN_CHARGE]: BLANK,
};

export type VISITATION_TABLE_HEADER_ITEM = {
  id: VISITATION;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_VISITATION_TABLE_HEADER_LIST: VISITATION_TABLE_HEADER_ITEM[] =
  [
    {
      id: VISITATION.TITLE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: VISITATION.VISITED,
      isShown: true,
      isSortable: false,
      isFilterable: false,
      isFixed: true,
      isDate: false,
    },
    {
      id: VISITATION.STATUS,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: VISITATION.DATE,
      isShown: true,
      isSortable: true,
      isFilterable: true,
      isFixed: true,
      isDate: true,
    },
    {
      id: VISITATION.IN_CHARGE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

const initialState: VisitationFilterState = {
  visitations: [],
  visitationFilter: INITIAL_VISITATION_FILTER,
  visitationOrderBy: NULL,
  visitationOrderDirection: ORDER_DIRECTION.ASC,
  visitationTableHeaderItemList: INITIAL_VISITATION_TABLE_HEADER_LIST,
};

export const fetchVisitations = createAsyncThunk<
  Visitation[],
  {
    currentPage: number;
    inChargeId?: string;
    memberId?: string;
  },
  { state: RootState }
>(
  'visitations/fetchVisitations',
  async (
    { currentPage, inChargeId, memberId },
    { getState, rejectWithValue }
  ) => {
    const state = getState().visitationFilter;
    const churchId = getState().church.churchId;
    const { visitationOrderBy, visitationOrderDirection, visitationFilter } =
      state;
    const visitationsApi = new VisitationsApi(false);
    const visitationReportsApi = new VisitationReportsApi(false);

    try {
      if (memberId) {
        const response = await visitationReportsApi.getVisitationReports({
          churchId,
          memberId,
          page: currentPage,
          take: 30, // 무한 스크롤 최적화
          order: visitationOrderBy !== NULL ? visitationOrderBy : undefined,
          orderDirection: visitationOrderDirection,
          // 필터
          // visitationStatus: visitationFilter.visitationStatus,
          // visitationMethod: visitationFilter.visitationMethod,
          // visitationType: visitationFilter.visitationType,
          // visitationTitle: visitationFilter.visitationTitle,
          // inChargeId: inChargeId || visitationFilter.inChargeId,
          // fromStartDate: visitationFilter.fromStartDate,
          // toStartDate: visitationFilter.toStartDate,
          // 검색
        });

        const visitationReports: VisitationReport[] = response.data.data;

        const newVisitations = visitationReports.map((report) => {
          return report.visitation;
        });

        console.log(newVisitations);

        return newVisitations;
      } else {
        const response = await visitationsApi.getVisitations({
          churchId,
          page: currentPage,
          take: 30, // 무한 스크롤 최적화
          order: visitationOrderBy !== NULL ? visitationOrderBy : undefined,
          orderDirection: visitationOrderDirection,
          // 필터
          status: visitationFilter.status,
          visitationMethod: visitationFilter.visitationMethod,
          visitationType: visitationFilter.visitationType,
          title: visitationFilter.title,
          inChargeId: inChargeId || visitationFilter.inChargeId,
          fromStartDate: visitationFilter.fromStartDate,
          toStartDate: visitationFilter.toStartDate,
          // 검색
        });

        return response.data.data;
      }
    } catch (error) {
      console.error('심방 목록 불러오기 실패', error);
      return rejectWithValue('심방 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const VisitationFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setVisitations: (state, action: PayloadAction<Visitation[]>) => {
      state.visitations = action.payload;
    },
    setVisitationFilter: (state, action: PayloadAction<VISITATION_FILTER>) => {
      state.visitationFilter = action.payload;
    },
    setVisitationOrderBy(
      state,
      action: PayloadAction<VISITATION | typeof NULL>
    ) {
      state.visitationOrderBy = action.payload;
    },
    setVisitationOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.visitationOrderDirection = action.payload;
    },
  },
});

export const {
  setVisitations,
  setVisitationFilter,
  setVisitationOrderBy,
  setVisitationOrderDirection,
} = VisitationFilterSlice.actions;
export default VisitationFilterSlice.reducer;
