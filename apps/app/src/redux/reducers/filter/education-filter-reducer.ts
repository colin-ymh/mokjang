import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, ORDER_DIRECTION } from '../../../constants/constant';
import { Education } from '../../../models/education/education';
import { RootState } from '../../store';

import {
  EDUCATION,
  EDUCATION_ATTENDANCE,
  EDUCATION_ENROLLMENT,
  EDUCATION_SESSION,
  EDUCATION_TERM,
} from '../../../constants/column/education-column';
import { EducationsApi } from '../../../api/education/educations.api';

type EDUCATION_FILTER = {
  [EDUCATION.NAME]: string;
};

type EducationFilterState = {
  educations: Education[];
  educationFilter: EDUCATION_FILTER;
  educationOrderBy?: EDUCATION;
  educationOrderDirection: ORDER_DIRECTION;
  educationTableHeaderItemList: EDUCATION_TABLE_HEADER_ITEM[];
  educationTermTableHeaderItemList: EDUCATION_TERM_TABLE_HEADER_ITEM[];
  educationSessionTableHeaderItemList: EDUCATION_SESSION_TABLE_HEADER_ITEM[];
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

export type EDUCATION_TERM_TABLE_HEADER_ITEM = {
  id: EDUCATION_TERM;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export type EDUCATION_SESSION_TABLE_HEADER_ITEM = {
  id: EDUCATION_SESSION;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export type EDUCATION_ENROLLMENT_TABLE_HEADER_ITEM = {
  id: EDUCATION_ENROLLMENT;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export type EDUCATION_ATTENDANCE_TABLE_HEADER_ITEM = {
  id: EDUCATION_ATTENDANCE;
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
    {
      id: EDUCATION.STATUS,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

export const INITIAL_EDUCATION_TERM_TABLE_HEADER_LIST: EDUCATION_TERM_TABLE_HEADER_ITEM[] =
  [
    {
      id: EDUCATION_TERM.NAME,
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
  ];

export const INITIAL_EDUCATION_SESSION_TABLE_HEADER_LIST: EDUCATION_SESSION_TABLE_HEADER_ITEM[] =
  [
    {
      id: EDUCATION_SESSION.NAME,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_SESSION.STATUS,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

export const EDUCATION_ENROLLMENT_TABLE_HEADER_LIST: EDUCATION_ENROLLMENT_TABLE_HEADER_ITEM[] =
  [
    {
      id: EDUCATION_ENROLLMENT.MEMBER_NAME,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ENROLLMENT.GROUP,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ENROLLMENT.MOBILE_PHONE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ENROLLMENT.ATTENDANCE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ENROLLMENT.STATUS,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
  ];

export const EDUCATION_ATTENDANCE_TABLE_HEADER_LIST: EDUCATION_ATTENDANCE_TABLE_HEADER_ITEM[] =
  [
    {
      id: EDUCATION_ATTENDANCE.MEMBER_NAME,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ATTENDANCE.AGE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ATTENDANCE.GENDER,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ATTENDANCE.MOBILE_PHONE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ATTENDANCE.STATUS,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: EDUCATION_ATTENDANCE.NOTE,
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
  educationOrderDirection: ORDER_DIRECTION.ASC,
  educationTableHeaderItemList: INITIAL_EDUCATION_TABLE_HEADER_LIST,
  educationTermTableHeaderItemList: INITIAL_EDUCATION_TERM_TABLE_HEADER_LIST,
  educationSessionTableHeaderItemList:
    INITIAL_EDUCATION_SESSION_TABLE_HEADER_LIST,
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
