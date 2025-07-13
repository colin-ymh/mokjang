import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK } from '@/constants/constant';
import {
  Group,
  Ministry,
  MinistryGroup,
  Officer,
} from '@/models/management/management';
import { RootState } from '@/redux/store';
import { Church, DEFAULT_CHURCH } from '@/models/church/church';
import { getOrderedGroups } from '@/utils/group';
import { OfficersApi } from '@/api/management/officer/officers.api';
import { getOrderedMinistryGroups } from '@/utils/ministry';

type ChurchState = {
  churchId: string;
  church: Church;
  officers: Officer[];
  ministryGroups: MinistryGroup[];
  ministries: Ministry[];
  groups: Group[];
};

const initialState: ChurchState = {
  churchId: BLANK,
  church: DEFAULT_CHURCH,
  officers: [],
  ministryGroups: [],
  ministries: [],
  groups: [],
};

// **비동기 Thunk 액션: 직분 다시 불러오기**
export const fetchOfficers = createAsyncThunk<
  Officer[],
  void,
  { state: RootState }
>('church/fetchOfficers', async (_, { getState, rejectWithValue }) => {
  const state = getState().church;
  const { churchId } = state;
  const officersApi = new OfficersApi(false);

  if (!churchId) {
    return rejectWithValue('교회 ID가 없습니다.');
  }

  try {
    const response = await officersApi.getOfficers({ churchId });

    return response.data.data;
  } catch (error) {
    console.log('직분 목록 불러오기 실패:', error);
    return rejectWithValue('직분 목록을 불러오는 중 오류가 발생했습니다.');
  }
});

// **비동기 Thunk 액션: 현재 그룹 목록을 다시 불러오기**
export const fetchGroups = createAsyncThunk<
  Group[],
  void,
  { state: RootState }
>('church/fetchGroups', async (_, { getState, rejectWithValue }) => {
  const state = getState().church;
  const { churchId } = state;
  if (!churchId) {
    return rejectWithValue('교회 ID가 없습니다.');
  }

  try {
    const orderedGroups = await getOrderedGroups(churchId);

    const allGroup: Group = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: BLANK,
      order: 0,
      parentGroupId: null,
      childGroups: orderedGroups, // 모든 그룹을 하위 그룹으로 설정
      membersCount: 0,
      churchId,
      childGroupIds: [],
      roles: [],
    };

    return [allGroup];
  } catch (error) {
    console.log('그룹 목록 불러오기 실패:', error);
    return rejectWithValue('그룹 목록을 불러오는 중 오류가 발생했습니다.');
  }
});

// **비동기 Thunk 액션: 현재 그룹 목록을 다시 불러오기**
export const fetchMinistryGroups = createAsyncThunk<
  MinistryGroup[],
  void,
  { state: RootState }
>('church/fetchMinistryGroups', async (_, { getState, rejectWithValue }) => {
  const state = getState().church;
  const { churchId } = state;
  if (!churchId) {
    return rejectWithValue('교회 ID가 없습니다.');
  }

  try {
    const orderedMinistryGroups = await getOrderedMinistryGroups(churchId);

    const allGroup: MinistryGroup = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: BLANK,

      parentMinistryGroupId: null,
      childMinistryGroups: orderedMinistryGroups, // 모든 그룹을 하위 그룹으로 설정
      churchId,
      childMinistryGroupIds: [],
      ministries: [],
    };

    return [allGroup];
  } catch (error) {
    console.log('그룹 목록 불러오기 실패:', error);
    return rejectWithValue('그룹 목록을 불러오는 중 오류가 발생했습니다.');
  }
});

const ChurchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setChurchId(state, action: PayloadAction<string>) {
      state.churchId = action.payload;
    },
    setChurch(state, action: PayloadAction<Church>) {
      state.church = action.payload;
    },
    setOfficers(state, action: PayloadAction<Officer[]>) {
      state.officers = action.payload;
    },
    setMinistryGroups(state, action: PayloadAction<MinistryGroup[]>) {
      state.ministryGroups = action.payload;
    },
    setMinistries(state, action: PayloadAction<Ministry[]>) {
      state.ministries = action.payload;
    },
    setGroups(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchOfficers.fulfilled, (state, action) => {
      state.officers = action.payload;
    });

    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });

    builder.addCase(fetchMinistryGroups.fulfilled, (state, action) => {
      state.ministryGroups = action.payload;
    });
  },
});

export const {
  setChurchId,
  setChurch,
  setOfficers,
  setMinistryGroups,
  setMinistries,
  setGroups,
} = ChurchSlice.actions;

export default ChurchSlice.reducer;
