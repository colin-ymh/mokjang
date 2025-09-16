import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  BLANK,
  DESTRUCTIVE,
  HEADER_BAR,
  ORDER_DIRECTION,
  TASK_STATUS,
  VISITATION,
} from '@mokjang/constants';
import {
  DEFAULT_MEMBER,
  Member,
  Visitation,
  VisitationReport,
} from '@mokjang/models';
import { RootState } from '../../store';
import { VisitationsApi } from '../../../api/visitations/visitations.api';
import { VisitationReportsApi } from '../../../api/reports/visitation-reports.api';
import {
  setIsToastShown,
  setToastBackgroundColor,
  setToastText,
} from '@/redux/reducers/toast-popup-reducer';
import axios from 'axios';

type VISITATION_FILTER = {
  [VISITATION.STATUS]: TASK_STATUS[];
  [VISITATION.DATE]: string;
  [VISITATION.TITLE]: string;
  [VISITATION.IN_CHARGE]: Member;
  [VISITATION.FROM_DATE]: string;
  [VISITATION.TO_DATE]: string;
};

type VisitationFilterState = {
  visitations: Visitation[];
  visitationFilter: VISITATION_FILTER;
  visitationOrderBy?: VISITATION;
  visitationOrderDirection: ORDER_DIRECTION;
  visitationTableHeaderItemList: VISITATION_TABLE_HEADER_ITEM[];
  visitationPage: number;
};

export const INITIAL_VISITATION_FILTER: VISITATION_FILTER = {
  [VISITATION.STATUS]: [],
  [VISITATION.DATE]: BLANK,
  [VISITATION.TITLE]: BLANK,
  [VISITATION.IN_CHARGE]: DEFAULT_MEMBER,
  [VISITATION.FROM_DATE]: BLANK,
  [VISITATION.TO_DATE]: BLANK,
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
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: VISITATION.IN_CHARGE,
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
  ];

const initialState: VisitationFilterState = {
  visitations: [],
  visitationFilter: INITIAL_VISITATION_FILTER,
  visitationOrderDirection: ORDER_DIRECTION.ASC,
  visitationTableHeaderItemList: INITIAL_VISITATION_TABLE_HEADER_LIST,
  visitationPage: 1,
};

export const fetchVisitations = createAsyncThunk<
  Visitation[],
  { headerType?: HEADER_BAR },
  { state: RootState }
>(
  'visitations/fetchVisitations',
  async ({ headerType }, { getState, dispatch, rejectWithValue }) => {
    const state = getState().visitationFilter;
    const {
      visitationPage,
      visitationOrderBy,
      visitationOrderDirection,
      visitations,
      visitationFilter,
    } = state;
    const churchId = getState().church.churchId;
    const user = getState().user.user;
    const visitationsApi = new VisitationsApi(false);
    const visitationReportsApi = new VisitationReportsApi(false);

    try {
      if (headerType === HEADER_BAR.REPORTED) {
        const response = await visitationReportsApi.getVisitationReports({});

        const reports: VisitationReport[] = response.data.data;
        const newVisitations = reports.map((report) => report.visitation);
        const existingIds = new Set(
          visitations.map((visitation) => visitation.id)
        );

        const filteredNewVisitations = newVisitations.filter(
          (visitation) => !existingIds.has(visitation.id)
        );

        const updatedVisitations =
          visitationPage === 1
            ? newVisitations
            : [...visitations, ...filteredNewVisitations];

        return updatedVisitations;
      } else {
        const response = await visitationsApi.getVisitations({
          churchId,
          page: visitationPage,
          take: 30, // 무한 스크롤 최적화
          order: visitationOrderBy || undefined,
          orderDirection: visitationOrderDirection,
          fromStartDate: visitationFilter[VISITATION.FROM_DATE],
          toStartDate: visitationFilter[VISITATION.TO_DATE],
          inChargeId:
            headerType === HEADER_BAR.MY
              ? user.churchUser[0].memberId
              : visitationFilter[VISITATION.IN_CHARGE].id,
          title: visitationFilter[VISITATION.TITLE],
          status: visitationFilter[VISITATION.STATUS],
        });

        const newVisitations: Visitation[] = response.data.data;
        const existingIds = new Set(
          visitations.map((visitation) => visitation.id)
        );
        const filteredNewVisitations = newVisitations.filter(
          (visitation) => !existingIds.has(visitation.id)
        );

        const updatedVisitations =
          visitationPage === 1
            ? newVisitations
            : [...visitations, ...filteredNewVisitations];

        return updatedVisitations;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data as any;
        const status = data?.statusCode ?? error.response?.status;
        const message = data.message;

        dispatch(setToastText(message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));

        return rejectWithValue(message);
      }

      if (error instanceof Error) {
        dispatch(setToastText(error.message));
        dispatch(setToastBackgroundColor(DESTRUCTIVE.DEFAULT));
        dispatch(setIsToastShown(true));
        return rejectWithValue(error.message);
      }

      return rejectWithValue(
        '심방 목록을 불러오는 중 알 수 없는 오류가 발생했습니다.'
      );
    }
  }
);

const VisitationFilterSlice = createSlice({
  name: 'visitationFilter',
  initialState,
  reducers: {
    setVisitations: (state, action: PayloadAction<Visitation[]>) => {
      state.visitations = action.payload;
    },
    setVisitationFilter: (state, action: PayloadAction<VISITATION_FILTER>) => {
      state.visitationFilter = action.payload;
    },
    setVisitationOrderBy(state, action: PayloadAction<VISITATION>) {
      state.visitationOrderBy = action.payload;
    },
    setVisitationOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.visitationOrderDirection = action.payload;
    },
    setVisitationTableHeaderItemList(
      state,
      action: PayloadAction<VISITATION_TABLE_HEADER_ITEM[]>
    ) {
      state.visitationTableHeaderItemList = action.payload;
    },
    setVisitationPage: (state, action: PayloadAction<number>) => {
      state.visitationPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchVisitations.fulfilled, (state, action) => {
      state.visitations = action.payload;
    });
  },
});

export const {
  setVisitations,
  setVisitationFilter,
  setVisitationOrderBy,
  setVisitationOrderDirection,
  setVisitationTableHeaderItemList,
  setVisitationPage,
} = VisitationFilterSlice.actions;
export default VisitationFilterSlice.reducer;
