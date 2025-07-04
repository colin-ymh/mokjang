import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import {
  PermissionTemplate,
  PermissionUnit,
} from '@/models/permission/permission';
import { PERMISSION_TEMPLATE } from '@/constants/permission/permission-column';
import { RootState } from '@/redux/store';
import { PermissionsApi } from '@/api/permissions/permissions.api';
import { Member } from '@/models/member/member';

type PERMISSION_TEMPLATE_FILTER = {
  [PERMISSION_TEMPLATE.TITLE]: string;
  [PERMISSION_TEMPLATE.UNITS]: string[];
};

type PermissionTemplateFilterState = {
  permissionManagers: Member[];
  permissionTemplates: PermissionTemplate[];
  permissionUnits: PermissionUnit[];
  permissionTemplateFilter: PERMISSION_TEMPLATE_FILTER;
  permissionTemplateOrderBy: PERMISSION_TEMPLATE | typeof NULL;
  permissionTemplateOrderDirection: ORDER_DIRECTION;
  permissionTemplateTableHeaderItemList: PERMISSION_TEMPLATE_TABLE_HEADER_ITEM[];
};

export const INITIAL_PERMISSION_TEMPLATE_FILTER: PERMISSION_TEMPLATE_FILTER = {
  [PERMISSION_TEMPLATE.TITLE]: BLANK,
  [PERMISSION_TEMPLATE.UNITS]: [],
};

export type PERMISSION_TEMPLATE_TABLE_HEADER_ITEM = {
  id: PERMISSION_TEMPLATE;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_PERMISSION_TEMPLATE_TABLE_HEADER_LIST: PERMISSION_TEMPLATE_TABLE_HEADER_ITEM[] =
  [
    {
      id: PERMISSION_TEMPLATE.TITLE,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: PERMISSION_TEMPLATE.RANGE,
      isShown: true,
      isSortable: false,
      isFilterable: false,
      isFixed: true,
      isDate: false,
    },
  ];

const initialState: PermissionTemplateFilterState = {
  permissionManagers: [],
  permissionTemplates: [],
  permissionUnits: [],
  permissionTemplateFilter: INITIAL_PERMISSION_TEMPLATE_FILTER,
  permissionTemplateOrderBy: NULL,
  permissionTemplateOrderDirection: ORDER_DIRECTION.ASC,
  permissionTemplateTableHeaderItemList:
    INITIAL_PERMISSION_TEMPLATE_TABLE_HEADER_LIST,
};

export const fetchPermissionTemplates = createAsyncThunk<
  PermissionTemplate[],
  {
    currentPage: number;
  },
  { state: RootState }
>(
  'permissionTemplates/fetchPermissionTemplates',
  async ({ currentPage }, { getState, rejectWithValue }) => {
    const state = getState().permissionTemplateFilter;
    const churchId = getState().church.churchId;
    const {
      permissionTemplateOrderBy,
      permissionTemplateOrderDirection,
      permissionTemplateFilter,
    } = state;
    const permissionsApi = new PermissionsApi(false);

    try {
      const response = await permissionsApi.getPermissionTemplates({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order:
          permissionTemplateOrderBy !== NULL
            ? permissionTemplateOrderBy
            : undefined,
        orderDirection: permissionTemplateOrderDirection,
      });

      return response.data.data;
    } catch (error) {
      console.error('권한유형 목록 불러오기 실패', error);
      return rejectWithValue(
        '권한유형 목록을 불러오는 중 오류가 발생했습니다.'
      );
    }
  }
);

export const fetchPermissionUnits = createAsyncThunk<
  PermissionUnit[], // 1) fulfilled 시 반환 타입
  {}, // 2) dispatch 시 넘길 인자 타입 (없으면 void)
  { state: RootState } // 3) ThunkAPI 설정 (getState 타입 등)
>(
  'permissionUnits/fetchPermissionUnits',
  async ({}, { rejectWithValue, getState }) => {
    const churchId = getState().church.churchId;
    const permissionsApi = new PermissionsApi(false);

    try {
      const response = await permissionsApi.getPermissionUnits({
        churchId,
      });
      return response.data.data;
    } catch (error) {
      console.error('권한 목록 불러오기 실패', error);
      return rejectWithValue('권한 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

export const fetchPermissionManagers = createAsyncThunk<
  Member[], // 1) fulfilled 시 반환 타입
  {
    templateId: string;
  }, // 2) dispatch 시 넘길 인자 타입 (없으면 void)
  { state: RootState } // 3) ThunkAPI 설정 (getState 타입 등)
>(
  'permissionUnits/fetchPermissionManagers',
  async ({ templateId }, { rejectWithValue, getState }) => {
    const churchId = getState().church.churchId;
    const permissionsApi = new PermissionsApi(false);

    try {
      const response = await permissionsApi.getPermissionManagers({
        churchId,
        templateId,
      });
      return response.data.data;
    } catch (error) {
      console.error('권한 유형에 속한 관리자 목록 불러오기 실패', error);
      return rejectWithValue(
        '권한 유형에 속한 관리자 목록을 불러오는 중 오류가 발생했습니다.'
      );
    }
  }
);

const PermissionTemplateFilterSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    setPermissionManagers: (state, action: PayloadAction<Member[]>) => {
      state.permissionManagers = action.payload;
    },
    setPermissionUnits: (state, action: PayloadAction<PermissionUnit[]>) => {
      state.permissionUnits = action.payload;
    },
    setPermissionTemplates: (
      state,
      action: PayloadAction<PermissionTemplate[]>
    ) => {
      state.permissionTemplates = action.payload;
    },
    setPermissionTemplateFilter: (
      state,
      action: PayloadAction<PERMISSION_TEMPLATE_FILTER>
    ) => {
      state.permissionTemplateFilter = action.payload;
    },
    setPermissionTemplateOrderBy(
      state,
      action: PayloadAction<PERMISSION_TEMPLATE | typeof NULL>
    ) {
      state.permissionTemplateOrderBy = action.payload;
    },
    setPermissionTemplateOrderDirection(
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) {
      state.permissionTemplateOrderDirection = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // 권한 단위 리스트
      .addCase(
        fetchPermissionUnits.fulfilled,
        (state, action: PayloadAction<PermissionUnit[]>) => {
          state.permissionUnits = action.payload;
        }
      )
      // 권한 관리자 리스트
      .addCase(
        fetchPermissionManagers.fulfilled,
        (state, action: PayloadAction<Member[]>) => {
          state.permissionManagers = action.payload;
        }
      );
  },
});

export const {
  setPermissionManagers,
  setPermissionUnits,
  setPermissionTemplates,
  setPermissionTemplateFilter,
  setPermissionTemplateOrderBy,
  setPermissionTemplateOrderDirection,
} = PermissionTemplateFilterSlice.actions;
export default PermissionTemplateFilterSlice.reducer;
