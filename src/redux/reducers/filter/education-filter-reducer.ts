import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, ORDER_DIRECTION } from '@/constants/constant';
import { Education } from '@/models/education/education';
import { RootState } from '@/redux/store';

import { EDUCATION } from '@/constants/column/education-column';
import { EducationsApi } from '@/api/education/educations.api';

type EDUCATION_FILTER = {
  [EDUCATION.NAME]: string;
};

type EducationFilterState = {
  educations: Education[];
  educationFilter: EDUCATION_FILTER;
  educationOrderBy?: EDUCATION;
  educationOrderDirection: ORDER_DIRECTION;
  educationTableHeaderItemList: EDUCATION_TABLE_HEADER_ITEM[];
  educationPage: number;
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
      isSortable: true,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

const initialState: EducationFilterState = {
  educations: [],
  educationFilter: INITIAL_EDUCATION_FILTER,
  educationOrderDirection: ORDER_DIRECTION.ASC,
  educationTableHeaderItemList: INITIAL_EDUCATION_TABLE_HEADER_LIST,
  educationPage: 1,
};

export const fetchEducations = createAsyncThunk<
  Education[],
  void,
  { state: RootState }
>('educations/fetchEducations', async (_, { getState, rejectWithValue }) => {
  const state = getState().educationFilter;
  const {
    educationPage,
    educationOrderBy,
    educationOrderDirection,
    educations,
    educationFilter,
  } = state;
  const churchId = getState().church.churchId;
  const educationsApi = new EducationsApi(false);

  try {
    const response = await educationsApi.getEducations({
      churchId,
      page: educationPage,
      take: 30, // 무한 스크롤 최적화
      order: educationOrderBy || undefined,
      orderDirection: educationOrderDirection,
      name: educationFilter[EDUCATION.NAME],
    });

    const newEducations: Education[] = response.data.data;
    const existingIds = new Set(educations.map((education) => education.id));
    const filteredNewEducations = newEducations.filter(
      (education) => !existingIds.has(education.id)
    );

    const updatedEducations =
      educationPage === 1
        ? newEducations
        : [...educations, ...filteredNewEducations];

    return updatedEducations;
  } catch (error) {
    console.error('교육 목록 불러오기 실패', error);
    return rejectWithValue('교육 목록을 불러오는 중 오류가 발생했습니다.');
  }
});

const EducationFilterSlice = createSlice({
  name: 'educationFilter',
  initialState,
  reducers: {
    setEducations: (state, action: PayloadAction<Education[]>) => {
      state.educations = action.payload;
    },
    setEducationFilter: (state, action: PayloadAction<EDUCATION_FILTER>) => {
      state.educationFilter = action.payload;
    },
    setEducationOrderBy(state, action: PayloadAction<EDUCATION>) {
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
    setEducationPage: (state, action: PayloadAction<number>) => {
      state.educationPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchEducations.fulfilled, (state, action) => {
      state.educations = action.payload;
    });
  },
});

export const {
  setEducations,
  setEducationFilter,
  setEducationOrderBy,
  setEducationOrderDirection,
  setEducationTableHeaderItemList,
  setEducationPage,
} = EducationFilterSlice.actions;
export default EducationFilterSlice.reducer;
