import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { EducationSession, EducationTerm } from '@/models/education/education';
import { RootState } from '@/redux/store';

import { EDUCATION_TERM } from '@/constants/education/education-term-column';
import { EducationTermsApi } from '@/api/education/education-terms.api';
import { EducationSessionsApi } from '@/api/education/education-sessions.api';

type EDUCATION_TERM_FILTER = {
  [EDUCATION_TERM.EDUCATION]: string;
};

type EducationTermFilterState = {
  educationTerms: EducationTerm[];
  educationTermFilter: EDUCATION_TERM_FILTER;
  educationTermOrderBy: EDUCATION_TERM | typeof NULL;
  educationTermOrderDirection: ORDER_DIRECTION;
  educationTermTableHeaderItemList: EDUCATION_TABLE_HEADER_ITEM[];
};

export const INITIAL_EDUCATION_TERM_FILTER: EDUCATION_TERM_FILTER = {
  [EDUCATION_TERM.EDUCATION]: BLANK,
};

export type EDUCATION_TABLE_HEADER_ITEM = {
  id: EDUCATION_TERM;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_EDUCATION_TERM_TABLE_HEADER_LIST: EDUCATION_TABLE_HEADER_ITEM[] =
  [
    {
      id: EDUCATION_TERM.TERM,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_TERM.STATUS,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_TERM.IN_CHARGE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_TERM.PERIOD,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

const initialState: EducationTermFilterState = {
  educationTerms: [],
  educationTermFilter: INITIAL_EDUCATION_TERM_FILTER,
  educationTermOrderBy: NULL,
  educationTermOrderDirection: ORDER_DIRECTION.ASC,
  educationTermTableHeaderItemList: INITIAL_EDUCATION_TERM_TABLE_HEADER_LIST,
};

export const fetchEducationTerms = createAsyncThunk<
  EducationTerm[],
  { churchId: string; currentPage: number; educationId?: string },
  { state: RootState }
>(
  'educations/fetchEducationTerms',
  async (
    { churchId, currentPage, educationId },
    { getState, rejectWithValue }
  ) => {
    const state = getState().educationTermFilter;
    const {
      educationTermOrderBy,
      educationTermOrderDirection,
      educationTermFilter,
    } = state;
    const educationTermsApi = new EducationTermsApi(false);

    try {
      const response = await educationTermsApi.getEducationTerms({
        churchId,
        educationId: educationId || '1',
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: educationTermOrderBy !== NULL ? educationTermOrderBy : undefined,
        orderDirection: educationTermOrderDirection,
      });

      return response.data.data;
    } catch (error) {
      console.error('교육 목록 불러오기 실패', error);
      return rejectWithValue('교육 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const fetchEducationSessions = createAsyncThunk<
  EducationTerm[],
  { churchId: string },
  { state: RootState }
>(
  'educations/fetchEducationSessions',
  async ({ churchId }, { getState, rejectWithValue }) => {
    const state = getState().educationTermFilter;
    const { educationTerms } = state;
    const educationSessionsApi = new EducationSessionsApi(false);

    try {
      const newEducationTerms = await Promise.all(
        educationTerms.map(async (educationTerm) => {
          const response = await educationSessionsApi.getEducationSessions({
            churchId,
            educationId: educationTerm.educationId,
            educationTermId: educationTerm.id,
          });

          const newEducationSessions: EducationSession[] = response.data;

          return { ...educationTerm, educationSessions: newEducationSessions };
        })
      );

      return newEducationTerms;
    } catch (error) {
      console.error('교육 세션 목록 불러오기 실패', error);
      return rejectWithValue(
        '교육 세션 목록을 불러오는 중 오류가 발생했습니다.'
      );
    }
  }
);

const EducationTermFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setEducationTerms: (state, action: PayloadAction<EducationTerm[]>) => {
      state.educationTerms = action.payload;
    },
    setEducationTermFilter: (
      state,
      action: PayloadAction<EDUCATION_TERM_FILTER>
    ) => {
      state.educationTermFilter = action.payload;
    },
    setEducationTermOrderBy(
      state,
      action: PayloadAction<EDUCATION_TERM | typeof NULL>
    ) {
      state.educationTermOrderBy = action.payload;
    },
    setEducationTermOrderDirection(
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) {
      state.educationTermOrderDirection = action.payload;
    },
    setEducationTermTableHeaderItemList(
      state,
      action: PayloadAction<EDUCATION_TABLE_HEADER_ITEM[]>
    ) {
      state.educationTermTableHeaderItemList = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEducationSessions.fulfilled, (state, action) => {
      state.educationTerms = action.payload;
    });
  },
});

export const {
  setEducationTerms,
  setEducationTermFilter,
  setEducationTermOrderBy,
  setEducationTermOrderDirection,
  setEducationTermTableHeaderItemList,
} = EducationTermFilterSlice.actions;
export default EducationTermFilterSlice.reducer;
