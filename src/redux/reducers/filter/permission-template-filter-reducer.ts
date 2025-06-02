import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, NULL, ORDER_DIRECTION } from '@/constants/constant';
import { PermissionTemplate } from '@/models/permission/permission';
import { PERMISSION_TEMPLATE } from '@/constants/permission/permission-column';
import { RootState } from '@/redux/store';
import { PermissionsApi } from '@/api/permissions/permissions.api';

type PERMISSION_TEMPLATE_FILTER = {
  [PERMISSION_TEMPLATE.NAME]: string;
  [PERMISSION_TEMPLATE.UNITS]: string[];
};

type PermissionTemplateFilterState = {
  permissionTemplates: PermissionTemplate[];
  permissionTemplateFilter: PERMISSION_TEMPLATE_FILTER;
  permissionTemplateOrderBy: PERMISSION_TEMPLATE | typeof NULL;
  permissionTemplateOrderDirection: ORDER_DIRECTION;
  permissionTemplateTableHeaderItemList: PERMISSION_TEMPLATE_TABLE_HEADER_ITEM[];
};

export const INITIAL_PERMISSION_TEMPLATE_FILTER: PERMISSION_TEMPLATE_FILTER = {
  [PERMISSION_TEMPLATE.NAME]: BLANK,
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
      id: PERMISSION_TEMPLATE.NAME,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: PERMISSION_TEMPLATE.UNITS,
      isShown: true,
      isSortable: false,
      isFilterable: false,
      isFixed: true,
      isDate: false,
    },
  ];

const initialState: PermissionTemplateFilterState = {
  permissionTemplates: [],
  permissionTemplateFilter: INITIAL_PERMISSION_TEMPLATE_FILTER,
  permissionTemplateOrderBy: NULL,
  permissionTemplateOrderDirection: ORDER_DIRECTION.ASC,
  permissionTemplateTableHeaderItemList:
    INITIAL_PERMISSION_TEMPLATE_TABLE_HEADER_LIST,
};

export const fetchPermissionTemplates = createAsyncThunk<
  PermissionTemplate[],
  {
    churchId: string;
    currentPage: number;
  },
  { state: RootState }
>(
  'permissionTemplates/fetchPermissionTemplates',
  async ({ churchId, currentPage }, { getState, rejectWithValue }) => {
    const state = getState().permissionTemplateFilter;
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
        // 필터
        name: permissionTemplateFilter.name,
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

const PermissionTemplateFilterSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
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
});

export const {
  setPermissionTemplates,
  setPermissionTemplateFilter,
  setPermissionTemplateOrderBy,
  setPermissionTemplateOrderDirection,
} = PermissionTemplateFilterSlice.actions;
export default PermissionTemplateFilterSlice.reducer;
