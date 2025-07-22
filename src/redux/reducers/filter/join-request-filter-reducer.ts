import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK, ORDER_DIRECTION } from '@/constants/constant';
import { RootState } from '@/redux/store';
import { JOIN_REQUEST_STATUS } from '@/constants/status/status';
import { JOIN_REQUEST } from '@/constants/column/join-request-column';
import { JoinRequest } from '@/models/join-request/join-request';
import { JoinRequestsApi } from '@/api/join-request/join-request.api';
import { USER } from '@/constants/column/user-column';

type JOIN_REQUEST_FILTER = {
  [JOIN_REQUEST.NAME]: string;
  [JOIN_REQUEST.MOBILE_PHONE]: string;
  [JOIN_REQUEST.FROM_CREATED_AT]: string;
  [JOIN_REQUEST.TO_CREATED_AT]: string;
};

type JoinRequestFilterState = {
  joinRequests: JoinRequest[];
  joinRequestFilter: JOIN_REQUEST_FILTER;
  joinRequestOrderBy?: JOIN_REQUEST | USER;
  joinRequestOrderDirection: ORDER_DIRECTION;
  joinRequestTableHeaderItemList: JOIN_REQUEST_TABLE_HEADER_ITEM[];
};

export const INITIAL_JOIN_REQUEST_FILTER: JOIN_REQUEST_FILTER = {
  [JOIN_REQUEST.NAME]: BLANK,
  [JOIN_REQUEST.MOBILE_PHONE]: BLANK,
  [JOIN_REQUEST.FROM_CREATED_AT]: BLANK,
  [JOIN_REQUEST.TO_CREATED_AT]: BLANK,
};

export type JOIN_REQUEST_TABLE_HEADER_ITEM = {
  id: JOIN_REQUEST;
  isShown: boolean;
  isSortable: boolean;
  isFilterable: boolean;
  isFixed?: boolean;
  isDate?: boolean;
};

export const INITIAL_JOIN_REQUEST_TABLE_HEADER_LIST: JOIN_REQUEST_TABLE_HEADER_ITEM[] =
  [
    {
      id: JOIN_REQUEST.NAME,
      isShown: true,
      isSortable: false,
      isFilterable: true,
      isFixed: true,
      isDate: false,
    },
    {
      id: JOIN_REQUEST.MOBILE_PHONE,
      isShown: true,
      isSortable: false,
      isFilterable: false,
      isFixed: true,
      isDate: false,
    },
    // {
    //   id: JOIN_REQUEST.STATUS,
    //   isShown: true,
    //   isSortable: false,
    //   isFilterable: false,
    //   isFixed: true,
    //   isDate: false,
    // },
    {
      id: JOIN_REQUEST.CREATED_AT,
      isShown: true,
      isSortable: false,
      isFilterable: false,
      isFixed: true,
      isDate: true,
    },
  ];

const initialState: JoinRequestFilterState = {
  joinRequests: [],
  joinRequestFilter: INITIAL_JOIN_REQUEST_FILTER,
  joinRequestOrderDirection: ORDER_DIRECTION.ASC,
  joinRequestTableHeaderItemList: INITIAL_JOIN_REQUEST_TABLE_HEADER_LIST,
};

export const fetchJoinRequests = createAsyncThunk<
  JoinRequest[],
  {
    currentPage: number;
    status: JOIN_REQUEST_STATUS;
  },
  { state: RootState }
>(
  'joinRequests/fetchJoinRequests',
  async ({ currentPage, status }, { getState, rejectWithValue }) => {
    const state = getState().joinRequestFilter;
    const churchId = getState().church.churchId;
    const { joinRequestOrderBy, joinRequestOrderDirection, joinRequestFilter } =
      state;
    const joinRequestsApi = new JoinRequestsApi(false);

    try {
      const response = await joinRequestsApi.getJoinRequests({
        churchId,
        page: currentPage,
        take: 30, // 무한 스크롤 최적화
        order: joinRequestOrderBy || undefined,
        orderDirection: joinRequestOrderDirection,
        // 필터
        status,
        toCreatedAt: joinRequestFilter.toCreatedAt,
        // 검색
      });

      return response.data.data;
    } catch (error) {
      console.error('업무 목록 불러오기 실패', error);
      return rejectWithValue('업무 목록을 불러오는 중 오류가 발생했습니다.');
    }
  }
);

const JoinRequestFilterSlice = createSlice({
  name: 'joinRequestFilter',
  initialState,
  reducers: {
    setJoinRequests: (state, action: PayloadAction<JoinRequest[]>) => {
      state.joinRequests = action.payload;
    },
    setJoinRequestFilter: (
      state,
      action: PayloadAction<JOIN_REQUEST_FILTER>
    ) => {
      state.joinRequestFilter = action.payload;
    },
    setJoinRequestOrderBy(state, action: PayloadAction<JOIN_REQUEST | USER>) {
      state.joinRequestOrderBy = action.payload;
    },
    setJoinRequestOrderDirection(
      state,
      action: PayloadAction<ORDER_DIRECTION>
    ) {
      state.joinRequestOrderDirection = action.payload;
    },
  },
});

export const {
  setJoinRequests,
  setJoinRequestFilter,
  setJoinRequestOrderBy,
  setJoinRequestOrderDirection,
} = JoinRequestFilterSlice.actions;
export default JoinRequestFilterSlice.reducer;
