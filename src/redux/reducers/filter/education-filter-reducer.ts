import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { Education } from '@/models/education/education';
import { RootState } from '@/redux/store';
import { EducationsApi } from '@/api/education/educations.api';

import { EDUCATION } from '@/constants/education/education-column';

type EDUCATION_FILTER = {
  [EDUCATION.NAME]: string;
};

type EducationFilterState = {
  educations: Education[];
  educationFilter: EDUCATION_FILTER;
  educationOrderBy: EDUCATION | typeof NULL;
  educationOrderDirection: ORDER_DIRECTION;
  educationTableHeaderItemList: EDUCATION_TABLE_HEADER_ITEM[];
};

export const INITIAL_EDUCATION_FILTER: EDUCATION_FILTER = {
  [EDUCATION.NAME]: BLANK,
};

export type EDUCATION_TABLE_HEADER_ITEM = {
  id: EDUCATION;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_EDUCATION_TABLE_HEADER_LIST: EDUCATION_TABLE_HEADER_ITEM[] =
  [
    {
      id: EDUCATION.NAME,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

const initialState: EducationFilterState = {
  educations: [],
  educationFilter: INITIAL_EDUCATION_FILTER,
  educationOrderBy: NULL,
  educationOrderDirection: ORDER_DIRECTION.ASC,
  educationTableHeaderItemList: INITIAL_EDUCATION_TABLE_HEADER_LIST,
};

export const fetchEducations = createAsyncThunk<
  Education[],
  { churchId: string; currentPage: number },
  { state: RootState }
>(
  'educations/fetchEducations',
  async ({ churchId, currentPage }, { getState, rejectWithValue }) => {
    const state = getState().educationFilter;
    const { educationOrderBy, educationOrderDirection, educationFilter } =
      state;
    const educationsApi = new EducationsApi(false);

    try {
      const response = await educationsApi.getEducations({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: educationOrderBy !== NULL ? educationOrderBy : undefined,
        orderDirection: educationOrderDirection,
        name: educationFilter.name,
      });

      return response.data.data;
    } catch (error) {
      console.error('교육 목록 불러오기 실패', error);
      return rejectWithValue('교육 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const EducationFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setEducations: (state, action: PayloadAction<Education[]>) => {
      state.educations = action.payload;
    },
    setEducationFilter: (state, action: PayloadAction<EDUCATION_FILTER>) => {
      state.educationFilter = action.payload;
    },
    setEducationOrderBy(state, action: PayloadAction<EDUCATION | typeof NULL>) {
      state.educationOrderBy = action.payload;
    },
    setEducationOrderDirection(state, action: PayloadAction<ORDER_DIRECTION>) {
      state.educationOrderDirection = action.payload;
    },
    setEducationTableHeaderItemList(
      state,
      action: PayloadAction<EDUCATION_TABLE_HEADER_ITEM[]>
    ) {
      state.educationTableHeaderItemList = action.payload;
    },
  },
});

export const {
  setEducations,
  setEducationFilter,
  setEducationOrderBy,
  setEducationOrderDirection,
  setEducationTableHeaderItemList,
} = EducationFilterSlice.actions;
export default EducationFilterSlice.reducer;
