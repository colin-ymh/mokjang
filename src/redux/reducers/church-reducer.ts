import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BLANK } from '@/constants/constant';

type churchSettingItem = {
  id: string;
  membersCount: number;
  name: string;
};

type ChurchState = {
  churchId: string;
  officers: churchSettingItem[];
  ministries: churchSettingItem[];
  educations: churchSettingItem[];
  groups: churchSettingItem[];
};

const initialState: ChurchState = {
  churchId: BLANK,
  officers: [],
  ministries: [],
  educations: [],
  groups: [],
};

const ChurchSlice = createSlice({
  name: 'church',
  initialState,
  reducers: {
    setChurchId(state, action: PayloadAction<string>) {
      state.churchId = action.payload;
    },
    setOfficers(state, action: PayloadAction<churchSettingItem[]>) {
      state.officers = action.payload;
    },
    setMinistries(state, action: PayloadAction<churchSettingItem[]>) {
      state.ministries = action.payload;
    },
    setEducations(state, action: PayloadAction<churchSettingItem[]>) {
      state.educations = action.payload;
    },
    setGroups(state, action: PayloadAction<churchSettingItem[]>) {
      state.groups = action.payload;
    },
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
