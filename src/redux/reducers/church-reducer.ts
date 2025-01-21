import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK } from '@/constants/constant';
import { Education, Group, Officer } from '@/models/management/management';
import { RootState } from '@/redux/store';
import { GroupsApi } from '@/api/management/group/groups.api';

type churchManagementItem = {
  id: string;
  membersCount: number;
  name: string;
};

type ChurchState = {
  churchId: string;
  officers: Officer[];
  ministries: churchManagementItem[];
  educations: Education[];
  groups: Group[];
};

const initialState: ChurchState = {
  churchId: BLANK,
  officers: [],
  ministries: [],
  educations: [],
  groups: [],
};

// **비동기 Thunk 액션: 현재 그룹 목록을 다시 불러오기**
export const fetchGroups = createAsyncThunk<
  Group[],
  void,
  { state: RootState }
>('church/fetchGroups', async (_, { getState, rejectWithValue }) => {
  const state = getState().church;
  const groupsApi = new GroupsApi(false);
  const { churchId } = state;

  if (!churchId) {
    return rejectWithValue('교회 ID가 없습니다.');
  }

  try {
    const response = await groupsApi.getGroups({ churchId });

    return response.data;
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
    setOfficers(state, action: PayloadAction<Officer[]>) {
      state.officers = action.payload;
    },
    setMinistries(state, action: PayloadAction<churchManagementItem[]>) {
      state.ministries = action.payload;
    },
    setEducations(state, action: PayloadAction<Education[]>) {
      state.educations = action.payload;
    },
    setGroups(state, action: PayloadAction<Group[]>) {
      state.groups = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.groups = action.payload;
    });
  },
});

export const {
  setChurchId,
  setOfficers,
  setMinistries,
  setEducations,
  setGroups,
} = ChurchSlice.actions;

export default ChurchSlice.reducer;
